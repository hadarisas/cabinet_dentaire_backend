const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");
const {
  addDent,
  getDentById,
  updateDent,
  deleteDent,
  getDents,
} = require("../controllers/dentController");

router.use(authJwt.verifyToken);
//if you want to authenticate the token with the cookie
//router.use(authJwt.authenticateToken);

router.post("/", addDent);
router.get("/", getDents);
router.get("/:code", getDentById);
router.put("/:code", updateDent);
router.delete("/:code", deleteDent);

module.exports = router;
