import "../styles/Teachers.css";
import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Trash2,
  X,
  UserRound,
  Mail,
  Phone,
  BookOpen,
  School,
  Users,
  GraduationCap,
  Edit2,
} from "lucide-react";

const API_URL = "https://school-nova-pied.vercel.app/api/teachers";

function Teachers({ teachers, setTeachers }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    status: "Active",
  });

  // ==============================
  // FETCH TEACHERS
  // ==============================

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch teachers"
          );
        }

        setTeachers(data.teachers || []);
      } catch (error) {
        console.error("Fetch teachers error:", error);

        setError(
          "Unable to load teachers. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [setTeachers]);

  // ==============================
  // FORM CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // OPEN ADD FORM
  // ==============================

  const openAddForm = () => {
    setError("");
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      qualification: "",
      status: "Active",
    });

    setShowForm(true);
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  const openEditForm = (teacher) => {
    setError("");
    setEditingId(teacher._id);

    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      subject: teacher.subject || "",
      qualification: teacher.qualification || "",
      status: teacher.status || "Active",
    });

    setShowForm(true);
  };

  // ==============================
  // ADD / UPDATE TEACHER
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      // ==============================
      // UPDATE EXISTING TEACHER
      // ==============================

      if (editingId) {
        const response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to update teacher"
          );
        }

        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher._id === editingId
              ? data.teacher
              : teacher
          )
        );

        setEditingId(null);

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          qualification: "",
          status: "Active",
        });

        setShowForm(false);

        return;
      }

      // ==============================
      // ADD NEW TEACHER
      // ==============================

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create teacher"
        );
      }

      setTeachers((prevTeachers) => [
        data.teacher,
        ...prevTeachers,
      ]);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        qualification: "",
        status: "Active",
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        editingId
          ? "Update teacher error:"
          : "Create teacher error:",
        error
      );

      setError(
        error.message ||
          (editingId
            ? "Failed to update teacher."
            : "Failed to add teacher.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE TEACHER
  // ==============================

  const deleteTeacher = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete teacher"
        );
      }

      setTeachers((prevTeachers) =>
        prevTeachers.filter(
          (teacher) => teacher._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete teacher error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete teacher."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==============================
  // SUMMARY CALCULATIONS
  // ==============================

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  const inactiveTeachers = teachers.filter(
    (teacher) => teacher.status === "Inactive"
  ).length;

  const subjects = new Set(
    teachers
      .map((teacher) => teacher.subject)
      .filter(Boolean)
  ).size;

  // ==============================
  // UI
  // ==============================

  return (
    <div className="teachers-page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="page-heading">

        <div className="heading-content">

          <span className="page-kicker">
            SCHOOL MANAGEMENT
          </span>

          <h1>Teachers</h1>

          <p>
            Manage all school teachers from one place.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Teacher
        </button>

      </div>

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

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

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="teacher-summary-grid">

        {/* TOTAL TEACHERS */}

        <div className="summary-card blue-summary">

          <div className="summary-icon">
            <UserRound size={20} />
          </div>

          <div>
            <span>Total Teachers</span>

            <strong>
              {teachers.length}
            </strong>
          </div>

        </div>

        {/* ACTIVE TEACHERS */}

        <div className="summary-card green-summary">

          <div className="summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Active Teachers</span>

            <strong>
              {activeTeachers}
            </strong>
          </div>

        </div>

        {/* SUBJECTS */}

        <div className="summary-card purple-summary">

          <div className="summary-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Subjects</span>

            <strong>
              {subjects}
            </strong>
          </div>

        </div>

        {/* INACTIVE TEACHERS */}

        <div className="summary-card orange-summary">

          <div className="summary-icon">
            <School size={20} />
          </div>

          <div>
            <span>Inactive Teachers</span>

            <strong>
              {inactiveTeachers}
            </strong>
          </div>

        </div>

      </div>

      {/* ==========================================
          TEACHERS TABLE
      ========================================== */}

      <div className="teachers-card">

        {/* TABLE HEADER */}

        <div className="table-top">

          <div>

            <span className="table-kicker">
              TEACHER DIRECTORY
            </span>

            <h2>All Teachers</h2>

            <p>
              View and manage your school teaching staff.
            </p>

          </div>

          {/* SEARCH */}

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search teacher..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Teacher Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Subject
                </th>

                <th>
                  Qualification
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {/* ==================================
                  LOADING
              ================================== */}

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-state"
                  >

                    <div className="empty-icon">
                      <UserRound size={25} />
                    </div>

                    <strong>
                      Loading teachers...
                    </strong>

                    <span>
                      Please wait while we load your teachers.
                    </span>

                  </td>

                </tr>

              ) : filteredTeachers.length > 0 ? (

                /* ==================================
                   TEACHER ROWS
                ================================== */

                filteredTeachers.map(
                  (teacher) => (

                    <tr
                      key={teacher._id}
                    >

                      {/* NAME */}

                      <td>

                        <div className="teacher-name-cell">

                          <div className="teacher-avatar">
                            <UserRound
                              size={17}
                            />
                          </div>

                          <div>

                            <strong>
                              {teacher.name}
                            </strong>

                            <span>
                              Teaching Staff
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td>

                        <div className="email-cell">

                          <Mail size={14} />

                          <span>
                            {teacher.email}
                          </span>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td>

                        <div className="email-cell">

                          <Phone size={14} />

                          <span>
                            {teacher.phone}
                          </span>

                        </div>

                      </td>

                      {/* SUBJECT */}

                      <td>

                        <div className="subject-cell">

                          <BookOpen size={14} />

                          <span>
                            {teacher.subject}
                          </span>

                        </div>

                      </td>

                      {/* QUALIFICATION */}

                      <td>

                        <div className="subject-cell">

                          <GraduationCap
                            size={14}
                          />

                          <span>
                            {teacher.qualification ||
                              "Not specified"}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            teacher.status ===
                            "Active"
                              ? "status active"
                              : "status inactive"
                          }
                        >

                          <span className="status-dot" />

                          {teacher.status}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >

                          {/* EDIT */}

                          <button
                            className="icon-btn"
                            onClick={() =>
                              openEditForm(
                                teacher
                              )
                            }
                            title="Edit Teacher"
                          >
                            <Edit2 size={17} />
                          </button>

                          {/* DELETE */}

                          <button
                            className="icon-btn delete"
                            onClick={() =>
                              deleteTeacher(
                                teacher._id
                              )
                            }
                            title="Delete Teacher"
                            disabled={
                              deletingId ===
                              teacher._id
                            }
                          >

                            {deletingId ===
                            teacher._id ? (
                              "..."
                            ) : (
                              <Trash2
                                size={17}
                              />
                            )}

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                /* ==================================
                   NO TEACHERS
                ================================== */

                <tr>

                  <td
                    colSpan="7"
                    className="empty-state"
                  >

                    <div className="empty-icon">
                      <UserRound size={25} />
                    </div>

                    <strong>
                      No teachers found
                    </strong>

                    <span>
                      Try another search or add a new teacher.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==========================================
          ADD / EDIT TEACHER MODAL
      ========================================== */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="teacher-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <span className="modal-kicker">
                  TEACHER MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Teacher"
                    : "Add New Teacher"}
                </h2>

                <p>
                  {editingId
                    ? "Update the teacher's information."
                    : "Add a new member to your teaching staff."}
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* NAME */}

                <div className="form-group">

                  <label>
                    Teacher Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter teacher name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* PHONE */}

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* SUBJECT */}

                <div className="form-group">

                  <label>
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* QUALIFICATION */}

                <div className="form-group">

                  <label>
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    placeholder="e.g. MSc, M.Ed, B.Ed"
                    value={
                      formData.qualification
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

              {/* SAVE / UPDATE */}

              <button
                type="submit"
                className="primary-btn full-btn"
                disabled={saving}
              >

                {saving ? (

                  editingId
                    ? "Updating..."
                    : "Saving..."

                ) : (

                  <>
                    {editingId ? (
                      <Edit2 size={18} />
                    ) : (
                      <Plus size={18} />
                    )}

                    {editingId
                      ? "Update Teacher"
                      : "Save Teacher"}
                  </>

                )}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Teachers;