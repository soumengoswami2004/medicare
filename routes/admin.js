const express = require("express");
const router = express.Router();
const { renderAdminDashboard } = require("../controllers/adminController");
const { isLoggedIn, isAdmin } = require("../middleware");
const adminController = require("../controllers/adminController");

router.get("/dashboard", isLoggedIn, isAdmin, renderAdminDashboard);


router.post("/doctor/:id/approve", isLoggedIn, isAdmin, adminController.approveDoctor);
router.post("/doctor/:id/reject", isLoggedIn, isAdmin, adminController.rejectDoctor);

module.exports = router;
