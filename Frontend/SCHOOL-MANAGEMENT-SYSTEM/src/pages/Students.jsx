import "../styles/Students.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  Trash2,
  X,
  UserRound,
  Mail,
  Phone,
  School,
  Users,
  UserCheck,
  Eye,
  Edit2,
} from "lucide-react";

const API_URL = "https://school-nova-pied.vercel.app/api/students";

function Students({ students, setStudents }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Used to know whether we are adding or editing
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    className: "",
    rollNumber: "",
    status: "Active",
  });

  // ==============================
  // FETCH STUDENTS
  // ==============================

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch students"
          );
        }

        setStudents(data.students || []);
      } catch (error) {
        console.error("Fetch students error:", error);

        setError(
          "Unable to load students. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [setStudents]);

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
      className: "",
      rollNumber: "",
      status: "Active",
    });

    setShowForm(true);
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  const openEditForm = (student) => {
    setError("");
    setEditingId(student._id);

    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      className: student.className || "",
      rollNumber: student.rollNumber || "",
      status: student.status || "Active",
    });

    setShowForm(true);
  };

  // ==============================
  // ADD / UPDATE STUDENT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      // ==========================================
      // UPDATE EXISTING STUDENT
      // ==========================================

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
            data.message || "Failed to update student"
          );
        }

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editingId
              ? data.student
              : student
          )
        );

        setEditingId(null);
        setShowForm(false);

        setFormData({
          name: "",
          email: "",
          phone: "",
          className: "",
          rollNumber: "",
          status: "Active",
        });

        return;
      }

      // ==========================================
      // ADD NEW STUDENT
      // ==========================================

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
          data.message || "Failed to create student"
        );
      }

      setStudents((prevStudents) => [
        data.student,
        ...prevStudents,
      ]);

      setFormData({
        name: "",
        email: "",
        phone: "",
        className: "",
        rollNumber: "",
        status: "Active",
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        editingId
          ? "Update student error:"
          : "Create student error:",
        error
      );

      setError(
        error.message ||
          (editingId
            ? "Failed to update student."
            : "Failed to add student.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE STUDENT
  // ==============================

  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
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
          data.message || "Failed to delete student"
        );
      }

      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete student."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==============================
  // SUMMARY CALCULATIONS
  // ==============================

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveStudents = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const totalClasses = new Set(
    students
      .map((student) => student.className)
      .filter(Boolean)
  ).size;

  // ==============================
  // UI
  // ==============================

  return (
    <div className="students-page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="page-heading">

        <div className="heading-content">

          <span className="page-kicker">
            SCHOOL MANAGEMENT
          </span>

          <h1>Students</h1>

          <p>
            Manage all school students from one place.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Student
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

      <div className="student-summary-grid">

        {/* TOTAL */}

        <div className="summary-card blue-summary">

          <div className="summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Students</span>

            <strong>
              {students.length}
            </strong>
          </div>

        </div>

        {/* ACTIVE */}

        <div className="summary-card green-summary">

          <div className="summary-icon">
            <UserCheck size={20} />
          </div>

          <div>
            <span>Active Students</span>

            <strong>
              {activeStudents}
            </strong>
          </div>

        </div>

        {/* CLASSES */}

        <div className="summary-card purple-summary">

          <div className="summary-icon">
            <School size={20} />
          </div>

          <div>
            <span>Classes</span>

            <strong>
              {totalClasses}
            </strong>
          </div>

        </div>

        {/* INACTIVE */}

        <div className="summary-card orange-summary">

          <div className="summary-icon">
            <UserRound size={20} />
          </div>

          <div>
            <span>Inactive Students</span>

            <strong>
              {inactiveStudents}
            </strong>
          </div>

        </div>

      </div>

      {/* ==========================================
          STUDENTS TABLE
      ========================================== */}

      <div className="students-card">

        {/* TABLE HEADER */}

        <div className="table-top">

          <div>

            <span className="table-kicker">
              STUDENT DIRECTORY
            </span>

            <h2>All Students</h2>

            <p>
              View and manage registered students.
            </p>

          </div>

          {/* SEARCH */}

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

        {/* TABLE */}

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Student Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Class
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

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-state"
                  >

                    <div className="empty-icon">
                      <Users size={25} />
                    </div>

                    <strong>
                      Loading students...
                    </strong>

                    <span>
                      Please wait while we load your students.
                    </span>

                  </td>

                </tr>

              ) : filteredStudents.length > 0 ? (

                /* ==================================
                   STUDENT ROWS
                ================================== */

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={student._id}
                    >

                      {/* STUDENT NAME */}

                      <td>

                        <div className="student-name-cell">

                          <div className="student-avatar">
                            <UserRound
                              size={17}
                            />
                          </div>

                          <div>

                            <strong>
                              {student.name}
                            </strong>

                            <span>
                              Student
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td>

                        <div className="email-cell">

                          <Mail size={14} />

                          <span>
                            {student.email}
                          </span>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td>

                        <div className="email-cell">

                          <Phone size={14} />

                          <span>
                            {student.phone}
                          </span>

                        </div>

                      </td>

                      {/* CLASS */}

                      <td>

                        <span className="class-badge">

                          <School
                            size={13}
                          />

                          {student.className}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            student.status ===
                            "Active"
                              ? "status active"
                              : "status inactive"
                          }
                        >

                          <span className="status-dot" />

                          {student.status}

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

                          {/* VIEW */}

                          <button
                            className="icon-btn"
                            onClick={() =>
                              navigate(
                                `/students/${student._id}`
                              )
                            }
                            title="View Student Details"
                          >
                            <Eye size={17} />
                          </button>

                          {/* EDIT */}

                          <button
                            className="icon-btn"
                            onClick={() =>
                              openEditForm(student)
                            }
                            title="Edit Student"
                          >
                            <Edit2 size={17} />
                          </button>

                          {/* DELETE */}

                          <button
                            className="icon-btn delete"
                            onClick={() =>
                              deleteStudent(
                                student._id
                              )
                            }
                            title="Delete Student"
                            disabled={
                              deletingId ===
                              student._id
                            }
                          >

                            {deletingId ===
                            student._id ? (
                              "..."
                            ) : (
                              <Trash2 size={17} />
                            )}

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                /* ==================================
                   NO STUDENTS
                ================================== */

                <tr>

                  <td
                    colSpan="6"
                    className="empty-state"
                  >

                    <div className="empty-icon">
                      <Users size={25} />
                    </div>

                    <strong>
                      No students found
                    </strong>

                    <span>
                      Try another search or add a new student.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==========================================
          ADD / EDIT STUDENT MODAL
      ========================================== */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
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

                <span className="modal-kicker">
                  STUDENT MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Student"
                    : "Add New Student"}
                </h2>

                <p>
                  {editingId
                    ? "Update the student's information."
                    : "Register a new student in your school."}
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
                    Student Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter student name"
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

                {/* CLASS */}

                <div className="form-group">

                  <label>
                    Class
                  </label>

                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select class
                    </option>

                    <option value="8th">
                      8th
                    </option>

                    <option value="9th">
                      9th
                    </option>

                    <option value="10th">
                      10th
                    </option>

                    <option value="11th">
                      11th
                    </option>

                    <option value="12th">
                      12th
                    </option>

                  </select>

                </div>

                {/* ROLL NUMBER */}

                <div className="form-group">

                  <label>
                    Roll Number
                  </label>

                  <input
                    type="text"
                    name="rollNumber"
                    placeholder="Enter roll number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
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

              {/* SAVE / UPDATE BUTTON */}

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
                      ? "Update Student"
                      : "Save Student"}
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

export default Students;