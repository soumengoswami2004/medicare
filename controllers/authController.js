const User = require("../models/user");

// Render signup page
module.exports.renderSignupForm = (req, res) => {
  res.render("auth/signup");
};

// Handle signup logic
module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.error("Signup error:", err);
    req.flash("error", "Signup failed. Try again.");
    res.redirect("/auth/signup");
  }
};


// Render login page
module.exports.renderLoginForm = (req, res) => {
  res.render("auth/login");
};

// After successful login → redirect based on role
module.exports.loginUser = (req, res) => {
  const redirectTo = req.session.returnTo || "/";
  delete req.session.returnTo;
  
  req.flash("success", `Welcome back, ${req.user.name}!`);
  return res.redirect(redirectTo); // redirect to original page
};




// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
