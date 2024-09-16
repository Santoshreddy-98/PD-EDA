const mongoose = require("mongoose");

// Define the schema for the checklist
const ChecklistSchema = new mongoose.Schema({
    stage: String,
    checklistType: {
        type: String,
        default: "preChecklist"
    },
    questions: [
        {
            question: String,
            pdDevAnswer: String,
            pdLeadAnswer: String,
            pdDevComment: String,
            pdLeadComment: String,
        },
    ],
    DevName: String,
    LeadName: String,

    pdDevPercentage: {  
        type: Number,
        default: 0
    },
    pdLeadPercentage: {
        type: Number,
        default: 0
    },
    summaryPercentage: {
        type: Number,
        default: 0
    },
    isSummaryAvailable : {
        type:Boolean,
        default:false
    }
}, {
    timestamps: true,
});

// Create a model based on the schema
const Checklist = mongoose.model("Checklist", ChecklistSchema);
module.exports = Checklist

///

const express= require("express")
const checklistRouter=express.Router()
  

checklistRouter.post("/:stage/:type", async (req, res) => {
    const { stage, type } = req.params;
    const { role, questions, name } = req.body;

    const pdDevAnswers = await questions.filter((question) => question.pdDevAnswer === "YES").length;

    const pdLeadAnswers = await questions.filter((question) => question.pdLeadAnswer === "YES").length;
    // console.log(pdDevAnswers,pdLeadAnswers)

    const pdDevPercentage = pdDevAnswers / questions.length * 100
    const pdLeadPercentage = pdLeadAnswers / questions.length * 100
    const summaryPercentage = (pdDevPercentage + pdLeadPercentage) / 2;

    // Create or update checklist data based on the stage and type
    try {
        let checklistData = await Checklist.findOne({ stage, checklistType: type });
        // console.log(checklistData)
        if (!checklistData) {
            checklistData = new Checklist({ stage, checklistType: type });
        } 
        if (role == "PD Dev") {
            checklistData.DevName = name
        } else if (role == "PD Lead") {
            checklistData.LeadName = name
        } else {
            console.log("role not availble")
        }
        checklistData.questions = questions;

        checklistData.pdDevPercentage = pdDevPercentage.toFixed(2)
        checklistData.pdLeadPercentage = pdLeadPercentage.toFixed(2)
        checklistData.summaryPercentage = summaryPercentage.toFixed(2);
        checklistData.isSummaryAvailable = pdDevPercentage > 0 && pdLeadPercentage > 0 && true

        await checklistData.save();
        return res.json({ message: "Checklist data saved successfully.", checklistData });
    } catch (error) {
        return res.status(500).json({ message: "Error saving checklist data." });
    }
});



checklistRouter.get("/:stage/:type", async (req, res) => {
    const { stage, type } = req.params;
    try {
        // Query the database to find the checklist that matches the stage and type
        const checklist = await Checklist.findOne({ stage, checklistType: type });
        // console.log(checklist)
        if (checklist) {
            // Checklist found, send it as a response
            res.json(checklist);
        } else {
            // Checklist not found
            res.status(404).json({ message: 'Checklist not found' });
        }
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
checklistRouter.get("/checklist/summary/available",async(req,res)=>{
    try {
        const checklist = await Checklist.find({ isSummaryAvailable :true}).select("stage checklistType summaryPercentage");
        // console.log(checklist)
        if (checklist) {
            const groupedChecklist = checklist.reduce((acc, item) => {
                const existingEntry = acc.find((entry) => entry.stage === item.stage);

                if (existingEntry) {
                    // Update the existing entry with the checklist data
                    existingEntry[item.checklistType === "preChecklist" ? "preChecklistSummaryPercentage" : "postChecklistSummaryPercentage"] = item.summaryPercentage;
                } else {
                    // Create a new entry for the stage
                    const newItem = {
                        stage: item.stage,
                        [item.checklistType === "preChecklist" ? "preChecklistSummaryPercentage" : "postChecklistSummaryPercentage"]: item.summaryPercentage,
                    };
                    acc.push(newItem);
                }

                return acc;
            }, []);

            res.json(groupedChecklist);
        } else {
            res.status(404).json({ message: 'Checklist not found' });
        }

    } catch (err) {
        // Handle any errors that occur during the database query
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


module.exports = checklistRouter;


// Query the database to find the checklist that matches the stage and type
// const checklist = await Checklist.find({}).select("stage checklistType isSummaryAvailable summaryPercentage");
// if (checklist) {
//     // Checklist found, send it as a response
//     res.json(checklist);
// } else {
//     // Checklist not found
// res.status(404).json({ message: 'Checklist not found' });
//    