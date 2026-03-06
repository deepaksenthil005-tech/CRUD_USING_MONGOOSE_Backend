const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    department_id: {
      type: Number,
      required: true,
      unique: true,
    },
    emp_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    department: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Employee", employeeSchema);
