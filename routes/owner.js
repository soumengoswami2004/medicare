const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/owner");
const { isLoggedIn, isOwner } = require("../middleware");

const Doctor = require("../models/doctor"); 

router.get("/dashboard", isLoggedIn, isOwner, ownerController.renderOwnerDashboard);
router.post("/update-clinic", isLoggedIn, isOwner, ownerController.updateClinicInfo);




router.post("/booking/:id/approve", isLoggedIn, isOwner, ownerController.approveBooking);
router.post("/booking/:id/reject", isLoggedIn, isOwner, ownerController.rejectBooking);

router.post("/booking/:id/delete", isLoggedIn, isOwner, ownerController.deleteBooking);



module.exports = router;
