const Attendance = require("../models/Attendance");

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("studentId", "name rollNumber className")
      .sort({ date: -1 });

    res.json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

const createAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !status) {
      return res.status(400).json({
        success: false,
        message: "Student and attendance status are required",
      });
    }

    const attendance = await Attendance.create({
      studentId,
      date: date || Date.now(),
      status,
    });

    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record attendance",
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update attendance",
    });
  }
};

module.exports = {
  getAttendance,
  createAttendance,
  updateAttendance,
};