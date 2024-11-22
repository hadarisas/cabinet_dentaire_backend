const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addSoin,
  updateSoin,
  deleteSoin,
  getSoins,
  getSoinById,
} = require("../controllers/soinController");

//router.use(authJwt.verifyToken);
//if you want to authenticate the token with the cookie
router.use(authJwt.authenticateToken);

router.post("/", authJwt.isDentiste, addSoin);
router.get("/", getSoins);
router.get("/:id", getSoinById);
router.put("/:id", authJwt.isDentiste, updateSoin);
router.delete("/:id", authJwt.isDentiste, deleteSoin);

module.exports = router;
