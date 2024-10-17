const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // limit file size to 15MB
  },
});

router.use(authJwt.verifyToken);
/*
router.post(
  "/:patientId",
  authJwt.isAssistant || authJwt.isAdmin,
  upload.single("fichier"),
  addDocument
);
*/

module.exports = router;
