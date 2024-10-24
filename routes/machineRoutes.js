const express = require("express");
const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addMachine,
  getMachines,
  updateMachine,
  deleteMachine,
  getMachineById,
  assignMachineToSalle,
  removeMachineFromSalle,
} = require("../controllers/machineController");

router.use(authJwt.verifyToken);
router.use(authJwt.isAssistant);

router.post("/", addMachine);
router.get("/", getMachines);
router.get("/:id", getMachineById);
router.put("/:id", updateMachine);
router.delete("/:id", deleteMachine);
router.post("/assign-to-salle", assignMachineToSalle);
router.post("/remove-from-salle", removeMachineFromSalle);
module.exports = router;
