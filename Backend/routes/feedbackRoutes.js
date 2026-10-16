const express = require("express");

const {
  getFeedback,
  createFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.get("/", getFeedback);
router.post("/", createFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;