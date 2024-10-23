const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  createSoinEffectue,
  getAllSoinsEffectues,
  getSoinEffectueById,
  updateSoinEffectue,
  deleteSoinEffectue,
  getSoinsEffectuesByRendezVous,
} = require("../controllers/soinEffectueController");

router.use(authJwt.verifyToken);

router.post("/", createSoinEffectue);
router.get("/", getAllSoinsEffectues);
router.get("/rendez-vous/:rendezVousId", getSoinsEffectuesByRendezVous);
router.get("/:id", getSoinEffectueById);
router.put("/:id", updateSoinEffectue);
router.delete("/:id", deleteSoinEffectue);
module.exports = router;
