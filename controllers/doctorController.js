//controllers/doctorController.js =====
const Doctor = require("../models/doctor");

// Show only approved doctors
const showApprovedDoctors = async (req, res) => {
  const doctors = await Doctor.find({ isApproved: true });
  res.render("doctors/showAll", { doctors });
};

// Show full details of one doctor
const showDoctorDetails = async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id).populate("addedBy approvedBy");
  if (!doctor) return res.status(404).send("Doctor not found");
  res.render("doctors/details", { doctor });
};

// Add new doctor
const addDoctor = async (req, res) => {
  const {
    name,
    degree,
    registrationNumber,
    specialization,
    clinicName,
    clinicAddress,
    clinicContact,
    availableDate,
    slotFrom,
    slotTo,
    fees,
    experience,
  } = req.body;

  const availableDates = typeof availableDate === "string"
    ? availableDate.split(",").map(d => d.trim())
    : Array.isArray(availableDate) && typeof availableDate[0] === "string" && availableDate[0].includes(',')
      ? availableDate[0].split(',').map(d => d.trim())
      : Array.isArray(availableDate) ? availableDate : [availableDate];

  const newSlot = `${slotFrom} - ${slotTo}`;
  const availableSlots = availableDates.map(() => newSlot);

  const doctor = new Doctor({
    name,
    degree,
    registrationNumber,
    specialization,
    clinicName,
    clinicAddress,
    clinicContact,
    addedBy: req.user._id,
    availableDates,
    availableSlots,
    photo: req.file?.path,
    fees,
    experience,
  });

  await doctor.save();
  res.redirect("/owner/dashboard");
};

// Update doctor
const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const {
    clinicContact,
    availableDate, 
    slotFrom,
    slotTo,
    fees,
    experience
  } = req.body;

  const doctor = await Doctor.findById(id);
  if (!doctor) return res.redirect("/owner/dashboard");

  // availableDates
  let newDates = availableDate;
  if (typeof newDates === 'string') {
    newDates = newDates.split(',').map(d => d.trim());
  } else if (Array.isArray(newDates)) {
    newDates = newDates.map(d => d.trim());
  } else {
    newDates = [];
  }

  const mergedDates = [...new Set([...doctor.availableDates, ...newDates])];

  //  slot time
  const slotStart = slotFrom || doctor.availableSlots[0]?.split(" - ")[0] || "";
  const slotEnd = slotTo || doctor.availableSlots[0]?.split(" - ")[1] || "";
  const newSlot = `${slotStart} - ${slotEnd}`;
  const updatedSlots = mergedDates.map(() => newSlot);

  //Update fields
  doctor.clinicContact = clinicContact || doctor.clinicContact;
  doctor.fees = fees || doctor.fees;
  doctor.experience = experience || doctor.experience;
  doctor.availableDates = mergedDates;
  doctor.availableSlots = updatedSlots;

  await doctor.save();
  res.redirect("/owner/dashboard");
};


// Delete doctor
const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  await Doctor.findByIdAndDelete(id);
  res.redirect("/owner/dashboard");
};

// Resubmit rejected doctor
const resubmitDoctor = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    degree,
    registrationNumber,
    specialization,
    clinicName,
    clinicAddress,
    clinicContact,
  } = req.body;

  const doctor = await Doctor.findById(id);
  if (!doctor) return res.redirect("/owner/dashboard");

  doctor.name = name;
  doctor.degree = degree;
  doctor.registrationNumber = registrationNumber;
  doctor.specialization = specialization;
  doctor.clinicName = clinicName;
  doctor.clinicAddress = clinicAddress;
  doctor.clinicContact = clinicContact;

  if (req.file) {
    doctor.photo = req.file.path;
  }

  doctor.isApproved = null;
  doctor.rejectionReason = null;
  doctor.approvedBy = null;

  await doctor.save();
  res.redirect("/owner/dashboard");
};

module.exports = {
  showApprovedDoctors,
  showDoctorDetails,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  resubmitDoctor,
};
