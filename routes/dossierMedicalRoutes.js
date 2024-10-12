const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addDossierMedical,
  updateDossierMedical,
  getDossierMedicalByPatientId,
} = require("../controllers/dossierMedicalController");

router.use(authJwt.verifyToken);
router.post("/add", authJwt.isAssistant || authJwt.isAdmin, addDossierMedical);
router.put(
  "/patient/:patientId",
  authJwt.isAssistant || authJwt.isAdmin,
  updateDossierMedical
);
router.get(
  "/patient/:patientId",
  authJwt.isAssistant || authJwt.isAdmin,
  getDossierMedicalByPatientId
);

module.exports = router;
