const multer = require("multer");
const path = require("path");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  // 👇 Save the original URL to session before redirecting
  req.session.returnTo = req.originalUrl;
  req.flash("error", "Please log in first.");
  res.redirect("/auth/login");
}


function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  req.flash("error", "Admins only!");
  res.redirect("/login");
}

function isOwner(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "owner") return next();
  req.flash("error", "Owners only!");
  res.redirect("/login");
}

function isUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "user") return next();
  req.flash("error", "Users only!");
  res.redirect("/login");
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/doctors");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadDoctor = multer({ storage });

module.exports = {
  isLoggedIn,
  isAdmin,
  isOwner,
  isUser,
  uploadDoctor,
};
