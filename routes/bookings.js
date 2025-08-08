const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { isLoggedIn } = require("../middleware");

// Show booking page 
router.get("/:id/book", isLoggedIn, bookingController.renderBookingPage);

// Handle booking submission 
router.post("/:id/book", isLoggedIn, bookingController.createBooking);

module.exports = router;
