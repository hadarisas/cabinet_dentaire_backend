const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByPatientId,
  getAppointmentById,
  getAppoitmentsByUserId,
  getAllAppointments,
  getAllActiveAppointments,
} = require("../controllers/rendezVousController");

router.use(authJwt.verifyToken);

router.post("/", addAppointment);
router.get("/active", getAllActiveAppointments);
router.get("/", getAllAppointments);
router.get("/patient/:patientId", getAppointmentsByPatientId);
router.get("/user/:userId", getAppoitmentsByUserId);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", cancelAppointment);

module.exports = router;
