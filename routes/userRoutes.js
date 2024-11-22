const router = require("express").Router();
const authJwt = require("../middlewares/auth");

const {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  searchUsers,
} = require("../controllers/userController");

//router.use(authJwt.verifyToken);
//if you want to authenticate the token with the cookie
router.use(authJwt.authenticateToken);
router.use(authJwt.isAdmin);

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // limit file size to 15MB
  },
});

router.post("/add", upload.single("profilePicture"), addUser);
router.get("/all", getAllUsers);
router.put("/status/:id", updateUserStatus);
router.get("/search", searchUsers);
router.get("/:id", getUserById);
router.put("/:id", upload.single("profilePicture"), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
