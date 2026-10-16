const Feedback = require("../models/Feedback");

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required",
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      message,
      rating: rating || 5,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
    });
  }
};

module.exports = {
  getFeedback,
  createFeedback,
  deleteFeedback,
};