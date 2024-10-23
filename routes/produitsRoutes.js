const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addProduit,
  updateProduit,
  deleteProduit,
  getAllProduits,
  getProduitById,
  assignToTreatment,
  removeFromTreatment,
} = require("../controllers/produitController");

router.use(authJwt.verifyToken);

router.post("/", addProduit);
router.get("/", getAllProduits);
router.get("/:id", getProduitById);
router.put("/:id", updateProduit);
router.delete("/:id", deleteProduit);
router.post("/assign-to-treatment", assignToTreatment);
router.post("/remove-from-treatment", removeFromTreatment);

module.exports = router;
