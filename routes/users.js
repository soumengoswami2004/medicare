const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const { isLoggedIn, isUser } = require("../middleware");

router.get("/login", userController.showLogin);
router.get("/register", userController.showRegister);
router.get("/profile", isLoggedIn, isUser, userController.showProfile);

//  Use this one for dashboard with bookings
router.get("/dashboard", isLoggedIn, isUser, userController.getUserDashboard);

// Delete booking


router.delete("/booking/:id", userController.deleteBooking);



module.exports = router;
