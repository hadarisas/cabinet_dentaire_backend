const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
} = require("../controllers/documentController");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // limit file size to 15MB
  },
});

//router.use(authJwt.verifyToken);
//if you want to authenticate the token with the cookie
router.use(authJwt.authenticateToken);

router.post("/", upload.single("fichier"), addDocument);
router.get("/patient/:patientId", getDocuments);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);
router.put("/:id", updateDocument);

module.exports = router;
