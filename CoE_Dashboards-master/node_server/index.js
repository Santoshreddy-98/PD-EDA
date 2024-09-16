const express = require('express')
const app = express()
const cors = require('cors')
const crypto = require('crypto');
const {createFileLogger} = require("./LOG/logger")
app.use(express.json())
const bcrypt = require('bcrypt');
const dotenv = require("dotenv")
dotenv.config()
app.use(cors())
//Create logger for checklist api requests
const ChecklistLoggerMsg =require("./ChecklistLogger/logger")
// Create separate loggers for different APIs
const loginLogger = createFileLogger('login.log');
const adminRegisterLogger = createFileLogger('adminRegister.log');
const adminUpdateLogger = createFileLogger('adminUpdate.log');
const adminDeleteLogger = createFileLogger('adminDelete.log', 'info');
const adminFetchLogger = createFileLogger('adminFetch.log', 'info');
const passwordResetLogger = createFileLogger('passwordReset.log', 'info')
const {designAuditorAllQuestions} =require("./designauditorquestions")

app.get('/api/node', (req, res) => {
    res.status(200).json({ message: "App running..." })
})  

//My SQL Connection: 

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(`${process.env.database}`, `${process.env.dbUsername}`, `${process.env.dbPassword}`, {
    host: 'localhost',
    dialect: 'mysql',
});
async function MySQLConnection() {
    // Replace these with your actual database credentials
    try {
        // Test the connection
        await sequelize.authenticate();
        ChecklistLoggerMsg.info('Connection to the MySQL database has been established successfully.');
        return true;
    } catch (error) {
        ChecklistLoggerMsg.error('Unable to connect to the MySQL database:', error.message);
        return false;
    }
}
MySQLConnection()

