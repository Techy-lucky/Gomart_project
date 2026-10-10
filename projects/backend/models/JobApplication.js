const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    contact: String,
    age: Number,
    gender: String,
    address: String,
    city: String,
    pincode: String,
    qualification: String,
    experience: String,
    skills: [String],
    currentCompany: String,
    currentRole: String,
    expectedSalary: String,
}, { timestamps: true });

// const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
module.exports = mongoose.model('JobApplication', jobApplicationSchema);