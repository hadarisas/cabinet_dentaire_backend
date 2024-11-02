const express = require("express");
const userRoutes = require("./userRoutes");
const patientRoutes = require("./patientRoutes");
const dentsRoutes = require("./dentRoutes");
const machinesRoutes = require("./machineRoutes");
const produitsRoutes = require("./produitsRoutes");
const rendezVousRoutes = require("./rendezVousRoutes");
const salleConsultationRoutes = require("./salleConsultationRoutes");
const authRoutes = require("./authRoutes");
const documentRoutes = require("./documentRoutes");
const soinRoutes = require("./soinRoutes");
const soinEffectueRoutes = require("./soinEffectueRoutes");
const factureRoutes = require("./factureRoutes");
const factureSoinRoutes = require("./factureSoinRoutes");
const rolesRoutes = require("./rolesRoutes");

const router = express.Router();

router.use("/api/v1/users", userRoutes);
router.use("/api/v1/patients", patientRoutes);
router.use("/api/v1/dents", dentsRoutes);
router.use("/api/v1/machines", machinesRoutes);
router.use("/api/v1/produits", produitsRoutes);
router.use("/api/v1/rendez-vous", rendezVousRoutes);
router.use("/api/v1/salle-consultation", salleConsultationRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/documents", documentRoutes);
router.use("/api/v1/soins", soinRoutes);
router.use("/api/v1/soins-effectues", soinEffectueRoutes);
router.use("/api/v1/factures", factureRoutes);
router.use("/api/v1/facture-soins", factureSoinRoutes);
router.use("/api/v1/roles", rolesRoutes);

module.exports = router;
