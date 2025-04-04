import express from "express";
import Student from "../models/RegisteredStudent.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const router = express.Router();

// Signup Controller
router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      registrationNumber,
      primaryDomain,
      secondaryDomain,
      contactNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      registrationNumber,
      primaryDomain,
      secondaryDomain,
      contactNumber,
    });

    // Save student to database
    await newStudent.save();

    // Generate JWT token for newly registered student
    const token = jwt.sign(
      { id: newStudent._id, email: newStudent.email },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.status(201).json({ 
      message: "Student registered successfully",
      token,
      student: {
        id: newStudent._id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
        registrationNumber: newStudent.registrationNumber,
        primaryDomain: newStudent.primaryDomain,
        secondaryDomain: newStudent.secondaryDomain,
        contactNumber: newStudent.contactNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login Controller
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        registrationNumber: student.registrationNumber,
        primaryDomain: student.primaryDomain,
        secondaryDomain: student.secondaryDomain,
        contactNumber: student.contactNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/",auth,async(req,res)=>{
  try {
    const id = req.user.id;
    const student = await Student.findById(id);
    res.status(200).json({student});
  } catch (error) {
    
  }
});

export default router;


