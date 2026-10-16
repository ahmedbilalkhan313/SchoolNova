const express = require("express");

const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", auth, getUsers);

module.exports = router;