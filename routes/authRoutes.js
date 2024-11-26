const router = require("express").Router();
//const authJwt = require("../middlewares/auth");
const { authLimiter } = require("../utils/rateLimiter");
const {
  login,
  logout,
  refreshToken,
} = require("../controllers/authController");

router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
module.exports = router;
