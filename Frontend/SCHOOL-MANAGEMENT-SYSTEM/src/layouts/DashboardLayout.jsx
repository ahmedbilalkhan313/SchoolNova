import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/DashboardLayout.css";

function DashboardLayout({
  children,
  activePage,
  setActivePage,
  schoolName,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">

      {/* SIDEBAR */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        schoolName={schoolName}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN AREA */}

      <div className="main-area">

        {/* TOP NAVBAR */}

        <Navbar
          schoolName={schoolName}
          onMenuClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        />

        {/* PAGE CONTENT */}

        <main className="page-content">
          <div className="page-content-inner">
            {children}
          </div>
        </main>

      </div>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
}

export default DashboardLayout;