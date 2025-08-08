const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const { isLoggedIn } = require("../middleware"); 

// Home page
router.get("/", homeController.renderHome);

// Dashboard redirect based on role
router.get("/dashboard", isLoggedIn, homeController.handleDashboardRedirect);

//search
router.get("/", homeController.renderHome);
router.get("/search-doctors", homeController.searchDoctors); 


module.exports = router;
