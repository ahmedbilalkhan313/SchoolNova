import "../styles/Classes.css";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  X,
  School,
  Users,
  UserRound,
  DoorOpen,
  Edit2,
} from "lucide-react";

const API_URL = "https://school-nova-pied.vercel.app/api/classes";

function Classes({ classes, setClasses }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    section: "",
    teacher: "",
    room: "",
    studentsCount: 0,
  });

  // ==============================
  // FETCH CLASSES
  // ==============================

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch classes"
          );
        }

        setClasses(data.classes || []);
      } catch (error) {
        console.error("Fetch classes error:", error);

        setError(
          "Unable to load classes. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [setClasses]);

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
      section: "",
      teacher: "",
      room: "",
      studentsCount: 0,
    });

    setShowForm(true);
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  const openEditForm = (classItem) => {
    setError("");
    setEditingId(classItem._id);

    setFormData({
      name: classItem.name || "",
      section: classItem.section || "",
      teacher: classItem.teacher || "",
      room: classItem.room || "",
      studentsCount: Number(
        classItem.studentsCount || 0
      ),
    });

    setShowForm(true);
  };

  // ==============================
  // ADD / UPDATE CLASS
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const classData = {
        ...formData,
        studentsCount:
          Number(formData.studentsCount) || 0,
      };

      // ==============================
      // UPDATE EXISTING CLASS
      // ==============================

      if (editingId) {
        const response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(classData),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to update class"
          );
        }

        setClasses((prevClasses) =>
          prevClasses.map((classItem) =>
            classItem._id === editingId
              ? data.class
              : classItem
          )
        );

        setEditingId(null);

        setFormData({
          name: "",
          section: "",
          teacher: "",
          room: "",
          studentsCount: 0,
        });

        setShowForm(false);

        return;
      }

      // ==============================
      // ADD NEW CLASS
      // ==============================

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create class"
        );
      }

      setClasses((prevClasses) => [
        data.class,
        ...prevClasses,
      ]);

      setFormData({
        name: "",
        section: "",
        teacher: "",
        room: "",
        studentsCount: 0,
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        editingId
          ? "Update class error:"
          : "Create class error:",
        error
      );

      setError(
        error.message ||
          (editingId
            ? "Failed to update class."
            : "Failed to add class.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE CLASS
  // ==============================

  const deleteClass = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
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
          data.message || "Failed to delete class"
        );
      }

      setClasses((prevClasses) =>
        prevClasses.filter(
          (classItem) => classItem._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete class error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete class."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredClasses = classes.filter(
    (classItem) => {
      const searchValue = search.toLowerCase();

      return (
        (classItem.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        (classItem.section || "")
          .toLowerCase()
          .includes(searchValue) ||
        (classItem.teacher || "")
          .toLowerCase()
          .includes(searchValue) ||
        (classItem.room || "")
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // ==============================
  // SUMMARY CALCULATIONS
  // ==============================

  const totalClasses = classes.length;

  const totalStudents = classes.reduce(
    (total, classItem) =>
      total +
      Number(classItem.studentsCount || 0),
    0
  );

  const totalTeachers = new Set(
    classes
      .map((classItem) => classItem.teacher)
      .filter(Boolean)
  ).size;

  const totalRooms = new Set(
    classes
      .map((classItem) => classItem.room)
      .filter(Boolean)
  ).size;

  // ==============================
  // UI
  // ==============================

  return (
    <div className="classes-page">

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div className="heading-content">

          <span className="page-kicker">
            SCHOOL MANAGEMENT
          </span>

          <h1>Classes</h1>

          <p>
            Manage all school classes from one place.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Class
        </button>

      </div>

      {/* ERROR MESSAGE */}

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

      {/* SUMMARY CARDS */}

      <div className="class-summary-grid">

        {/* TOTAL CLASSES */}

        <div className="summary-card blue-summary">

          <div className="summary-icon">
            <School size={20} />
          </div>

          <div>
            <span>Total Classes</span>

            <strong>
              {totalClasses}
            </strong>
          </div>

        </div>

        {/* TOTAL STUDENTS */}

        <div className="summary-card purple-summary">

          <div className="summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Students</span>

            <strong>
              {totalStudents}
            </strong>
          </div>

        </div>

        {/* TEACHERS */}

        <div className="summary-card green-summary">

          <div className="summary-icon">
            <UserRound size={20} />
          </div>

          <div>
            <span>Teachers</span>

            <strong>
              {totalTeachers}
            </strong>
          </div>

        </div>

        {/* ROOMS */}

        <div className="summary-card orange-summary">

          <div className="summary-icon">
            <DoorOpen size={20} />
          </div>

          <div>
            <span>Rooms</span>

            <strong>
              {totalRooms}
            </strong>
          </div>

        </div>

      </div>

      {/* CLASSES TABLE */}

      <div className="classes-card">

        {/* TABLE HEADER */}

        <div className="table-top">

          <div>

            <span className="table-kicker">
              CLASS DIRECTORY
            </span>

            <h2>All Classes</h2>

            <p>
              View and manage your school classes.
            </p>

          </div>

          {/* SEARCH */}

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search class..."
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

                <th>Class</th>

                <th>Section</th>

                <th>Teacher</th>

                <th>Students</th>

                <th>Room</th>

                <th>Action</th>

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
                      <School size={25} />
                    </div>

                    <strong>
                      Loading classes...
                    </strong>

                    <span>
                      Please wait while we load your classes.
                    </span>

                  </td>

                </tr>

              ) : filteredClasses.length > 0 ? (

                /* CLASS ROWS */

                filteredClasses.map(
                  (classItem) => (

                    <tr
                      key={classItem._id}
                    >

                      {/* CLASS NAME */}

                      <td>

                        <div className="class-name-cell">

                          <div className="class-avatar">
                            <School size={17} />
                          </div>

                          <div>

                            <strong>
                              {classItem.name}
                            </strong>

                            <span>
                              Class
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* SECTION */}

                      <td>

                        <span className="room-badge">
                          {classItem.section}
                        </span>

                      </td>

                      {/* TEACHER */}

                      <td>

                        <div className="teacher-cell">

                          <div className="teacher-avatar">
                            <UserRound size={14} />
                          </div>

                          <span>
                            {classItem.teacher ||
                              "Not assigned"}
                          </span>

                        </div>

                      </td>

                      {/* STUDENTS */}

                      <td>

                        <div className="students-count">

                          <Users size={14} />

                          <span>
                            {classItem.studentsCount ||
                              0}
                          </span>

                        </div>

                      </td>

                      {/* ROOM */}

                      <td>

                        <span className="room-badge">

                          <DoorOpen size={13} />

                          {classItem.room ||
                            "Not assigned"}

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
                                classItem
                              )
                            }
                            title="Edit Class"
                          >
                            <Edit2 size={17} />
                          </button>

                          {/* DELETE */}

                          <button
                            className="icon-btn delete"
                            onClick={() =>
                              deleteClass(
                                classItem._id
                              )
                            }
                            title="Delete Class"
                            disabled={
                              deletingId ===
                              classItem._id
                            }
                          >

                            {deletingId ===
                            classItem._id ? (
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

                /* NO CLASSES */

                <tr>

                  <td
                    colSpan="6"
                    className="empty-state"
                  >

                    <div className="empty-icon">
                      <School size={25} />
                    </div>

                    <strong>
                      No classes found
                    </strong>

                    <span>
                      Try another search or add a new class.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ADD / EDIT CLASS MODAL */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="class-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <span className="modal-kicker">
                  CLASS MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Class"
                    : "Add New Class"}
                </h2>

                <p>
                  {editingId
                    ? "Update the class information."
                    : "Create a new class for your school."}
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

                {/* CLASS NAME */}

                <div className="form-group">

                  <label>
                    Class Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Grade 10"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* SECTION */}

                <div className="form-group">

                  <label>
                    Section
                  </label>

                  <input
                    type="text"
                    name="section"
                    placeholder="e.g. A"
                    value={formData.section}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* TEACHER */}

                <div className="form-group">

                  <label>
                    Teacher
                  </label>

                  <input
                    type="text"
                    name="teacher"
                    placeholder="Enter teacher name"
                    value={formData.teacher}
                    onChange={handleChange}
                  />

                </div>

                {/* ROOM */}

                <div className="form-group">

                  <label>
                    Room
                  </label>

                  <input
                    type="text"
                    name="room"
                    placeholder="e.g. Room 101"
                    value={formData.room}
                    onChange={handleChange}
                  />

                </div>

                {/* STUDENTS COUNT */}

                <div className="form-group">

                  <label>
                    Students Count
                  </label>

                  <input
                    type="number"
                    name="studentsCount"
                    min="0"
                    placeholder="Enter number of students"
                    value={
                      formData.studentsCount
                    }
                    onChange={handleChange}
                  />

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
                      ? "Update Class"
                      : "Save Class"}
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

export default Classes;