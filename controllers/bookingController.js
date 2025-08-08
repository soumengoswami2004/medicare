const Doctor = require("../models/doctor");
const Booking = require('../models/booking');
const User = require("../models/user");

module.exports.renderBookingPage = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).send("Doctor not found");
  console.log("Available Dates:", doctor.availableDates);
  res.render("doctors/booking", { doctor });
};

module.exports.createBooking = async (req, res) => {
  try {
    const { date } = req.body;
    const userId = req.user._id;
    const doctorId = req.params.id;

    const user = await User.findById(userId);
    const doctor = await Doctor.findById(doctorId).populate("addedBy");

    const booking = new Booking({
      user: userId,
      doctor: doctorId,
      clinicOwner: doctor.addedBy._id,
      date: new Date(date),
    });

    await booking.save();

req.flash("success", "Booking successful!");
res.redirect("/");

  } catch (err) {
    console.log(" Error in booking:", err);
    res.status(500).send("Booking failed");
  }
};

