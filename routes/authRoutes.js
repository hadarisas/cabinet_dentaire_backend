const router = require("express").Router();
//const authJwt = require("../middlewares/auth");
const { authLimiter } = require("../utils/rateLimiter");

const { login } = require("../controllers/authController");

router.post("/login", authLimiter, login);

module.exports = router;
