const express = require("express");

const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const router = express.Router();

router.get("/", getClasses);
router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

module.exports = router;