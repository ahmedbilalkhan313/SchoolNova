const Setting = require("../models/Setting");

// GET school settings
const getSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      setting: setting || null,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch school settings",
    });
  }
};

// CREATE or UPDATE school settings
const updateSettings = async (req, res) => {
  try {
    const {
      schoolName,
      schoolAddress,
      contactNumber,
      email,
      totalStudents,
      totalTeachers,
      totalClasses,
    } = req.body;

    if (!schoolName || !schoolName.trim()) {
      return res.status(400).json({
        success: false,
        message: "School name is required",
      });
    }

    let setting = await Setting.findOne();

    if (!setting) {
      setting = await Setting.create({
        schoolName: schoolName.trim(),
        schoolAddress: schoolAddress || "",
        contactNumber: contactNumber || "",
        email: email || "",
        totalStudents: totalStudents || 0,
        totalTeachers: totalTeachers || 0,
        totalClasses: totalClasses || 0,
      });

      return res.status(201).json({
        success: true,
        message: "School settings created successfully",
        setting,
      });
    }

    setting.schoolName = schoolName.trim();
    setting.schoolAddress = schoolAddress || "";
    setting.contactNumber = contactNumber || "";
    setting.email = email || "";

    if (totalStudents !== undefined) {
      setting.totalStudents = totalStudents;
    }

    if (totalTeachers !== undefined) {
      setting.totalTeachers = totalTeachers;
    }

    if (totalClasses !== undefined) {
      setting.totalClasses = totalClasses;
    }

    await setting.save();

    res.status(200).json({
      success: true,
      message: "School settings updated successfully",
      setting,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save school settings",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};