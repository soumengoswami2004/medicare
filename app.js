const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const session = require("express-session");
const MongoStore=require('connect-mongo')
const methodOverride = require("method-override");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const User = require("./models/user");
const Doctor = require("./models/doctor");


//  DATABASE 
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });


// MIDDLEWARE 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(methodOverride("_method"));

// Layout setup
// app.use(expressLayouts);
// app.set('layout', 'layouts/layout');  // uses views/layout/boilerplate.ejs

// SESSION & FLASH
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    dbName: 'doctorapp',
    collectionName: 'sessions',
    touchAfter: 24 * 3600 
  })
}));

app.use(flash());


//  PASSPORT CONFIG 
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {   
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user||null;
  next();
});


passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ROUTES 
const doctorRoutes = require("./routes/doctors");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const ownerRoutes = require("./routes/owner");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const homeRoutes = require("./routes/home"); 

app.use("/admin", adminRoutes);
app.use("/owner", ownerRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", homeRoutes);

app.get("/", async (req, res) => {
  try {
    const approvedDoctors = await Doctor.find({ isApproved: true });
    res.render("home", { doctors: approvedDoctors });
  } catch (err) {
    console.log(err);
    res.send("Error loading doctors");
  }
});



//  SERVER START 
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
