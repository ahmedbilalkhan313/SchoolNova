import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  School,
  Hash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "../styles/Students.css";

const API_URL = "http://localhost:5000/api/students";

function StudentDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get student ID directly from the current URL
  // because App.jsx is currently using manual page routing.
  const id = location.pathname.split("/students/")[1];

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError("");
        setStudent(null);

        if (!id) {
          throw new Error("Student ID is missing.");
        }

        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success || !data.student) {
          throw new Error(
            data.message || "Failed to fetch student details."
          );
        }

        setStudent(data.student);
      } catch (error) {
        console.error("Fetch student detail error:", error);

        setError(
          error.message || "Unable to load student details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading) {
    return (
      <div className="students-page student-detail-page">
        <div className="students-card student-detail-card">
          <div className="empty-state">
            <div className="empty-icon">
              <UserRound size={25} />
            </div>

            <strong>Loading student details...</strong>

            <span>
              Please wait while we load the student's information.
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR STATE
  ===================================================== */

  if (error || !student) {
    return (
      <div className="students-page student-detail-page">
        <div className="page-heading">
          <div className="heading-content">
            <span className="page-kicker">
              STUDENT MANAGEMENT
            </span>

            <h1>Student Details</h1>

            <p>
              Unable to load the requested student.
            </p>
          </div>
        </div>

        <div className="students-card student-detail-card">
          <div className="empty-state">
            <div className="empty-icon">
              <XCircle size={25} />
            </div>

            <strong>Student not found</strong>

            <span>
              {error ||
                "The requested student does not exist."}
            </span>

            <button
              className="primary-btn"
              onClick={() => navigate("/students")}
              style={{ marginTop: "18px" }}
            >
              <ArrowLeft size={17} />
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = student.status === "Active";

  return (
    <div className="students-page student-detail-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-heading">

        <div className="heading-content">

          <span className="page-kicker">
            STUDENT MANAGEMENT
          </span>

          <h1>Student Details</h1>

          <p>
            View complete information about this student.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/students")}
        >
          <ArrowLeft size={18} />
          Back to Students
        </button>

      </div>

      {/* =================================================
          STUDENT PROFILE CARD
      ================================================= */}

      <div className="students-card student-detail-card">

        {/* PROFILE HEADER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "4px 0 18px",
          }}
        >

          <div
            className="student-avatar"
            style={{
              width: "54px",
              height: "54px",
              fontSize: "20px",
            }}
          >
            <UserRound size={25} />
          </div>

          <div>

            <span
              className="table-kicker"
              style={{
                display: "block",
              }}
            >
              STUDENT PROFILE
            </span>

            <h2
              style={{
                margin: "3px 0 5px",
                fontSize: "19px",
              }}
            >
              {student.name}
            </h2>

            <span
              className={
                isActive
                  ? "status active"
                  : "status inactive"
              }
            >
              <span className="status-dot" />
              {student.status}
            </span>

          </div>

        </div>

        {/* =================================================
            DETAILS GRID
        ================================================= */}

        <div
          className="student-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >

          {/* EMAIL */}

          <div className="summary-card blue-summary">

            <div className="summary-icon">
              <Mail size={19} />
            </div>

            <div>

              <span>
                Email Address
              </span>

              <strong
                style={{
                  fontSize: "14px",
                  wordBreak: "break-word",
                }}
              >
                {student.email}
              </strong>

            </div>

          </div>

          {/* PHONE */}

          <div className="summary-card green-summary">

            <div className="summary-icon">
              <Phone size={19} />
            </div>

            <div>

              <span>
                Phone Number
              </span>

              <strong
                style={{
                  fontSize: "14px",
                }}
              >
                {student.phone}
              </strong>

            </div>

          </div>

          {/* CLASS */}

          <div className="summary-card purple-summary">

            <div className="summary-icon">
              <School size={19} />
            </div>

            <div>

              <span>
                Class
              </span>

              <strong
                style={{
                  fontSize: "16px",
                }}
              >
                {student.className}
              </strong>

            </div>

          </div>

          {/* ROLL NUMBER */}

          <div className="summary-card orange-summary">

            <div className="summary-icon">
              <Hash size={19} />
            </div>

            <div>

              <span>
                Roll Number
              </span>

              <strong
                style={{
                  fontSize: "16px",
                }}
              >
                {student.rollNumber}
              </strong>

            </div>

          </div>

        </div>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <div
          style={{
            marginTop: "20px",
            paddingTop: "18px",
            borderTop:
              "1px solid rgba(148, 163, 184, 0.12)",
          }}
        >

          <span className="table-kicker">
            ACCOUNT INFORMATION
          </span>

          <h2
            style={{
              marginTop: "5px",
              marginBottom: "15px",
              fontSize: "18px",
            }}
          >
            Student Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >

            {/* STUDENT ID */}

            <div>

              <span
                style={{
                  display: "block",
                  color: "#8fa4c7",
                  fontSize: "12px",
                  marginBottom: "5px",
                }}
              >
                Student ID
              </span>

              <strong
                style={{
                  wordBreak: "break-all",
                  fontSize: "13px",
                }}
              >
                {student._id}
              </strong>

            </div>

            {/* STATUS */}

            <div>

              <span
                style={{
                  display: "block",
                  color: "#8fa4c7",
                  fontSize: "12px",
                  marginBottom: "5px",
                }}
              >
                Status
              </span>

              <span
                className={
                  isActive
                    ? "status active"
                    : "status inactive"
                }
              >

                {isActive ? (
                  <CheckCircle size={14} />
                ) : (
                  <XCircle size={14} />
                )}

                {student.status}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDetail;