const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  createFactureSoin,
  getFactureSoins,
  updateFactureSoin,
  deleteFactureSoin,
  getFactureSoinsSummary,
} = require("../controllers/factureSoinController");

router.use(authJwt.verifyToken);

router.post("/", createFactureSoin);
router.get("/summary", getFactureSoinsSummary);

router.get("/:factureId", getFactureSoins);
router.put("/:id", updateFactureSoin);
router.delete("/:id", deleteFactureSoin);

module.exports = router;
