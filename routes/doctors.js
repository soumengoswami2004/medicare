const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { isLoggedIn, isOwner } = require("../middleware");

const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

// Add doctor
router.post("/add", isLoggedIn, isOwner, upload.single("photo"), doctorController.addDoctor);

// Update doctor
router.put("/:id", isLoggedIn, isOwner, doctorController.updateDoctor);

// Resubmit doctor
router.put("/:id/resubmit", isLoggedIn, isOwner, upload.single("photo"), doctorController.resubmitDoctor);

// Delete doctor
router.delete("/:id", isLoggedIn, isOwner, doctorController.deleteDoctor);

// View approved doctors
router.get("/doctors", isLoggedIn, doctorController.showApprovedDoctors);

// View single doctor 
router.get("/:id", doctorController.showDoctorDetails);

module.exports = router;

