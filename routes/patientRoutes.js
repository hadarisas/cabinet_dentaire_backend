const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
} = require("../controllers/patientController");

router.use(authJwt.verifyToken);
router.post("/add", authJwt.isAssistant || authJwt.isAdmin, addPatient);
router.get("/all", authJwt.isAssistant || authJwt.isAdmin, getAllPatients);
router.get("/:id", authJwt.isAssistant || authJwt.isAdmin, getPatientById);
router.delete("/:id", authJwt.isAssistant || authJwt.isAdmin, deletePatient);
router.put("/:id", authJwt.isAssistant || authJwt.isAdmin, updatePatient);

module.exports = router;
