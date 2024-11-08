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
//if you want to authenticate the token with the cookie
//router.use(authJwt.authenticateToken);

router.post("/", addSalleConsultation);
router.get("/", getSallesConsultation);
router.put("/:id", updateSalleConsultation);
router.delete("/:id", deleteSalleConsultation);

module.exports = router;
