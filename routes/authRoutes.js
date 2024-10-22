const router = require("express").Router();
//const authJwt = require("../middlewares/auth");

const { login } = require("../controllers/authController");

router.post("/login", login);

module.exports = router;
