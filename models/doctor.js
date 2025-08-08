const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  registrationNumber: {
  type: String,
  required: true,
},

  photo: {
  type: String,
  default: "/uploads/doctors/default.jpg",
}
,
  degree: String,
  specialization: String,
  clinicName: {
    type: String,
    required: true,
  },
  clinicAddress: {
    type: String,
    required: true,
  },
  clinicContact: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  availableSlots: [String],       
  availableDates: {
  type: [String], 
  default: [],
},       
  isApproved: {
    type: Boolean,
    default: null,
  },
  approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", 
},
status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
rejectionReason: {
  type: String,
  default: null,
},
fees: {
  type: Number,
  required: true
},
experience: {
  type: String,
  required: true
}

});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
