const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const { getRoles } = require("../controllers/roleController");

router.use(authJwt.verifyToken);
router.use(authJwt.isAdmin);

router.get("/", getRoles);

module.exports = router;
