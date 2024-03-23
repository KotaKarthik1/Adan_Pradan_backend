const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/CollegeUserModel.js");
const PersonalInfo = require("../models/CollegeModel.js");
const jwt = require("jsonwebtoken"); 
const Workshop = require("../models/WorkshopModel.js");



// Registration routing
router.post("/registerclg", async (req, res) => {
  try {
    const {
      email,
      password,
      collegeName,
      JntuCode,
      Address,
      website
    } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ email, password: hashedPassword });

    // Create PersonalInfo document
    const PersonalInfoData = new PersonalInfo({
      userId: user._id,
      collegeName,
      JntuCode,
      Address,
      website,
    });
    await user.save()
    await PersonalInfoData.save();
    ;
    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/clg/updatepassword/:user_id",async(req,res)=>
{
  const { prevPassword, newPassword } = req.body;
    try{
      const userdata = await PersonalInfo.findById(req.params.user_id);
      const user=await User.findById(userdata.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare previous password with the stored password
    const isMatch = await bcrypt.compare(prevPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect previous password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
    }
    catch(err)
    {
      res.status(400).send('Update failed password');
    }
})
router.patch("/clg/updateemail/:user_id",async(req,res)=>
{
  const { email } = req.body;
    try{
      const userdata = await PersonalInfo.findById(req.params.user_id);
      const user=await User.findById(userdata.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the password
    user.email = email;
    await user.save();

    res.status(200).json({ message: "email updated successfully" });
    }
    catch(err)
    {
      res.status(400).send('Update failed email');
    }

})
// Login route
router.post("/loginclg", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token with a 10-minute expiration time
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret-key", // Use a secure secret key
      { expiresIn: "10m" } // Set the token expiration time
    );
    // console.log("JWT Token:", token);
    const personalInfo = await PersonalInfo.findOne({ userId: user._id });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: personalInfo._id,
        email: user.email,
        name: personalInfo.name,
        collegeName: personalInfo.collegeName,
      },
      token
    });
    // console.log("Email:", email);
    // console.log("User:", user);
    // console.log("isPasswordValid:", isPasswordValid);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;