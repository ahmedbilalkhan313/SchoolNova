import "../styles/Dashboard.css";

import {
  Users,
  UserRound,
  School,
  CalendarCheck,
  TrendingUp,
  Wallet,
  Activity,
} from "lucide-react";

function MiniLineChart({ data }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;

      const y =
        32 -
        ((value - minValue) / (maxValue - minValue || 1)) * 24;

      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,38 ${points} 100,38`;

  const lastPoint = points
    .split(" ")
    .at(-1)
    .split(",");

  return (
    <svg
      className="mini-line-chart"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
    >
      <polygon
        points={areaPoints}
        fill="currentColor"
        opacity="0.12"
      />

      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="2.5"
        fill="currentColor"
      />
    </svg>
  );
}

function Dashboard({
  students,
  teachers,
  classes,
  attendance,
  fees,
}) {
  /* =================================
     MAIN CALCULATIONS
  ================================= */

  const totalStudents = students.length;

  const totalTeachers = teachers.length;

  const totalClasses = classes.length;

  const totalAttendance = attendance.length;

  const presentStudents = attendance.filter(
    (student) => student.status === "Present"
  ).length;

  const attendancePercentage =
    totalAttendance === 0
      ? 0
      : (presentStudents / totalAttendance) * 100;

  const totalCollected = fees
    .filter((fee) => fee.status === "Paid")
    .reduce(
      (total, fee) =>
        total + Number(fee.amount || 0),
      0
    );

  /* =================================
     STAT CARDS
  ================================= */

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      change: "+12.5%",
      icon: Users,
      color: "blue",
      chart: [
        20,
        35,
        28,
        45,
        40,
        65,
        78,
        totalStudents || 1,
      ],
    },

    {
      title: "Total Teachers",
      value: totalTeachers.toLocaleString(),
      change: "+8.2%",
      icon: UserRound,
      color: "purple",
      chart: [
        25,
        40,
        35,
        55,
        48,
        70,
        82,
        totalTeachers || 1,
      ],
    },

    {
      title: "Total Classes",
      value: totalClasses.toLocaleString(),
      change: "+4.5%",
      icon: School,
      color: "orange",
      chart: [
        20,
        30,
        25,
        40,
        35,
        50,
        58,
        totalClasses || 1,
      ],
    },

    {
      title: "Attendance",
      value: `${attendancePercentage.toFixed(1)}%`,
      change: "+2.4%",
      icon: CalendarCheck,
      color: "green",
      chart: [
        70,
        65,
        78,
        72,
        85,
        88,
        95,
        attendancePercentage || 1,
      ],
    },
  ];

  /* =================================
     SCHOOL CAPACITY
  ================================= */

  const capacity = 1500;

  const capacityPercentage = Math.min(
    (totalStudents / capacity) * 100,
    100
  );

  /* =================================
     FEES PERCENTAGE
  ================================= */

  const feesPercentage =
    fees.length > 0
      ? Math.round(
          (fees.filter(
            (fee) => fee.status === "Paid"
          ).length /
            fees.length) *
            100
        )
      : 0;

  return (
    <div className="dashboard">

      {/* =================================
          DASHBOARD HEADER
      ================================= */}

      <div className="dashboard-header">

        <div className="dashboard-heading-area">

          <span className="dashboard-kicker">
            SCHOOL MANAGEMENT
          </span>

          <h1>Dashboard</h1>

          <p>
            Here's what's happening in your school today.
          </p>

        </div>

        <div className="dashboard-status">
          <span className="status-dot" />
          <span>System Active</span>
        </div>

      </div>


      {/* =================================
          STAT CARDS
      ================================= */}

      <div className="stats-grid">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className={`stat-card ${stat.color}`}
              key={stat.title}
            >

              {/* CARD TOP */}

              <div className="stat-top">

                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <span className="stat-change">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>

              </div>


              {/* CARD CONTENT */}

              <div className="stat-content">

                <span>{stat.title}</span>

                <strong>{stat.value}</strong>

              </div>


              {/* LINE CHART */}

              <div className="stat-chart">
                <MiniLineChart data={stat.chart} />
              </div>


              {/* CARD BOTTOM */}

              <div className="stat-bottom">

                <TrendingUp size={12} />

                <span>From last month</span>

              </div>

            </div>
          );
        })}

      </div>


      {/* =================================
          DASHBOARD PANELS
      ================================= */}

      <div className="dashboard-grid">


        {/* =================================
            WELCOME PANEL
        ================================= */}

        <div className="panel welcome-panel">

          <div className="welcome-content">

            <span className="panel-kicker">
              SCHOOL OVERVIEW
            </span>

            <h2>Welcome to SchoolNova</h2>

            <p>
              Manage your school, students, teachers,
              classes, attendance and fees from one
              simple dashboard.
            </p>


            <div className="quick-info">

              <div>
                <strong>6</strong>
                <span>Modules</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Access</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Organized</span>
              </div>

            </div>

          </div>


          <div className="welcome-glow">

            <div className="glow-ring glow-ring-one" />

            <div className="glow-ring glow-ring-two" />

            <div className="glow-orb">
              <School size={34} />
            </div>

          </div>

        </div>


        {/* =================================
            ATTENDANCE
        ================================= */}

        <div className="panel">

          <div className="panel-heading">

            <div>

              <span className="panel-kicker">
                TODAY
              </span>

              <h3>Attendance</h3>

              <p>Students present today</p>

            </div>

            <div className="panel-icon green">
              <CalendarCheck size={19} />
            </div>

          </div>


          <div className="metric-row">

            <strong>
              {attendancePercentage.toFixed(1)}%
            </strong>

            <span className="metric-badge green-badge">
              Present
            </span>

          </div>


          <div className="progress-track dashboard-attendance-track">

            <div
              className="dashboard-attendance-progress"
              style={{
                width: `${attendancePercentage}%`,
              }}
            />

          </div>


          <div className="progress-labels">

            <span>Present Students</span>

            <strong>
              {presentStudents}/{totalAttendance}
            </strong>

          </div>

        </div>


        {/* =================================
            FEES
        ================================= */}

        <div className="panel">

          <div className="panel-heading">

            <div>

              <span className="panel-kicker">
                FINANCE
              </span>

              <h3>Fees Collection</h3>

              <p>Total paid fees</p>

            </div>

            <div className="panel-icon purple">
              <Wallet size={19} />
            </div>

          </div>


          <div className="metric-row">

            <strong>
              Rs. {totalCollected.toLocaleString()}
            </strong>

            <span className="metric-badge purple-badge">
              Paid
            </span>

          </div>


          <div className="progress-track">

            <div
              className="progress-fill fees-progress"
              style={{
                width: `${feesPercentage}%`,
              }}
            />

          </div>


          <div className="progress-labels">

            <span>Collection Progress</span>

            <strong>
              {feesPercentage}%
            </strong>

          </div>

        </div>


        {/* =================================
            STUDENT GROWTH
        ================================= */}

        <div className="panel growth-panel">

          <div className="panel-heading">

            <div>

              <span className="panel-kicker">
                ANALYTICS
              </span>

              <h3>Students Growth</h3>

              <p>Student registration trend</p>

            </div>

            <div className="panel-icon blue">
              <TrendingUp size={19} />
            </div>

          </div>


          <div className="growth-top">

            <strong>+18.5%</strong>

            <span>Increasing</span>

          </div>


          <div className="growth-chart">

            <MiniLineChart
              data={[
                25,
                35,
                30,
                50,
                45,
                70,
                90,
              ]}
            />

          </div>


          <div className="progress-labels">

            <span>Last 7 months</span>

            <strong>Growth</strong>

          </div>

        </div>


        {/* =================================
            SCHOOL CAPACITY
        ================================= */}

        <div className="panel">

          <div className="panel-heading">

            <div>

              <span className="panel-kicker">
                ENROLLMENT
              </span>

              <h3>School Capacity</h3>

              <p>Current school strength</p>

            </div>

            <div className="panel-icon orange">
              <School size={19} />
            </div>

          </div>


          <div className="capacity-value">
            {totalStudents.toLocaleString()}
          </div>


          <div className="capacity-description">
            Students enrolled out of{" "}
            {capacity.toLocaleString()}
          </div>


          <div className="progress-track">

            <div
              className="progress-fill capacity-progress"
              style={{
                width: `${capacityPercentage}%`,
              }}
            />

          </div>


          <div className="progress-labels">

            <span>Current Capacity</span>

            <strong>
              {capacityPercentage.toFixed(1)}%
            </strong>

          </div>

        </div>


        {/* =================================
            RECENT ACTIVITY
        ================================= */}

        <div className="panel activity-panel">

          <div className="panel-heading">

            <div>

              <span className="panel-kicker">
                RECENT
              </span>

              <h3>School Activity</h3>

              <p>Latest dashboard updates</p>

            </div>

            <div className="panel-icon cyan">
              <Activity size={19} />
            </div>

          </div>


          <div className="activity-list">

            <div className="activity-item">

              <div className="activity-dot blue-dot" />

              <div>

                <strong>
                  Student records updated
                </strong>

                <span>
                  Student management activity
                </span>

              </div>

            </div>


            <div className="activity-item">

              <div className="activity-dot green-dot" />

              <div>

                <strong>
                  Attendance recorded
                </strong>

                <span>
                  Today's attendance updated
                </span>

              </div>

            </div>


            <div className="activity-item">

              <div className="activity-dot purple-dot" />

              <div>

                <strong>
                  Fee collection updated
                </strong>

                <span>
                  Payment records synchronized
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;