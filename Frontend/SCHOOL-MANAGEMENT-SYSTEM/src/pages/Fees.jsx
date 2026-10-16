import "../styles/Fees.css";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  X,
  Edit2,
} from "lucide-react";

const STUDENTS_API = "https://school-nova-pied.vercel.app/api/students";
const FEES_API = "https://school-nova-pied.vercel.app/api/fees";

function Fees({ fees, setFees }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    month: "",
    status: "Paid",
    paymentDate: "",
  });

  // ==========================================
  // FETCH STUDENTS + FEES
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [studentsResponse, feesResponse] =
          await Promise.all([
            fetch(STUDENTS_API),
            fetch(FEES_API),
          ]);

        const studentsData = await studentsResponse.json();
        const feesData = await feesResponse.json();

        if (!studentsResponse.ok || !studentsData.success) {
          throw new Error(
            studentsData.message || "Failed to fetch students"
          );
        }

        if (!feesResponse.ok || !feesData.success) {
          throw new Error(
            feesData.message || "Failed to fetch fees"
          );
        }

        setStudents(studentsData.students || []);
        setFees(feesData.fees || []);
      } catch (error) {
        console.error("Fetch fees error:", error);

        setError(
          error.message || "Unable to load fee records."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setFees]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // ADD / UPDATE FEE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!formData.studentId) {
        throw new Error("Please select a student.");
      }

      if (!formData.amount || Number(formData.amount) < 0) {
        throw new Error("Please enter a valid fee amount.");
      }

      if (!formData.month) {
        throw new Error("Please select a month.");
      }

      const feeData = {
        studentId: formData.studentId,
        amount: Number(formData.amount),
        month: formData.month,
        status: formData.status,
        paymentDate:
          formData.status === "Paid" && formData.paymentDate
            ? formData.paymentDate
            : null,
      };

      const url = editingId
        ? `${FEES_API}/${editingId}`
        : FEES_API;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feeData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingId ? "update" : "create"
            } fee record`
        );
      }

      // ==========================================
      // UPDATE EXISTING FEE
      // ==========================================

      if (editingId) {
        setFees((prevFees) =>
          prevFees.map((fee) =>
            fee._id === editingId
              ? data.fee
              : fee
          )
        );
      }

      // ==========================================
      // ADD NEW FEE
      // ==========================================

      else {
        setFees((prevFees) => [
          data.fee,
          ...prevFees,
        ]);
      }

      // Reset form
      setFormData({
        studentId: "",
        amount: "",
        month: "",
        status: "Paid",
        paymentDate: "",
      });

      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        editingId
          ? "Update fee error:"
          : "Create fee error:",
        error
      );

      setError(
        error.message ||
          `Failed to ${
            editingId ? "update" : "save"
          } fee record.`
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddFeeModal = () => {
    setError("");
    setEditingId(null);

    setFormData({
      studentId: "",
      amount: "",
      month: "",
      status: "Paid",
      paymentDate: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditFeeModal = (fee) => {
    setError("");
    setEditingId(fee._id);

    setFormData({
      studentId: fee.studentId?._id || fee.studentId || "",
      amount: fee.amount ?? "",
      month: fee.month || "",
      status: fee.status || "Paid",
      paymentDate: fee.paymentDate
        ? String(fee.paymentDate).slice(0, 10)
        : "",
    });

    setShowForm(true);
  };

  // ==========================================
  // DELETE FEE
  // ==========================================

  const deleteFee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fee record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `${FEES_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete fee record"
        );
      }

      setFees((prevFees) =>
        prevFees.filter(
          (fee) => fee._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete fee error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete fee record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredFees = fees.filter((fee) => {
    const studentName =
      fee.studentId?.name || "";

    const className =
      fee.studentId?.className || "";

    const month = fee.month || "";

    const searchValue =
      search.toLowerCase();

    return (
      studentName
        .toLowerCase()
        .includes(searchValue) ||
      className
        .toLowerCase()
        .includes(searchValue) ||
      month
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="students-page">

      {/* PAGE HEADER */}

      <div className="page-heading">
        <div>
          <h1>Fees</h1>
          <p>Manage student fee records.</p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddFeeModal}
        >
          <Plus size={18} />
          Add Fee
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            background:
              "rgba(239, 68, 68, 0.12)",
            border:
              "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* FEES CARD */}

      <div className="students-card">

        <div className="table-top">
          <h2>Fee Records</h2>

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>

            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Fee Amount</th>
                <th>Month</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-state"
                  >
                    Loading fee records...
                  </td>
                </tr>
              ) : filteredFees.length > 0 ? (
                filteredFees.map((fee) => (
                  <tr key={fee._id}>

                    <td>
                      {fee.studentId?.name ||
                        "Unknown Student"}
                    </td>

                    <td>
                      {fee.studentId?.className ||
                        "Not assigned"}
                    </td>

                    <td>
                      Rs.{" "}
                      {Number(
                        fee.amount || 0
                      ).toLocaleString()}
                    </td>

                    <td>
                      {fee.month || "-"}
                    </td>

                    <td>
                      <span
                        className={
                          fee.status === "Paid"
                            ? "status active"
                            : "status inactive"
                        }
                      >
                        {fee.status}
                      </span>
                    </td>

                    <td>

                      {/* EDIT */}

                      <button
                        className="icon-btn"
                        onClick={() =>
                          openEditFeeModal(fee)
                        }
                        title="Edit Fee"
                        style={{
                          marginRight: "8px",
                        }}
                      >
                        <Edit2 size={17} />
                      </button>

                      {/* DELETE */}

                      <button
                        className="icon-btn delete"
                        onClick={() =>
                          deleteFee(fee._id)
                        }
                        disabled={
                          deletingId === fee._id
                        }
                        title="Delete Fee"
                      >
                        {deletingId === fee._id ? (
                          "..."
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-state"
                  >
                    No fee records found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          ADD / EDIT FEE MODAL
      ========================================== */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Fee Record"
                    : "Add Fee Record"}
                </h2>

                <p>
                  {editingId
                    ? "Update the student's fee information."
                    : "Enter the student's fee information."}
                </p>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* STUDENT */}

              <div className="form-group">
                <label>Student</label>

                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {student.name}
                      {student.className
                        ? ` — ${student.className}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* FEE AMOUNT */}

              <div className="form-group">
                <label>Fee Amount</label>

                <input
                  type="number"
                  name="amount"
                  min="0"
                  placeholder="Enter fee amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* MONTH */}

              <div className="form-group">
                <label>Month</label>

                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* STATUS */}

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>
                </select>
              </div>

              {/* PAYMENT DATE */}

              <div className="form-group">
                <label>Payment Date</label>

                <input
                  type="date"
                  name="paymentDate"
                  value={
                    formData.paymentDate
                  }
                  onChange={handleChange}
                />
              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                    ? "Update Fee"
                    : "Save Fee"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Fees;