const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");
const {
  addDocument,
  getDocuments,
  getDocumentById,
} = require("../controllers/documentController");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

router.use(authJwt.verifyToken);

router.post(
  "/:patientId",
  authJwt.isAssistant || authJwt.isAdmin,
  upload.single("fichier"),
  addDocument
);

router.get("/:dossierMedicalId", getDocuments);

router.get("/id/:id", getDocumentById);

module.exports = router;
