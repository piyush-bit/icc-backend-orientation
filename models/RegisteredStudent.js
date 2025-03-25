import mongoose from "mongoose";



const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  primaryDomain: {
    type: String,
    required: true,
  },
  secondaryDomain: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Student = mongoose.model("RegisterStudent", studentSchema);
export default Student;
