const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the DSR schema
const dsrSchema = new Schema({
  componentName: {
    type: String,
    required: true,
  },
  config: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  pod: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  purchaseOrderNum: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  perUnitPrice: {
    type: Number,
    required: true,
  },
  balanceAmt: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  locationOfComponent: {
    type: String,
    required: true,
  },
  validatedBy: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
});

// Define the Section schema
const sectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true,
  },
  dsrEntries: [dsrSchema],
});

// Define the Lab schema
const labSchema = new Schema({
  labName: {
    type: String,
    required: true,
  },
  sections: [sectionSchema],
});

// Define the Department schema
const departmentSchema = new Schema({
  deptName: {
    type: String,
    required: true,
  },
  labs: [labSchema],
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
