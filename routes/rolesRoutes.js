const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const { getRoles } = require("../controllers/roleController");

//router.use(authJwt.verifyToken);
//if you want to authenticate the token with the cookie
router.use(authJwt.authenticateToken);
router.use(authJwt.isAdmin);

router.get("/", getRoles);

module.exports = router;
