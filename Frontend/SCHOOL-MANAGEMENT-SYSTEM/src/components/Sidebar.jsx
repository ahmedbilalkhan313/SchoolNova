import {
  LayoutDashboard,
  Users,
  UserRound,
  School,
  CalendarCheck,
  Wallet,
  Settings,
  GraduationCap,
  MessageSquare
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Students", icon: Users },
  { name: "Teachers", icon: UserRound },
  { name: "Classes", icon: School },
  { name: "Attendance", icon: CalendarCheck },
  { name: "Fees", icon: Wallet },
  { name: "Feedback", icon: MessageSquare },
  { name: "Settings", icon: Settings },
];

function Sidebar({ activePage, setActivePage, schoolName }) {
  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="brand">
        <div className="brand-logo">
          <GraduationCap size={28} />
        </div>

        <div>
          <h2>{schoolName}</h2>
          <p>School Portal</p>
        </div>
      </div>

      {/* Main Menu */}
      <div className="menu-heading">
        MAIN MENU
      </div>

      <nav className="sidebar-menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}

      </nav>

      {/* School Footer */}
      <div className="sidebar-bottom">

        <div className="school-footer">
          <p>{schoolName}</p>
          <small>School Management</small>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;