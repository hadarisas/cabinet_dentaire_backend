const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
  searchPatients,
} = require("../controllers/patientController");

router.use(authJwt.verifyToken);
router.post("/add", authJwt.isDentistOrAssistant, addPatient);
router.get("/all", authJwt.isDentistOrAssistant, getAllPatients);
router.get("/search", searchPatients);
router.get("/:id", authJwt.isDentistOrAssistant, getPatientById);
router.delete("/:id", authJwt.isDentistOrAssistant, deletePatient);
router.put("/:id", authJwt.isDentistOrAssistant, updatePatient);
module.exports = router;
