const Fee = require("../models/Fee");

// ==========================================
// GET ALL FEES
// ==========================================

const getFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate("studentId", "name rollNumber className")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    console.error("Get fees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fees",
    });
  }
};

// ==========================================
// GET SINGLE FEE
// ==========================================

const getFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate(
      "studentId",
      "name rollNumber className"
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      fee,
    });
  } catch (error) {
    console.error("Get fee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fee",
    });
  }
};

// ==========================================
// CREATE FEE
// ==========================================

const createFee = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      month,
      status,
      paymentDate,
    } = req.body;

    if (!studentId || amount === undefined || !month) {
      return res.status(400).json({
        success: false,
        message: "Student, amount and month are required",
      });
    }

    const fee = await Fee.create({
      studentId,
      amount,
      month,
      status: status || "Pending",
      paymentDate: paymentDate || null,
    });

    const populatedFee = await Fee.findById(fee._id).populate(
      "studentId",
      "name rollNumber className"
    );

    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      fee: populatedFee,
    });
  } catch (error) {
    console.error("Create fee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create fee",
    });
  }
};

// ==========================================
// UPDATE FEE
// ==========================================

const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "studentId",
      "name rollNumber className"
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      fee,
    });
  } catch (error) {
    console.error("Update fee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update fee",
    });
  }
};

// ==========================================
// DELETE FEE
// ==========================================

const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    console.error("Delete fee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete fee",
    });
  }
};

module.exports = {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
};