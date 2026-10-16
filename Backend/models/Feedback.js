const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Website",
        "Teaching",
        "Management",
        "Other",
      ],
      default: "Website",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Feedback",
  feedbackSchema
);