//Now check list table creation: 
const Checklist = sequelize.define("Checklist", {
    projectName: {
        type: DataTypes.STRING
    },
    stage: {
        type: DataTypes.STRING,
    },
    milestoneName:{
        type: DataTypes.STRING
    },
    checklistType: {
        type: DataTypes.STRING,
        defaultValue: "preChecklist",
    },
    questions: {
        type: DataTypes.JSON,
    },
    DevName: {
        type: DataTypes.STRING, 
    },
    LeadName: {
        type: DataTypes.STRING,
    },
    pdDevPercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    pdLeadPercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    summaryPercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    isSummaryAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

//Router for check and add checklists: 
app.post("/api/:milestoneName/:projectName/:stage/:type", async (req, res) => {
    const { stage, type, projectName, milestoneName } = req.params;
    ChecklistLoggerMsg.info(`/api/${milestoneName}/${projectName}/${stage}/${type} API calling`)
    // console.log(req.body)
    const { role, questions, name } = req.body;

    const pdDevAnswers = questions.filter((question) => question.pdDevAnswer === "YES").length;
    const pdLeadAnswers = questions.filter((question) => question.pdLeadAnswer === "YES").length;

    const pdDevPercentage = (pdDevAnswers / questions.length) * 100;
    const pdLeadPercentage = (pdLeadAnswers / questions.length) * 100;
    const summaryPercentage = (pdDevPercentage + pdLeadPercentage) / 2;

    try {
        let checklistData = await Checklist.findOne({ where: { 
            projectName,
            milestoneName,
            stage, 
            checklistType: type,
         } });

        if (!checklistData) {
            checklistData = await Checklist.create({ stage, checklistType: type, projectName,milestoneName });
        }

        if (role === "PD Dev") {
            checklistData.DevName = name;
        } else if (role === "PD Lead") {
            checklistData.LeadName = name;
        } else {
            console.log("Role not available");
        }

        checklistData.questions = questions;
        checklistData.pdDevPercentage = pdDevPercentage.toFixed(2);
        checklistData.pdLeadPercentage = pdLeadPercentage.toFixed(2);
        checklistData.summaryPercentage = summaryPercentage.toFixed(2);
        checklistData.isSummaryAvailable = pdDevPercentage > 0 && pdLeadPercentage > 0;

        await checklistData.save();
        updateChecklistSummaryPercentage(projectName,milestoneName, stage, type, summaryPercentage);

        ChecklistLoggerMsg.info(`Checklist data saved for ${projectName } ,${stage} and ${milestoneName} successfully.`)
        return res.json({ message: "Checklist data saved successfully.", checklistData });
    } catch (error) {
        // console.error(error);
        ChecklistLoggerMsg.error("Error saving checklist data.")
        return res.status(500).json({ message: "Error saving checklist data." });
    }
});
 
//Roter for the get summary of the list of checklists: 
app.get("/api/:milestoneName/:projectName/:stage/:type", async (req, res) => {
    const { stage, type, projectName, milestoneName } = req.params;
    ChecklistLoggerMsg.info(`/api/${milestoneName}/${projectName}/${stage}/${type} API Calling.`)
    try {
        // Query the database to find the checklist that matches the stage and mile stone
        const checklist = await Checklist.findOne({
            where: {
                projectName,
                milestoneName,
                stage,
                checklistType: type,
            }
        });

        if (checklist) {
            // Checklist found, send it as a response
            ChecklistLoggerMsg.info(`Checklist Send for ${stage} and ${milestoneName} Successfully.`)
            res.json(checklist);
        } else {
            // if Checklist not found then it will send checklist questions

            const checklist = await ChecklistQuestions.findOne({
                where: {
                    stageName: stage,
                    milestoneName,
                    checklistType: type,
                },
            });
            if (checklist) {
                ChecklistLoggerMsg.info(`Checklist Questions Send for ${stage} and ${milestoneName} Successfully.`)
                res.json(checklist);
            } else {
                ChecklistLoggerMsg.info("Checklist Questions not found")
                res.status(404).json({ error: 'Checklist not found' });
            }
            // res.status(404).json({ message: 'Checklist not found' });
        }
    } catch (err) {
        // Handle any errors that occur during the database query
        // console.error('Error:', err);
        ChecklistLoggerMsg.error(err.message +"for /api/:milestoneName/:projectName/:stage/:type")
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//mutli Design Checklists: 

// Define the Sequelize model
const DesignAuditorDesignsModel = sequelize.define('DesignAuditorDesigns', {
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    questions: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    stages: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

// Prefect way to update the designAuditorDesigns for Summary

//how to generateChecklistVariableName
function generateChecklistVariableName(milestoneName) {
    const milestoneMappings = {
        "milestone_0.1": "milestone_01_percentage",
        "milestone_0.5": "milestone_05_percentage",
        "milestone_0.8": "milestone_08_percentage",
        "milestone_1.0": "milestone_10_percentage",
    };

    return milestoneMappings[milestoneName] || "";
}
async function updateChecklistSummaryPercentage(projectName,milestoneName, stage, type, percentage) {
    try {
        const filter = {
            projectName,
        };
        const updateField = generateChecklistVariableName(milestoneName)
        // Find the record
        const designInstance = await DesignAuditorDesignsModel.findOne({ where: filter });

        // Update the field in-memory
        const foundStage = designInstance.stages.find(item => item.name === stage);
        if (foundStage) {
            foundStage[updateField] = percentage;
        } else {
            console.log(`Stage ${stage} not found.`);
            return;
        }

        // Save the changes to the database
        const updatedDesign = await designInstance.save();

        ///modify the existing desing: 
        await DesignAuditorDesignsModel.update(
            updatedDesign.dataValues, { where: filter }
        )
        ChecklistLoggerMsg.info("Updated Summary Percentage for "+updateField +" and percentage is "+Math.round(percentage) +" %")

    } catch (error) {
        ChecklistLoggerMsg.error(error.message);
    }
}

// Route for creating a new design
app.post('/api/createDesign', async (req, res) => {
    try {
        const { projectName, questions, stages } = req.body;
        ChecklistLoggerMsg.info(`/api/createDesign/ API Calling`)
        // Create a new DesignAuditorDesigns record
        const newDesign = await DesignAuditorDesignsModel.create({
            projectName,
            questions,
            stages,
        });

        res.status(201).json(newDesign);
        ChecklistLoggerMsg.info(`${projectName} `)
    } catch (error) {
        // console.error(error);
        ChecklistLoggerMsg.error('/api/createDesign' + error.message );
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for retrieving all designs
app.get('/api/getAllDesigns', async (req, res) => {
    try {
        ChecklistLoggerMsg.info('/api/getAllDesigns API Calling');
        const designs = await DesignAuditorDesignsModel.findAll(
            {
                order: [['updatedAt', 'DESC']]
            }
        );
        res.status(200).json(designs);
        ChecklistLoggerMsg.info("/api/getAllDesigns -Successfully retrieved all designs")
    } catch (error) {
        // console.error(error);
        ChecklistLoggerMsg.error(error.message + '/api/getAllDesigns ');
        res.status(500).json({ error: 'Error retrieving designs' });
    }
});

//multiple checklist designs:
app.post("/api/yaml/add/checklist/design/:projectName", async (req, res) => {
    try {
        const projectName = req.params.projectName;
        ChecklistLoggerMsg.info(`/api/yaml/add/checklist/design/${projectName} API calling.`)
        // console.log(projectName + " for checklist design");
        const { questions, stages } = {
            "questions": [],
            "stages": [
                {
                    "name": 'Synthesis',
                    "milestone_01_checklist": true,
                    "milestone_05_checklist": true,
                    "milestone_08_checklist": true,
                    "milestone_10_checklist": true,
                    "milestone_01_percentage": 0,
                    "milestone_05_percentage": 0,
                    "milestone_08_percentage": 0,
                    "milestone_10_percentage": 0,
                },
                {
                    "name": 'Floorplan',
                    "milestone_01_checklist": false,
                    "milestone_05_checklist": true,
                    "milestone_08_checklist": true,
                    "milestone_10_checklist": true,
                    "milestone_01_percentage": 0,
                    "milestone_05_percentage": 0,
                    "milestone_08_percentage": 0,
                    "milestone_10_percentage": 0,
                },
                {
                    "name": 'Placement',
                    "milestone_01_checklist": false,
                    "milestone_05_checklist": true,
                    "milestone_08_checklist": true,
                    "milestone_10_checklist": true,
                    "milestone_01_percentage": 0,
                    "milestone_05_percentage": 0,
                    "milestone_08_percentage": 0,
                    "milestone_10_percentage": 0,
                },
                {
                    "name": 'CTS',
                    "milestone_01_checklist": false,
                    "milestone_05_checklist": true,
                    "milestone_08_checklist": true,
                    "milestone_10_checklist": true,
                    "milestone_01_percentage": 0,
                    "milestone_05_percentage": 0,
                    "milestone_08_percentage": 0,
                    "milestone_10_percentage": 0,
                },
                {
                    "name": 'Route',
                    "milestone_01_checklist": false,
                    "milestone_05_checklist": true,
                    "milestone_08_checklist": true,
                    "milestone_10_checklist": true,
                    "milestone_01_percentage": 0,
                    "milestone_05_percentage": 0,
                    "milestone_08_percentage": 0,
                    "milestone_10_percentage": 0,
                }
            ]

        };
        // console.log(req.body)
        const isDesignExit = await DesignAuditorDesignsModel.findOne({ where: { projectName } });
        // console.log(isDesignExit);
        if (isDesignExit !== null) {
            res.status(400).send(`The design checklist with the specified name, ${projectName}, already exists.`);
            ChecklistLoggerMsg.info(`Design checklist with the specified name, ${projectName} ,already exists`);
        } else {
            const newDesign = await DesignAuditorDesignsModel.create({
                projectName,
                questions,
                stages,
            });

            res.status(201).json(newDesign);
            ChecklistLoggerMsg.info(`Design checklist with the specified name, ${projectName} ,created successfully`);
        }
    } catch (error) {
        // console.error(error);
        ChecklistLoggerMsg.error(`Design checklist with the specified name, ${projectName} could not be created`,error.message)
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
)

//Design Auditor checklist questionnaire

//Define model for the questionnaire

const ChecklistQuestions = sequelize.define('ChecklistQuestions', {
    stageName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    milestoneName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    checklistType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    questions: {
        type: DataTypes.JSON,
        // allowNull: false,
    },
});

app.post("/api/questions/create/:milestoneName/:stageName/:checklistType", async (req, res) => {
    try {
        const { stageName, checklistType, milestoneName } = req.params;
        const { questions } = req.body;
        ChecklistLoggerMsg.info(`/api/questions/create/${milestoneName}/${stageName}/${checklistType} API Calling`)
        // Check if questions already exist
        const existingQuestions = await ChecklistQuestions.findOne({
            where: { stageName: stageName, checklistType: checklistType, milestoneName }
        });

        if (existingQuestions) {
            // If questions exist, update them
            await ChecklistQuestions.update({ questions }, {
                where: { stageName: stageName, checklistType: checklistType, milestoneName }
            });
            ChecklistLoggerMsg.info("Questions Updated Successfully")
            res.status(200).json({ message: 'Questions updated successfully' });
        } else {
            // If questions don't exist, create them
            const newChecklist = await ChecklistQuestions.create({
                stageName,
                checklistType,
                questions,
                milestoneName
            });

            res.status(201).json(newChecklist);
            ChecklistLoggerMsg.info(`Checklist Questions Created successfully for ${stageName} and ${milestoneName}`)
        }
    } catch (error) {
        ChecklistLoggerMsg.error("Failed to create Checklist Questions" + error.message)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get checklist by stage name and checklist type
app.get("/api/questions/get/:milestoneName/:stageName/:checklistType", async (req, res) => {
    try {
        ChecklistLoggerMsg.info("/api/questions/get/:milestoneName/:stageName/:checklistType API Calling.")
        const { stageName, checklistType, milestoneName } = req.params;
        const checklist = await ChecklistQuestions.findOne({
            where: { stageName, checklistType, milestoneName },
        });
        if (checklist) {
            res.json(checklist);
            ChecklistLoggerMsg.info(`Checklist questions for  ${stageName} and ${milestoneName} sent successfully.`)
        } else {
            res.status(404).json({ error: 'Checklist questions not found' });
            ChecklistLoggerMsg.info(`Checklist questions for ${stageName} and ${milestoneName} is not found.`)
        }
    } catch (error) {
        // console.error(error);
        ChecklistLoggerMsg('/api/questions/get/:milestoneName/:stageName/:checklistType'+error.message)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Some of the sample questions for design auditor: 
app.get('/api/questions/insert', async (req, res) => {
    try {
        // Delete all existing questions
        await ChecklistQuestions.destroy({ where: {} });
        ChecklistLoggerMsg.info("/api/questions/insert API calling...")
        // Map the array to Sequelize model instances
        const instances = designAuditorAllQuestions.map(data => ({
            stageName: data.stageName,
            milestoneName: data.milestoneName,
            checklistType: data.checklistType,
            questions: data.questions,
        }));

        // Use bulkCreate to insert all instances at once
        await ChecklistQuestions.bulkCreate(instances);

        res.status(201).json({ message: 'Data inserted successfully' });
        ChecklistLoggerMsg.info("/api/questions/insert -Questions added successfully")
    } catch (error) {
        ChecklistLoggerMsg.error(`/api/questions/insert -Failed to add questions ,  ` +error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Admin list table creation:
const Admin = sequelize.define('Admin', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^[A-Za-z\s]*$/,
                msg: "Name must contain only letters and spaces.",
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Invalid email format.",
            },
        },
    },
    isAdmin: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['PD Dev', 'PD Lead', 'Manager', 'Admin']],
                msg: "Invalid role.",
            },
        },
    },
    resetToken: {
        type: DataTypes.STRING, // or appropriate data type
    },
    resetExpiration: {
        type: DataTypes.DATE, // or appropriate data type
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])/, // Your regex pattern for password
                msg: "Password must contain a number, an uppercase letter, and a special character.",
            },
        },
    },
}, {
    tableName: 'admins',
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(admin.password, salt);
                admin.password = hash;
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(admin.password, salt);
                admin.password = hash;
            }
        },
    }

});


// User login
app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Log the request information using the login logger
      loginLogger.info(`Received login API request:${ username }`, );
  
      // Find the user in the database by username
      const user = await Admin.findOne({ where: { name: username } });
  
      // If the user doesn't exist, or the password is incorrect, return an error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        // Log the failed login attempt
        loginLogger.warn(`Invalid username or password:${ username }`);
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // If login is successful, generate a token or include relevant user information
      res.json({
        message: 'Login successful',
        userInfo: {
          username: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
        },
      });
  
      // Log the successful login
      loginLogger.info(`Login successful:${username }`);
    } catch (error) {
      // Log the error
      loginLogger.error(`Failed to process login API request:${ error }`);
  
      console.error(error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

//register user  
app.post('/api/adminregister', async (req, res) => {
    try {
        const { name, email, password, isAdmin, role } = req.body;


        // Log the request information using the admin register logger
        adminRegisterLogger.info("Received admin register API request");

        const newAdmin = await Admin.create({ name, email, password, isAdmin, role });

        res.status(201).json(newAdmin);
        // Log the successful admin register
        adminRegisterLogger.info(`Admin register successful: ${newAdmin.name}, ${newAdmin.email}, ${newAdmin.role}`);
    } catch (error) {

        // Log the error
    adminRegisterLogger.error(`Error processing admin register API request:${ error }` );
        res.status(500).json({ error: "Failed to register an admin" });
    }
})

// New route to get admin data
app.get('/api/admins', async (req, res) => {
    try {
      // Log the request information using the admin fetch logger
      adminFetchLogger.info('Received admin fetch API request');
  
      const admins = await Admin.findAll();
  
      // Log the successful admin fetch
      adminFetchLogger.info('Admin fetch successful');
  
      res.status(200).json(admins);
    } catch (error) {
      // Log the error
      adminFetchLogger.error(`Failed to process admin fetch API request: ${error}`);
  
      console.error('Error fetching admins:', error);
      res.status(500).json({ error: 'Failed to fetch admins' });
    }
  });

// a route to update an admin by ID
app.put('/api/admin/:id', async (req, res) => {
    try {
        const { name, email, password, isAdmin, role } = req.body;
        const adminId = req.params.id;

        // Log the request information using the admin update logger
    adminUpdateLogger.info('Received admin update API request');

        const errors = [];

        if (!/^[A-Za-z\s]*$/.test(name)) {
            errors.push({ field: "name", message: "Name must contain only letters and spaces." });
        }

        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            errors.push({ field: "email", message: "Invalid email format." });
        }

        if (errors.length > 0) {
            adminUpdateLogger.warn(`Invalid data received: ${errors[0].message}`);
            return res.status(400).json({ errors });
        }

        const updatedAdmin = await Admin.findByPk(adminId);

        if (!updatedAdmin) {
            adminUpdateLogger.warn(`Admin not found: ${adminId}`);
            return res.status(404).json({ error: "Admin not found" });
        }

        await updatedAdmin.update({ name, email, password, isAdmin, role });
        // Log the successful admin update
    adminUpdateLogger.info(`Admin update successful:${adminId},${updatedAdmin.name},${updatedAdmin.email},${updatedAdmin.role}`);

        res.status(200).json(updatedAdmin);
    } catch (error) {
        // Log the error
    adminUpdateLogger.error(`Failed to process admin update API request:${ error }`);
        // console.error("Error updating admin:", error);
        res.status(500).json({ error: "Failed to update admin" });
    }
});

// Backend API route for deleting an admin by ID
app.delete('/api/admin/:id', async (req, res) => {
    try {
      const adminId = req.params.id;
  
      // Log the request information using the admin delete logger
      adminDeleteLogger.info(`Received admin delete API request for admin ID: ${adminId}`);
  
      const adminToDelete = await Admin.findByPk(adminId);
  
      if (!adminToDelete) {
        // Log the admin not found
        adminDeleteLogger.warn(`Admin not found for admin ID: ${adminId}`);
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      const deletedAdminName = adminToDelete.name; // Get the name of the admin being deleted
  
      await adminToDelete.destroy();
  
      // Log the successful admin deletion
      adminDeleteLogger.info(`Admin deletion successful for admin ID: ${adminId}, Name: ${deletedAdminName}`);
  
      res.status(204).send();
    } catch (error) {
      // Log the error
      adminDeleteLogger.error(`Failed to process admin delete API request: ${error}`);
  
      console.error('Error deleting admin:', error);
      res.status(500).json({ error: 'Failed to delete admin' });
    }
  });

// route for handling reset link generation
app.post('/api/request/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });

        if (admin) {
            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetExpiration = Date.now() + 3600000; // Token expires in 1hr

            // Update the 'Admin' model with the resetToken and resetExpiration
            await admin.update({ resetToken, resetExpiration });

            // Include resetToken in the response
            return res.status(200).json({ message: 'Reset token generated successfully.', resetToken });
        } else {
            return res.status(404).json({ error: 'Admin not found.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


//  route for handling password reset
app.post('/api/reset/password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Log the request information using the password reset logger
        passwordResetLogger.info('Received password reset API request');

        // Find the admin in the database by resetToken
        const admin = await Admin.findOne({ where: { resetToken: token } });

        if (admin && admin.resetExpiration > Date.now()) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the admin's password and clear the resetToken
            await Admin.update(
                { password: hashedPassword, resetToken: null },
                { where: { resetToken: token } }
            );

            // Log the successful password reset
            passwordResetLogger.info(`Password reset successful: ${admin.id}, ${admin.name}, ${admin.email}`);

            return res.status(200).json({ message: 'Password reset successfully.' });
        } else {
            passwordResetLogger.warn(`Invalid or expired token: ${token}`);
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }
    } catch (error) {
        // Log the error
        passwordResetLogger.error(`Failed to process password reset API request: ${error}`);
        console.error(error);
        return res.status(500).json({ error: 'Failed to reset password' });
    }
});


// Sync the Sequelize model with the database
sequelize.sync();


//Server Info: 
app.listen(process.env.Node_Port, () => {
    console.log(`Server listening on port: ${process.env.Node_Port}`);
})


