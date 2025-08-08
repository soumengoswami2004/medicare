const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

router.get("/signup", authController.renderSignupForm);
router.post("/signup", authController.signup);

router.get("/login", authController.renderLoginForm);
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), authController.loginUser);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/'); // redirect to homepage instead of /login
  });
});


module.exports = router;
