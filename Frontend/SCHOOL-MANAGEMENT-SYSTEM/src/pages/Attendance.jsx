import "../styles/Attendance.css";
import { useEffect, useState } from "react";
import { Search, Check, X } from "lucide-react";

const STUDENTS_API = "https://school-nova-pied.vercel.app/api/students";
const ATTENDANCE_API = "https://school-nova-pied.vercel.app/api/attendance";

function Attendance({ attendance, setAttendance }) {
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // CHECK SAME DAY
  // ==========================================

  const isSameDay = (date1, date2) => {
    const first = new Date(date1);
    const second = new Date(date2);

    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  };

  // ==========================================
  // FETCH STUDENTS + TODAY'S ATTENDANCE
  // ==========================================

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError("");

        const [studentsResponse, attendanceResponse] =
          await Promise.all([
            fetch(STUDENTS_API),
            fetch(ATTENDANCE_API),
          ]);

        const studentsData =
          await studentsResponse.json();

        const attendanceData =
          await attendanceResponse.json();

        if (
          !studentsResponse.ok ||
          !studentsData.success
        ) {
          throw new Error(
            studentsData.message ||
              "Failed to fetch students"
          );
        }

        if (
          !attendanceResponse.ok ||
          !attendanceData.success
        ) {
          throw new Error(
            attendanceData.message ||
              "Failed to fetch attendance"
          );
        }

        const students =
          studentsData.students || [];

        const allAttendance =
          attendanceData.attendance || [];

        const today = new Date();

        // ==========================================
        // CREATE TODAY'S ATTENDANCE VIEW
        // ==========================================

        const todayAttendance = students.map(
          (student) => {
            const existingRecord =
              allAttendance.find((record) => {
                const recordStudentId =
                  record.studentId?._id ||
                  record.studentId;

                return (
                  recordStudentId === student._id &&
                  isSameDay(record.date, today)
                );
              });

            return {
              id: student._id,

              name:
                student.name ||
                "Unknown Student",

              className:
                student.className ||
                "Not assigned",

              status: existingRecord
                ? existingRecord.status
                : "Absent",

              attendanceId:
                existingRecord?._id || null,
            };
          }
        );

        setAttendance(todayAttendance);
      } catch (error) {
        console.error(
          "Fetch attendance error:",
          error
        );

        setError(
          error.message ||
            "Unable to load attendance."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [setAttendance]);

  // ==========================================
  // CHANGE ATTENDANCE STATUS
  // ==========================================

  const changeStatus = async (
    studentId,
    status
  ) => {
    try {
      setSavingId(studentId);
      setError("");

      const student = attendance.find(
        (item) => item.id === studentId
      );

      if (!student) {
        throw new Error(
          "Student not found"
        );
      }

      // ==========================================
      // UPDATE EXISTING ATTENDANCE
      // ==========================================

      if (student.attendanceId) {
        const response = await fetch(
          `${ATTENDANCE_API}/${student.attendanceId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update attendance"
          );
        }

        setAttendance(
          (prevAttendance) =>
            prevAttendance.map(
              (item) =>
                item.id === studentId
                  ? {
                      ...item,
                      status,
                    }
                  : item
            )
        );

        return;
      }

      // ==========================================
      // CREATE NEW ATTENDANCE RECORD
      // ==========================================

      const response = await fetch(
        ATTENDANCE_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            date: new Date().toISOString(),
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to record attendance"
        );
      }

      setAttendance(
        (prevAttendance) =>
          prevAttendance.map(
            (item) =>
              item.id === studentId
                ? {
                    ...item,
                    status,
                    attendanceId:
                      data.attendance?._id ||
                      null,
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "Change attendance error:",
        error
      );

      setError(
        error.message ||
          "Failed to save attendance."
      );
    } finally {
      setSavingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents =
    attendance.filter((student) => {
      const searchValue =
        search.toLowerCase();

      return (
        (student.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        (student.className || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });

  // ==========================================
  // ATTENDANCE CALCULATIONS
  // ==========================================

  const totalStudents =
    attendance.length;

  const presentStudents =
    attendance.filter(
      (student) =>
        student.status === "Present"
    ).length;

  const attendancePercentage =
    totalStudents === 0
      ? 0
      : (presentStudents /
          totalStudents) *
        100;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="students-page attendance-page">

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <h1>Attendance</h1>

          <p>
            Manage daily student attendance.
          </p>

        </div>

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

      {/* ATTENDANCE CARD */}

      <div className="students-card attendance-card">

        {/* TABLE TOP */}

        <div className="table-top">

          <div className="attendance-title">

            <h2>
              Today's Attendance
            </h2>

            <p className="attendance-summary">

              Present:{" "}
              {presentStudents} /{" "}
              {totalStudents}{" "}

              (
              {attendancePercentage.toFixed(
                1
              )}
              %)

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

        {/* ATTENDANCE OVERVIEW */}

        <div className="attendance-overview">

          <div className="attendance-overview-text">

            <span>
              Today's Attendance Rate
            </span>

            <strong>
              {attendancePercentage.toFixed(
                1
              )}
              %
            </strong>

          </div>

          <div className="attendance-progress-track">

            <div
              className="attendance-progress-fill"
              style={{
                width: `${Math.min(
                  attendancePercentage,
                  100
                )}%`,
              }}
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
                  Class
                </th>

                <th>
                  Attendance
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
                    colSpan="4"
                    className="empty-state"
                  >
                    Loading attendance...
                  </td>

                </tr>

              ) : filteredStudents.length > 0 ? (

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >

                      {/* STUDENT */}

                      <td>

                        <div className="attendance-student">

                          <div className="student-avatar">

                            {(
                              student.name ||
                              "S"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <span>
                            {student.name}
                          </span>

                        </div>

                      </td>

                      {/* CLASS */}

                      <td>
                        {student.className ||
                          "Not assigned"}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            student.status ===
                            "Present"
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {student.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="attendance-actions">

                          {/* PRESENT */}

                          <button
                            className="attendance-action present-btn"
                            onClick={() =>
                              changeStatus(
                                student.id,
                                "Present"
                              )
                            }
                            title="Mark Present"
                            disabled={
                              savingId ===
                              student.id
                            }
                          >

                            <Check
                              size={17}
                            />

                          </button>

                          {/* ABSENT */}

                          <button
                            className="attendance-action absent-btn"
                            onClick={() =>
                              changeStatus(
                                student.id,
                                "Absent"
                              )
                            }
                            title="Mark Absent"
                            disabled={
                              savingId ===
                              student.id
                            }
                          >

                            <X
                              size={17}
                            />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    className="empty-state"
                  >
                    No students found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Attendance;