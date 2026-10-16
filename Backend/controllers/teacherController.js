const Teacher = require("../models/Teacher");

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
    });
  }
};

const createTeacher = async (req, res) => {
  try {
    const { name, email, phone, subject, qualification, status } = req.body;

    if (!name || !email || !phone || !subject) {
      return res.status(400).json({
        success: false,
        message: "Please provide required teacher fields",
      });
    }

    const existing = await Teacher.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Teacher email already exists",
      });
    }

    const teacher = await Teacher.create({
      name,
      email,
      phone,
      subject,
      qualification,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create teacher",
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update teacher",
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete teacher",
    });
  }
};

module.exports = {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};