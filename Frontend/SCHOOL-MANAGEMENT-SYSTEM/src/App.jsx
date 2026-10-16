import { useEffect, useState } from "react";
import {
  BrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Feedback from "./pages/Feedback";
import SchoolSettings from "./pages/SchoolSettings";

function AppContent() {
  // =====================================================
  // ROUTER
  // =====================================================

  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  // =====================================================
  // PAGE STATE
  // =====================================================

  const [activePage, setActivePage] = useState("Dashboard");

  const [showHome, setShowHome] = useState(
    location.pathname === "/"
  );

  // Page selected from a Home feature card before login.
  const [loginTargetPage, setLoginTargetPage] = useState("Dashboard");

  // =====================================================
  // STUDENTS
  // =====================================================

  const [students, setStudents] = useState([]);

  // =====================================================
  // TEACHERS
  // =====================================================

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Sarah Ahmed",
      email: "sarah@gmail.com",
      subject: "Mathematics",
      className: "10th",
      status: "Active",
    },
    {
      id: 2,
      name: "Usman Khan",
      email: "usman@gmail.com",
      subject: "English",
      className: "9th",
      status: "Active",
    },
    {
      id: 3,
      name: "Ayesha Malik",
      email: "ayesha@gmail.com",
      subject: "Science",
      className: "8th",
      status: "Inactive",
    },
  ]);

  // =====================================================
  // CLASSES
  // =====================================================

  const [classes, setClasses] = useState([
    {
      id: 1,
      className: "10th Grade",
      teacher: "Sarah Ahmed",
      students: 32,
      room: "Room 101",
      status: "Active",
    },
    {
      id: 2,
      className: "9th Grade",
      teacher: "Usman Khan",
      students: 28,
      room: "Room 102",
      status: "Active",
    },
    {
      id: 3,
      className: "8th Grade",
      teacher: "Ayesha Malik",
      students: 30,
      room: "Room 103",
      status: "Active",
    },
  ]);

  // =====================================================
  // ATTENDANCE
  // =====================================================

  const [attendance, setAttendance] = useState([]);

  // =====================================================
  // FEES
  // =====================================================

  const [fees, setFees] = useState([
    {
      id: 1,
      name: "Ahmed Bilal",
      className: "10th",
      amount: "5000",
      status: "Paid",
    },
    {
      id: 2,
      name: "Ali Raza",
      className: "9th",
      amount: "5000",
      status: "Paid",
    },
    {
      id: 3,
      name: "Hassan Khan",
      className: "8th",
      amount: "4500",
      status: "Unpaid",
    },
  ]);

  // =====================================================
  // SCHOOL NAME
  // =====================================================

  const savedSchoolName =
    localStorage.getItem("schoolName") || "SchoolNova";

  // =====================================================
  // URL INFORMATION
  // =====================================================

  const currentPath = location.pathname;

  const isHomePage = currentPath === "/";

  const isLoginPage = currentPath === "/login";

  const isStudentPage = currentPath === "/students";

  const isStudentDetailPage =
    currentPath.startsWith("/students/") &&
    currentPath !== "/students";

  const isDashboardPage =
    currentPath === "/dashboard";

  // =====================================================
  // KEEP ACTIVE PAGE IN SYNC WITH URL
  // =====================================================

  useEffect(() => {
    if (currentPath === "/dashboard") {
      setActivePage("Dashboard");
    }

    if (
      currentPath === "/students" ||
      isStudentDetailPage
    ) {
      setActivePage("Students");
    }

    if (currentPath === "/teachers") {
      setActivePage("Teachers");
    }

    if (currentPath === "/classes") {
      setActivePage("Classes");
    }

    if (currentPath === "/attendance") {
      setActivePage("Attendance");
    }

    if (currentPath === "/fees") {
      setActivePage("Fees");
    }

    if (currentPath === "/feedback") {
      setActivePage("Feedback");
    }

    if (currentPath === "/settings") {
      setActivePage("Settings");
    }
  }, [currentPath, isStudentDetailPage]);

  // =====================================================
  // HOME / LOGIN STATE
  // =====================================================

  useEffect(() => {
    if (currentPath === "/") {
      setShowHome(true);
    }

    if (currentPath === "/login") {
      setShowHome(false);
    }
  }, [currentPath]);

  // =====================================================
  // ATTENDANCE AUTOMATICALLY SYNCS WITH STUDENTS
  // =====================================================

  useEffect(() => {
    setAttendance((previousAttendance) => {
      return students.map((student) => {
        const existingStudent = previousAttendance.find(
          (item) =>
            item.id === student._id ||
            item.id === student.id
        );

        return {
          id: student._id || student.id,
          name: student.name,
          className: student.className,
          status: existingStudent
            ? existingStudent.status
            : "Present",
        };
      });
    });
  }, [students]);

  // =====================================================
  // HOME → LOGIN
  // =====================================================

