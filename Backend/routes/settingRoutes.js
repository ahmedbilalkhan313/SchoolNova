const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");

const router = express.Router();

// Get school settings
router.get("/", getSettings);

// Create settings if none exist OR update existing settings
router.put("/", updateSettings);

module.exports = router;