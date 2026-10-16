import "../styles/Feedback.css";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  Star,
  Search,
  Trash2,
  Edit2,
  X,
} from "lucide-react";

const FEEDBACK_API = "http://localhost:5000/api/feedback";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Website");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH FEEDBACK
  // ==========================================

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(FEEDBACK_API);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch feedback"
          );
        }

        setFeedbacks(data.feedbacks || []);
      } catch (error) {
        console.error("Fetch feedback error:", error);

        setError(
          error.message || "Unable to load feedback."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setError("");
    setSuccess("");

    setEditingId(null);
    setName("");
    setCategory("Website");
    setRating(5);
    setMessage("");

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (feedback) => {
    setError("");
    setSuccess("");

    setEditingId(feedback._id);

    setName(feedback.name || "");
    setCategory(feedback.category || "Website");
    setRating(Number(feedback.rating) || 5);
    setMessage(feedback.message || "");

    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
  };

  // ==========================================
  // SUBMIT / UPDATE FEEDBACK
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!message.trim()) {
      setError("Please write your feedback.");
      return;
    }

    if (message.trim().length < 5) {
      setError("Feedback must be at least 5 characters.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    try {
      setSaving(true);

      const feedbackData = {
        name: name.trim(),
        category,
        rating,
        message: message.trim(),
      };

      const url = editingId
        ? `${FEEDBACK_API}/${editingId}`
        : FEEDBACK_API;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingId ? "update" : "submit"
            } feedback`
        );
      }

      // ==========================================
      // UPDATE EXISTING FEEDBACK
      // ==========================================

      if (editingId) {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback._id === editingId
              ? data.feedback
              : feedback
          )
        );

        setSuccess(
          "Feedback updated successfully."
        );
      }

      // ==========================================
      // ADD NEW FEEDBACK
      // ==========================================

      else {
        setFeedbacks((prevFeedbacks) => [
          data.feedback,
          ...prevFeedbacks,
        ]);

        setSuccess(
          "Feedback submitted successfully."
        );
      }

      // Reset form

      setName("");
      setCategory("Website");
      setRating(5);
      setMessage("");
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        editingId
          ? "Update feedback error:"
          : "Submit feedback error:",
        error
      );

      setError(
        error.message ||
          `Failed to ${
            editingId ? "update" : "submit"
          } feedback.`
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE FEEDBACK
  // ==========================================

  const deleteFeedback = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${FEEDBACK_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete feedback"
        );
      }

      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter(
          (feedback) => feedback._id !== id
        )
      );

      setSuccess(
        "Feedback deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete feedback error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete feedback."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredFeedbacks = feedbacks.filter(
    (feedback) => {
      const searchValue = search.toLowerCase();

      return (
        (feedback.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        (feedback.category || "")
          .toLowerCase()
          .includes(searchValue) ||
        (feedback.message || "")
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="feedback-page">

      {/* PAGE HEADING */}

      <div className="page-heading">
        <div>
          <p className="eyebrow">FEEDBACK</p>

          <h1>Student Feedback</h1>

          <p>
            Collect and manage feedback
            from students and teachers.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddForm}
        >
          <MessageSquare size={18} />
          Add Feedback
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

      {/* SUCCESS */}

      {success && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            background:
              "rgba(34, 197, 94, 0.12)",
            border:
              "1px solid rgba(34, 197, 94, 0.3)",
            color: "#86efac",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      {/* FEEDBACK LIST */}

      <div className="feedback-card">

        <div className="table-top">

          <div>
            <h2>Recent Feedback</h2>

            <p className="feedback-small-text">
              See what people are saying.
            </p>
          </div>

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        <div className="feedback-list">

          {loading ? (

            <p className="no-feedback">
              Loading feedback...
            </p>

          ) : filteredFeedbacks.length === 0 ? (

            <p className="no-feedback">
              No feedback found.
            </p>

          ) : (

            filteredFeedbacks.map(
              (feedback) => (

                <div
                  className="feedback-item"
                  key={feedback._id}
                >

                  {/* TOP */}

                  <div className="feedback-item-top">

                    <div>

                      <h3>
                        {feedback.name}
                      </h3>

                      <span>
                        {feedback.category ||
                          "Website"}
                      </span>

                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >

                      {/* EDIT */}

                      <button
                        className="icon-btn"
                        onClick={() =>
                          openEditForm(feedback)
                        }
                        title="Edit Feedback"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* DELETE */}

                      <button
                        className="icon-btn"
                        onClick={() =>
                          deleteFeedback(
                            feedback._id
                          )
                        }
                        disabled={
                          deletingId ===
                          feedback._id
                        }
                        title="Delete Feedback"
                      >
                        {deletingId ===
                        feedback._id ? (
                          "..."
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* STARS */}

                  <div className="feedback-stars">

                    {[1, 2, 3, 4, 5].map(
                      (number) => (
                        <Star
                          key={number}
                          size={17}
                          fill={
                            number <=
                            feedback.rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}

                  </div>

                  {/* MESSAGE */}

                  <p className="feedback-message">
                    "{feedback.message}"
                  </p>

                </div>

              )
            )

          )}

        </div>
      </div>

      {/* ==========================================
          ADD / EDIT FEEDBACK MODAL
      ========================================== */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeForm}
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
                    ? "Edit Feedback"
                    : "Add Feedback"}
                </h2>

                <p>
                  {editingId
                    ? "Update the feedback information."
                    : "Enter feedback information."}
                </p>

              </div>

              <button
                type="button"
                className="close-btn"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="form-group">

                <label>Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >

                  <option value="Website">
                    Website
                  </option>

                  <option value="Teaching">
                    Teaching
                  </option>

                  <option value="Management">
                    Management
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* RATING */}

              <div className="form-group">

                <label>Rating</label>

                <div className="rating-input">

                  {[1, 2, 3, 4, 5].map(
                    (number) => (
                      <button
                        type="button"
                        key={number}
                        className={
                          number <= rating
                            ? "star selected"
                            : "star"
                        }
                        onClick={() =>
                          setRating(number)
                        }
                        aria-label={`Rate ${number} stars`}
                      >
                        <Star
                          size={24}
                          fill={
                            number <= rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* MESSAGE */}

              <div className="form-group">

                <label>
                  Your Feedback
                </label>

                <textarea
                  placeholder="Write your feedback here..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  rows="5"
                  required
                />

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  <MessageSquare size={18} />

                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Submitting..."
                    : editingId
                    ? "Update Feedback"
                    : "Submit Feedback"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Feedback;