const handleOpenLogin = (targetPage) => {
  const page =
    typeof targetPage === "string"
      ? targetPage
      : "Dashboard";

  setLoginTargetPage(page);
  setShowHome(false);
  navigate("/login");
};

  // =====================================================
  // LOGIN SUCCESS
  // =====================================================

  const handleLogin = () => {
    /*
      Login.jsx already saves:
      token
      user

      After login, open the page selected from
      the Home page feature card.
    */

    setIsLoggedIn(true);
    setShowHome(false);
    setActivePage(loginTargetPage);

    const pageRoutes = {
      Dashboard: "/dashboard",
      Students: "/students",
      Teachers: "/teachers",
      Classes: "/classes",
      Attendance: "/attendance",
      Fees: "/fees",
      Feedback: "/feedback",
      Settings: "/settings",
    };

    navigate(pageRoutes[loginTargetPage] || "/dashboard");
  };

  // =====================================================
  // HOME FEATURE NAVIGATION
  // =====================================================

  const handleFeatureNavigation = (page) => {
    if (isLoggedIn) {
      handlePageChange(page);
      return;
    }

    handleOpenLogin(page);
  };

  // =====================================================
  // PAGE NAVIGATION
  // =====================================================

  const handlePageChange = (page) => {
    setActivePage(page);
    setShowHome(false);

    switch (page) {
      case "Dashboard":
        navigate("/dashboard");
        break;

      case "Students":
        navigate("/students");
        break;

      case "Teachers":
        navigate("/teachers");
        break;

      case "Classes":
        navigate("/classes");
        break;

      case "Attendance":
        navigate("/attendance");
        break;

      case "Fees":
        navigate("/fees");
        break;

      case "Feedback":
        navigate("/feedback");
        break;

      case "Settings":
        navigate("/settings");
        break;

      default:
        navigate("/dashboard");
    }
  };

  // =====================================================
  // RENDER DASHBOARD PAGE
  // =====================================================

  const renderActivePage = () => {
    // ---------------------------------------------------
    // STUDENT DETAIL
    // ---------------------------------------------------

    if (isStudentDetailPage) {
      return <StudentDetail />;
    }

    // ---------------------------------------------------
    // DASHBOARD
    // ---------------------------------------------------

    if (activePage === "Dashboard") {
      return (
        <Dashboard
          students={students}
          teachers={teachers}
          classes={classes}
          attendance={attendance}
          fees={fees}
        />
      );
    }

    // ---------------------------------------------------
    // STUDENTS
    // ---------------------------------------------------

    if (activePage === "Students") {
      return (
        <Students
          students={students}
          setStudents={setStudents}
        />
      );
    }

    // ---------------------------------------------------
    // TEACHERS
    // ---------------------------------------------------

    if (activePage === "Teachers") {
      return (
        <Teachers
          teachers={teachers}
          setTeachers={setTeachers}
        />
      );
    }

    // ---------------------------------------------------
    // CLASSES
    // ---------------------------------------------------

    if (activePage === "Classes") {
      return (
        <Classes
          classes={classes}
          setClasses={setClasses}
        />
      );
    }

    // ---------------------------------------------------
    // ATTENDANCE
    // ---------------------------------------------------

    if (activePage === "Attendance") {
      return (
        <Attendance
          attendance={attendance}
          setAttendance={setAttendance}
        />
      );
    }

    // ---------------------------------------------------
    // FEES
    // ---------------------------------------------------

    if (activePage === "Fees") {
      return (
        <Fees
          fees={fees}
          setFees={setFees}
        />
      );
    }

    // ---------------------------------------------------
    // FEEDBACK
    // ---------------------------------------------------

    if (activePage === "Feedback") {
      return <Feedback />;
    }

    // ---------------------------------------------------
    // SETTINGS
    // ---------------------------------------------------

    if (activePage === "Settings") {
      return <SchoolSettings />;
    }

    // ---------------------------------------------------
    // FALLBACK
    // ---------------------------------------------------

    return (
      <div className="coming-page">
        <h2>{activePage}</h2>
        <p>This module is coming soon.</p>
      </div>
    );
  };

  // =====================================================
  // PUBLIC HOME PAGE
  // =====================================================

  /*
    "/" ہمیشہ Home Page دکھائے گا۔

    یہ اس لیے ہے تاکہ browser میں:
    
    http://localhost:5173/

    لکھنے پر Home Page آئے۔
  */

  if (isHomePage) {
    return (
      <PublicLayout>
        <Home
          onLogin={handleOpenLogin}
          onFeatureClick={handleFeatureNavigation}
        />
      </PublicLayout>
    );
  }

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  /*
    "/login" پر Login Page آئے گا۔
  */

  if (isLoginPage) {
    return (
      <PublicLayout>
        <Login setIsLoggedIn={handleLogin} />
      </PublicLayout>
    );
  }

  // =====================================================
  // PROTECTED PAGES
  // =====================================================

  /*
    اگر user logged in نہیں ہے اور کسی dashboard URL
    کو manually کھولتا ہے تو اسے Home پر بھیج دیں۔
  */

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  // =====================================================
  // DASHBOARD LAYOUT
  // =====================================================

  return (
    <DashboardLayout
      activePage={activePage}
      setActivePage={handlePageChange}
      schoolName={savedSchoolName}
    >
      {renderActivePage()}
    </DashboardLayout>
  );
}

// =======================================================
// MAIN APP
// =======================================================

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;