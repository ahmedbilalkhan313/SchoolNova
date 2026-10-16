const Class = require("../models/Class");

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
    });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, section, teacher, room, studentsCount } = req.body;

    if (!name || !section) {
      return res.status(400).json({
        success: false,
        message: "Class name and section are required",
      });
    }

    const newClass = await Class.create({
      name,
      section,
      teacher,
      room,
      studentsCount,
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create class",
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update class",
    });
  }
};

const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete class",
    });
  }
};

module.exports = {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
};