const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: "SchoolNova",
      trim: true,
    },

    schoolAddress: {
      type: String,
      default: "",
      trim: true,
    },

    contactNumber: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    totalStudents: {
      type: Number,
      default: 0,
    },

    totalTeachers: {
      type: Number,
      default: 0,
    },

    totalClasses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);