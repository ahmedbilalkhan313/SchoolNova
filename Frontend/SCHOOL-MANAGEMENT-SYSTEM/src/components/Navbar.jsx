import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  GraduationCap,
  BookOpen,
  X,
} from "lucide-react";

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const userName = user?.name || "Admin User";
  const userRole = user?.role || "Administrator";

  /*
    Load students and teachers for global search.
  */
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const [studentsResponse, teachersResponse] =
          await Promise.all([
            fetch("https://school-nova-pied.vercel.app/api/students"),
            fetch("https://school-nova-pied.vercel.app/api/teachers"),
          ]);

        const studentsData = await studentsResponse.json();
        const teachersData = await teachersResponse.json();

        if (studentsData.success) {
          setStudents(studentsData.students || []);
        }

        if (teachersData.success) {
          setTeachers(teachersData.teachers || []);
        }
      } catch (error) {
        console.error("Search data loading error:", error);
      }
    };

    loadSearchData();
  }, []);

  /*
    Search results.
  */
  const searchResults = searchText.trim()
    ? [
        ...students
          .filter((student) =>
            `${student.name} ${student.email || ""} ${
              student.className || ""
            }`
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .slice(0, 5)
          .map((student) => ({
            id: student._id || student.id,
            name: student.name,
            detail: `Student • ${student.className || "No class"}`,
            type: "student",
            path: `/students/${student._id || student.id}`,
          })),

        ...teachers
          .filter((teacher) =>
            `${teacher.name} ${teacher.email || ""} ${
              teacher.subject || ""
            } ${teacher.className || ""}`
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .slice(0, 5)
          .map((teacher) => ({
            id: teacher._id || teacher.id,
            name: teacher.name,
            detail: `Teacher • ${
              teacher.subject || "No subject"
            }`,
            type: "teacher",
            path: null,
          })),
      ]
    : [];

  /*
    Open search result.
  */
  const handleSearchResult = (result) => {
    if (result.path) {
      window.location.href = result.path;
    }

    setSearchText("");
  };

  /*
    Clear search.
  */
  const clearSearch = () => {
    setSearchText("");
  };

  /*
    Logout.
  */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <header className="navbar">

      {/* SEARCH */}

      <div className="search-wrapper">
        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search students, teachers..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />

          {searchText && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* SEARCH RESULTS */}

        {searchText.trim() && (
          <div className="search-results">

            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <button
                  type="button"
                  className="search-result-item"
                  key={`${result.type}-${result.id}`}
                  onClick={() =>
                    handleSearchResult(result)
                  }
                >
                  <div className="search-result-icon">
                    {result.type === "student" ? (
                      <GraduationCap size={17} />
                    ) : (
                      <BookOpen size={17} />
                    )}
                  </div>

                  <div className="search-result-info">
                    <strong>{result.name}</strong>
                    <span>{result.detail}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="search-no-result">
                <Search size={18} />
                <span>No matching student or teacher found.</span>
              </div>
            )}

          </div>
        )}
      </div>

      {/* RIGHT SIDE */}

      <div className="navbar-right">

        {/* NOTIFICATION */}

        <button
          className="notification-btn"
          type="button"
        >
          <Bell size={21} />
          <span className="notification-dot"></span>
        </button>

        {/* PROFILE */}

        <div className="profile-wrapper">

          <button
            className="profile"
            type="button"
            onClick={() =>
              setProfileOpen(
                (previous) => !previous
              )
            }
          >
            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
              <strong>{userName}</strong>

              <span>
                {userRole === "admin"
                  ? "Administrator"
                  : "Teacher"}
              </span>
            </div>

            <ChevronDown
              size={17}
              className={
                profileOpen
                  ? "profile-chevron-open"
                  : ""
              }
            />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">

              <div className="profile-dropdown-user">
                <User size={17} />

                <div>
                  <strong>{userName}</strong>

                  <span>
                    {user?.email ||
                      "admin@schoolnova.com"}
                  </span>
                </div>
              </div>

              <div className="profile-dropdown-divider"></div>

              <button
                className="logout-btn"
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={17} />

                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;