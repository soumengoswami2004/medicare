  const Booking = require("../models/booking");
  const Doctor = require("../models/doctor");

  module.exports.renderOwnerDashboard = async (req, res) => {
  try {
    const doctors = await Doctor.find({ addedBy: req.user._id });
    const approvedDoctors = await Doctor.find({
      isApproved: true,
      addedBy: req.user._id,
    });

    const doctorIds = approvedDoctors.map(doc => doc._id);

    //  Fetch bookings related to the owner’s approved doctors
    const bookings = await Booking.find({ doctor: { $in: doctorIds } })
      .populate("doctor") 
      .populate("user");  

    const clinic = doctors[0];

    res.render("dashboards/owner", {
      user: req.user,
      doctors,
      approvedDoctors,
      clinic,
      bookings,
      totalDoctors:doctors.length, 
      layout: false
    });
  } catch (err) {
    console.error("Error rendering owner dashboard:", err);
    res.status(500).send("Internal Server Error");
  }
};

  module.exports.showDashboard = async (req, res) => {
    const ownerId = req.user._id;
    const doctors = await Doctor.find({ addedBy: ownerId }).populate("approvedBy");

    res.render("dashboards/owner", { user: req.user, doctors });
  };

  module.exports.approveBooking = async (req, res) => {
    try {
      await Booking.findByIdAndUpdate(req.params.id, { status: "approved" });
      res.redirect("/owner/dashboard");
    } catch (err) {
      console.error(err);
      res.send("Error approving booking");
    }
  };

  module.exports.rejectBooking = async (req, res) => {
    try {
      await Booking.findByIdAndUpdate(req.params.id, { status: "rejected" });
      res.redirect("/owner/dashboard");
    } catch (err) {
      console.error(err);
      res.send("Error rejecting booking");
    }
  };

  module.exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/owner/dashboard");
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).send("Internal Server Error");
  }
};


  module.exports.updateClinicInfo = async (req, res) => {
    const { clinicName, clinicAddress, clinicContact } = req.body;

    try {
      // Update all doctor records posted by the current owner
      await Doctor.updateMany(
        { addedBy: req.user._id },
        {
          $set: {
            clinicName,
            clinicAddress,
            clinicContact,
          },
        }
      );
      res.redirect("/owner/dashboard");
    } catch (err) {
      console.error("Error updating clinic info:", err);
      res.status(500).send("Internal Server Error");
    }
  };