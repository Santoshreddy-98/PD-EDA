const User = require("../../modal/DA_model/user");
const Admin = require("../../modal/DA_model/admin")
const bcrypt = require('bcrypt');
// User registration
const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const newUser = new User({ username, password, role });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register a user" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ password: user.password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve password' });
  }
};


///For login user:

//###Integrated for Admin Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user in the database by username
    const user = await Admin.findOne({ name:username});

    // If the user doesn't exist, or the password is incorrect, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If login is successful, generate a token or include relevant user information
    res.json({
      message: "Login successful",
      userInfo: {
        username: user.name,
        role: user.role,
        isAdmin: user.isAdmin
      }
      // You may want to include a token here for authentication purposes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
};



const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role } = req.body;
    const newAdmin = new Admin({ name, email, password, isAdmin, role });
    const savedAdmin = await newAdmin.save();

    res.status(201).json(savedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register an admin" });
  }
};

// Controller to get a list of admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

// Controller to update an admin by ID
const updateAdmin = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role } = req.body;
    const adminId = req.params.id; // Assuming you pass the admin ID as a parameter

    const errors = [];

    if (!/^[A-Za-z\s]*$/.test(name)) {
      errors.push({ field: "name", message: "Name must contain only letters and spaces." });
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      errors.push({ field: "email", message: "Invalid email format." });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email, password, isAdmin, role },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Failed to update admin" });
  }
};


// Controller function to delete an admin by ID
const deleteAdmin = async (req, res) => {
  try {
    // Get the admin ID from the request parameters
    const adminId = req.params.id;

    // Use Mongoose to delete the admin by ID
    await Admin.findByIdAndRemove(adminId);

    res.status(204).send(); // Send a success response with status 204 (No Content)
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
};


module.exports = { registerUser, loginUser, forgotPassword, getAdmins, deleteAdmin, updateAdmin, registerAdmin  };


// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (user.password !== password) {
//       return res.status(401).json({ error: "Invalid password" });
//     }

//     let role;
//     if (user.role === "PD Dev") {
//       role = "PD Dev";
//     } else if (user.role === "PD Lead") {
//       role = "PD Lead";
//     } else if (user.role === "PD Manager") {
//       role = "PD Manager"
//     }

//     res.json({
//       message: "Login successful", role, userInfo: {
//         username,
//         role
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to login" });
//   }
// };


