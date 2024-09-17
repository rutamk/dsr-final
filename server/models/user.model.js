const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

const labSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sections: [sectionSchema],
});

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  description: String,
  labs: [labSchema],
});

const combinedSchema = new mongoose.Schema({
  fullName: {
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
  role: {
    type: String,
    required: true,
    enum: ["Lab Assistant", "Lab Incharge", "HOD", "Admin"], // Example of enum validation
  },
  departments: [departmentSchema],
});

const CombinedModel = mongoose.model("CombinedModel", combinedSchema);

module.exports = CombinedModel;
