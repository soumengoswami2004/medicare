const Doctor = require("../models/doctor");

module.exports.renderHome = async (req, res) => {
  const doctors = await Doctor.find({ isApproved: true });
  res.render("home", { doctors, layout: false }); // No layout
};

// This handles dashboard redirection based on user role
module.exports.handleDashboardRedirect = (req, res) => {
  const role = req.user.role;

  if (role === "admin") return res.redirect("/admin/dashboard");
  if (role === "owner") return res.redirect("/owner/dashboard");
  return res.redirect("/users/dashboard");
};

//search
module.exports.searchDoctors = async (req, res) => {
  const { keyword, location } = req.query;

  const searchQuery = { isApproved: true };

  if (keyword) {
    const regex = new RegExp(keyword, "i");
    searchQuery.$or = [
      { name: regex },
      { specialization: regex },
      { location: regex },
      { clinicName: regex },
    ];
  }

  if (location) {
    searchQuery.location = new RegExp(location, "i");
  }

  const doctors = await Doctor.find(searchQuery).lean(); 
  res.json(doctors);
};

