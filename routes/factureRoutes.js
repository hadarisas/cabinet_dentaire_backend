const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  createFacture,
  getFactures,
  getFactureById,
  updateFacture,
  deleteFacture,
  getFacturesEnRetard,
  markAsPaid,
} = require("../controllers/factureController");

//router.use(authJwt.verifyToken);
//if you want to authenticate the token with the cookie
router.use(authJwt.authenticateToken);

router.post("/", createFacture);
router.get("/en-retard", getFacturesEnRetard);
router.put("/mark-as-paid/:id", markAsPaid);
router.get("/patient/:patientId", getFactures);
router.get("/:id", getFactureById);
router.put("/:id", updateFacture);
router.delete("/:id", deleteFacture);

module.exports = router;
