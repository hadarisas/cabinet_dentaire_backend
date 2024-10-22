const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
router.use(authJwt.verifyToken);
router.use(authJwt.isAdmin);

router.post("/add", addUser);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
