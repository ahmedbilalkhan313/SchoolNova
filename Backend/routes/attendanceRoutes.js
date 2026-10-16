const express = require("express");

const {
  getAttendance,
  createAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/", getAttendance);
router.post("/", createAttendance);
router.put("/:id", updateAttendance);

module.exports = router;