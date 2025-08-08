const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", 
    required: true,
  },
  clinicOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  date: {
    type: Date, 
    required: true,
  },

}, {
  timestamps: true, 
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
