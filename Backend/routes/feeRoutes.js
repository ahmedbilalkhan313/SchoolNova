const express = require("express");

const {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
} = require("../controllers/feeController");

const router = express.Router();

router.get("/", getFees);
router.get("/:id", getFee);
router.post("/", createFee);
router.put("/:id", updateFee);
router.delete("/:id", deleteFee);

module.exports = router;