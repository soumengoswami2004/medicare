const User = require("../models/user");
const Doctor = require("../models/doctor");

module.exports.renderAdminDashboard = async (req, res) => {
  try {
    const pendingDoctors = await Doctor.find({ isApproved: null }).populate("addedBy");

    res.render("dashboards/admin", {
      user: req.user,
      pendingDoctors,
      layout: false,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).send("Internal Server Error");
  }
};  



module.exports.approveDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, {
  isApproved: true,
  approvedBy: req.user._id,
});

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Error approving doctor:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; 

    await Doctor.findByIdAndUpdate(id, {
      isApproved: false,
      rejectionReason: reason, 
      approvedBy: req.user._id,
    });

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Error rejecting doctor:", err);
    res.status(500).send("Internal Server Error");
  }
};

