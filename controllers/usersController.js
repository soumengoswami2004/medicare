const User = require("../models/user");
const Booking = require("../models/booking");

// Show user profile (optional)
module.exports.showProfile = (req, res) => {
  res.render("users/profile", { user: req.user });
};

// Register / Login handlers (you can expand)
module.exports.showLogin = (req, res) => {
  res.render("users/login");
};

module.exports.showRegister = (req, res) => {
  res.render("users/register");
};

// Get all bookings for the logged-in user
module.exports.getUserDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("doctor");
    const totalBookings = bookings.length;
    res.render("dashboards/user", {
      bookings: bookings
  .filter(b => b.doctor)
  .map(b => ({
    _id: b._id,
    doctorName: b.doctor.name,
    clinicName: b.doctor.clinicName,
    clinicAddress: b.doctor.clinicAddress || "Not Provided",
    date: b.date.toDateString(),
    availableSlots: b.doctor.availableSlots || [],
    fees: b.doctor.fees,
  })),
  totalBookings,

    });
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).send("Error loading dashboard");
  }
};



// Delete a booking
module.exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/users/dashboard");
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).send("Internal Server Error");
  }
};

