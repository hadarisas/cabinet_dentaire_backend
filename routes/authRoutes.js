const router = require("express").Router();
//const authJwt = require("../middlewares/auth");
const { authLimiter } = require("../utils/rateLimiter");
const { login, logout } = require("../controllers/authController");

router.post("/login", authLimiter, login);
router.post("/logout", logout);
module.exports = router;
