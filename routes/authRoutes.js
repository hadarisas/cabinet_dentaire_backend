const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  login,
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/add", authJwt.verifyToken, authJwt.isAdmin, addUser);
router.get("/all", authJwt.verifyToken, authJwt.isAdmin, getAllUsers);
router.get("/:id", authJwt.verifyToken, getUserById);
router.put("/:id", authJwt.verifyToken, authJwt.isAdmin, updateUser);
router.delete("/:id", authJwt.verifyToken, authJwt.isAdmin, deleteUser);

module.exports = router;
