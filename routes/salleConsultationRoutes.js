const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");
const {
  addSalleConsultation,
  getSallesConsultation,
  updateSalleConsultation,
  deleteSalleConsultation,
} = require("../controllers/salleConsultationController");

router.use(authJwt.verifyToken);
router.post("/", addSalleConsultation);
router.get("/", getSallesConsultation);
router.put("/:id", updateSalleConsultation);
router.delete("/:id", deleteSalleConsultation);

module.exports = router;
