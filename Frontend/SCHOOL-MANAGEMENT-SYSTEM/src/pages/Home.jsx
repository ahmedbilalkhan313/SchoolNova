import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  Menu,
  MonitorCheck,
  School,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";

import "../styles/Home.css";

function Home({ onLogin, onFeatureClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCampusSlide, setCurrentCampusSlide] = useState(0);
  const [hoveredCampus, setHoveredCampus] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=85",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=85",
    },
    {
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1800&q=85",
    },
    {
      image:
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1800&q=85",
    },
  ];

  const campusImages = [
    {
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=85",
      title: "Modern School Campus",
      type: "School",
      description:
        "A professional campus environment for organized school management.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=85",
      title: "University Building",
      type: "College",
      description:
        "Manage large academic institutions with connected digital tools.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1000&q=85",
      title: "Learning Environment",
      type: "School",
      description:
        "Keep students, teachers and academic records organized.",
    },
    
     {
  image:
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=85",
  title: "Higher Education Campus",
  type: "College",
  description:
    "Support growing institutions with simple and powerful management.",
},
    {
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=85",
      title: "Smart Classroom",
      type: "School",
      description:
        "Bring classroom activities and student information into one place.",
    },
  ];

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === heroSlides.length - 1 ? 0 : previousSlide + 1
      );
    }, 5000);

    return () => clearInterval(slider);
  }, [heroSlides.length]);

  useEffect(() => {
    const campusSlider = setInterval(() => {
      setCurrentCampusSlide((previousSlide) =>
        previousSlide === campusImages.length - 1 ? 0 : previousSlide + 1
      );
    }, 4500);

    return () => clearInterval(campusSlider);
  }, [campusImages.length]);

  const goToNextSlide = () => {
    setCurrentSlide((previousSlide) =>
      previousSlide === heroSlides.length - 1 ? 0 : previousSlide + 1
    );
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((previousSlide) =>
      previousSlide === 0 ? heroSlides.length - 1 : previousSlide - 1
    );
  };

  const goToNextCampusSlide = () => {
    setCurrentCampusSlide((previousSlide) =>
      previousSlide === campusImages.length - 1 ? 0 : previousSlide + 1
    );
  };

  const goToPreviousCampusSlide = () => {
    setCurrentCampusSlide((previousSlide) =>
      previousSlide === 0 ? campusImages.length - 1 : previousSlide - 1
    );
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const features = [
    {
      icon: Users,
      title: "Student Management",
      target: "Students",
      description:
        "Manage student profiles, classes, contact information and academic records from one organized system.",
    },
    {
      icon: UserCheck,
      title: "Teacher Management",
      target: "Teachers",
      description:
        "Keep faculty information organized and make teacher management simple, clear and efficient.",
    },
    {
      icon: BookOpen,
      title: "Classes & Subjects",
      target: "Classes",
      description:
        "Create classes, assign teachers and organize subjects without complicated paperwork.",
    },
    {
      icon: CalendarCheck,
      title: "Attendance Tracking",
      target: "Attendance",
      description:
        "Record daily attendance quickly and keep student attendance information easily accessible.",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      target: "Dashboard",
      description:
        "Turn school data into useful insights with clear statistics and visual dashboard reports.",
    },
    {
      icon: ShieldCheck,
      title: "Secure School Records",
      target: "Settings",
      description:
        "Keep important school information organized with a centralized and secure management system.",
    },
  ];

  const academicLevels = [
    {
      number: "01",
      icon: School,
      title: "Primary",
      description:
        "Build a strong foundation with organized student and academic management.",
    },
    {
      number: "02",
      icon: BookOpen,
      title: "Middle",
      description:
        "Manage growing classes, subjects, teachers and student records efficiently.",
    },
    {
      number: "03",
      icon: GraduationCap,
      title: "Secondary",
      description:
        "Keep academic activities, attendance and student information connected.",
    },
    {
      number: "04",
      icon: Building2,
      title: "Higher Secondary",
      description:
        "Bring advanced school administration into one professional platform.",
    },
  ];

  return (
    <div className="home-page">
      {/* ================= NAVBAR ================= */}

      <header className="home-navbar">
        <div className="home-navbar-inner">
          <button
            className="home-brand"
            onClick={() => scrollToSection("home")}
            type="button"
          >
            <span className="home-brand-icon">
              <GraduationCap size={22} strokeWidth={2.3} />
            </span>

            <span className="home-brand-text">
              <strong>SchoolNova</strong>
              <small>School Management</small>
            </span>
          </button>

          <nav className="home-nav-links">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="active"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>

            <button type="button" onClick={() => scrollToSection("about")}>
              About
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("academic")}
            >
              Academics
            </button>

            <button
              type="button"
              className="navbar-login-btn"
              onClick={onLogin}
            >
              Login
              <ArrowUpRight size={16} />
            </button>
          </nav>

          <button
            className="mobile-menu-button"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-navigation">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
            >
              About
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("academic")}
            >
              Academics
            </button>

            <button
              type="button"
              className="mobile-login-button"
              onClick={onLogin}
            >
              Login
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}

      <section
        className="home-hero"
        id="home"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(13, 7, 38, 0.97) 0%, rgba(25, 10, 55, 0.91) 42%, rgba(31, 12, 65, 0.55) 100%), url(${heroSlides[currentSlide].image})`,
        }}
      >
        <div className="hero-overlay" />

        <div className="home-container hero-container">
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={15} />
              <span>MODERN SCHOOL MANAGEMENT</span>
            </div>

            <h1>
              Make School Management{" "}
              <span className="hero-gradient-word">Simpler</span>.
            </h1>

            <p>
              Manage students, teachers, classes, attendance and fees from one
              powerful platform designed to make school administration easier.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="hero-primary-button"
                onClick={onLogin}
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="hero-secondary-button"
                onClick={() => scrollToSection("features")}
              >
                Explore Features
                <ArrowUpRight size={17} />
              </button>
            </div>

            {/* TRUST BADGES */}

            <div className="hero-trust">
              <div className="trust-avatars">
                <span>SN</span>
                <span>ED</span>
                <span>SM</span>
                <span>+</span>
              </div>

              <div className="trust-content">
                <div className="trust-title">
                  Trusted by <strong>50+ Schools</strong>
                </div>

                <div className="trust-subtitle">
                  Helping schools simplify everyday administration
                </div>
              </div>
            </div>
          </div>

          {/* ================= DASHBOARD PREVIEW ================= */}

          <div className="hero-dashboard-wrapper">
            <div className="dashboard-glow" />

            <div className="hero-dashboard">
              <div className="dashboard-preview-top">
                <div>
                  <span className="preview-small-title">
                    SCHOOL OVERVIEW
                  </span>

                  <h3>Dashboard</h3>
                </div>

                <div className="preview-profile">
                  <div className="preview-profile-dot" />
                  <span>Admin</span>
                </div>
              </div>

              <div className="preview-stat-grid">
                <div className="preview-stat-card">
                  <div className="preview-stat-icon student-icon">
                    <Users size={17} />
                  </div>

                  <div>
                    <span>Total Students</span>
                    <strong>1,248</strong>
                  </div>

                  <small className="positive-change">+12.5%</small>
                </div>

                <div className="preview-stat-card">
                  <div className="preview-stat-icon teacher-icon">
                    <UserCheck size={17} />
                  </div>

                  <div>
                    <span>Teachers</span>
                    <strong>86</strong>
                  </div>

                  <small className="positive-change">+8.2%</small>
                </div>

                <div className="preview-stat-card">
                  <div className="preview-stat-icon class-icon">
                    <BookOpen size={17} />
                  </div>

                  <div>
                    <span>Classes</span>
                    <strong>32</strong>
                  </div>

                  <small className="positive-change">+4.5%</small>
                </div>

                <div className="preview-stat-card">
                  <div className="preview-stat-icon attendance-icon">
                    <ClipboardCheck size={17} />
                  </div>

                  <div>
                    <span>Attendance</span>
                    <strong>94.8%</strong>
                  </div>

                  <small className="positive-change">+2.4%</small>
                </div>
              </div>

              <div className="preview-main-area">
                <div className="preview-chart-card">
                  <div className="preview-card-heading">
                    <div>
                      <span>Student Overview</span>
                      <strong>1,248 Students</strong>
                    </div>

                    <button type="button">This Year</button>
                  </div>

                  <div className="preview-chart">
                    <div className="chart-lines">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <svg
                      viewBox="0 0 420 130"
                      preserveAspectRatio="none"
                      className="dashboard-line-chart"
                    >
                      <defs>
                        <linearGradient
                          id="dashboardAreaGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#A855F7"
                            stopOpacity="0.30"
                          />

                          <stop
                            offset="100%"
                            stopColor="#C084FC"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0,105 C35,90 55,98 80,82 C110,62 130,75 155,68 C185,59 205,72 230,52 C260,28 278,48 305,39 C330,31 350,43 372,25 C392,10 405,20 420,12 L420,130 L0,130 Z"
                        fill="url(#dashboardAreaGradient)"
                      />

                      <path
                        d="M0,105 C35,90 55,98 80,82 C110,62 130,75 155,68 C185,59 205,72 230,52 C260,28 278,48 305,39 C330,31 350,43 372,25 C392,10 405,20 420,12"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="420"
                        cy="12"
                        r="5"
                        fill="#C084FC"
                      />
                    </svg>

                    <div className="chart-months">
                      <span>Jan</span>
                      <span>Mar</span>
                      <span>May</span>
                      <span>Jul</span>
                      <span>Sep</span>
                      <span>Nov</span>
                    </div>
                  </div>
                </div>

                <div className="preview-attendance-card">
                  <div className="preview-card-heading">
                    <div>
                      <span>Attendance</span>
                      <strong>94.8%</strong>
                    </div>

                    <ClipboardCheck size={18} />
                  </div>

                  <div className="attendance-progress">
                    <div
                      className="attendance-progress-value"
                      style={{ width: "94.8%" }}
                    />
                  </div>

                  <div className="attendance-footer">
                    <span>Present</span>
                    <strong>1,183</strong>
                  </div>

                  <div className="attendance-footer muted">
                    <span>Absent</span>
                    <strong>65</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING CARDS */}

            <div className="floating-dashboard-card floating-card-one">
              <div className="floating-card-icon">
                <CalendarCheck size={16} />
              </div>

              <div>
                <span>Today's Attendance</span>
                <strong>94.8%</strong>
              </div>
            </div>

            <div className="floating-dashboard-card floating-card-two">
              <div className="floating-check">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <span>School Status</span>
                <strong>All Systems Active</strong>
              </div>
            </div>
          </div>
        </div>

        {/* HERO SLIDER CONTROLS */}

        <div className="hero-slider-controls">
          <button
            type="button"
            className="hero-arrow"
            onClick={goToPreviousSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="hero-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={currentSlide === index ? "active" : ""}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="hero-arrow"
            onClick={goToNextSlide}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="hero-bottom-fade" />
      </section>

      {/* ================= STATS ================= */}

      <section className="home-stats-section">
        <div className="home-container">
          <div className="home-stats-grid">
            <div className="home-stat-item">
              <strong>1,248+</strong>
              <span>Active Students</span>
            </div>

            <div className="home-stat-item">
              <strong>86+</strong>
              <span>Faculty Members</span>
            </div>

            <div className="home-stat-item">
              <strong>32+</strong>
              <span>Classes & Sections</span>
            </div>

            <div className="home-stat-item">
              <strong>94.8%</strong>
              <span>Attendance Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SCHOOL AND COLLEGE GALLERY ================= */}

      <section className="campus-gallery-section" id="campuses">
        <div className="home-container">
          <div className="section-heading section-heading-dark">
            <span className="section-eyebrow section-eyebrow-dark">
              <School size={15} />
              SCHOOLS & COLLEGES
            </span>

            <h2>
              Built for every kind of{" "}
              <span>learning environment.</span>
            </h2>

            <p>
              From schools to colleges, SchoolNova helps institutions manage
              their everyday academic activities with confidence.
            </p>
          </div>

          <div className="campus-gallery">
            {campusImages.map((campus, index) => (
              <div
                className={`campus-card ${
                  currentCampusSlide === index ? "campus-card-active" : ""
                } ${
                  hoveredCampus === index ? "campus-card-hovered" : ""
                }`}
                key={campus.title}
                onMouseEnter={() => setHoveredCampus(index)}
                onMouseLeave={() => setHoveredCampus(null)}
              >
                <img src={campus.image} alt={campus.title} />

                <div className="campus-card-overlay" />

                <div className="campus-card-content">
                  <span>{campus.type}</span>
                  <h3>{campus.title}</h3>
                  <p>{campus.description}</p>
                </div>

              </div>
            ))}
          </div>

          <div className="campus-gallery-controls">
            <button
              type="button"
              className="campus-arrow"
              onClick={goToPreviousCampusSlide}
              aria-label="Previous campus image"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="campus-dots">
              {campusImages.map((campus, index) => (
                <button
                  key={campus.title}
                  type="button"
                  className={
                    currentCampusSlide === index ? "active" : ""
                  }
                  onClick={() => setCurrentCampusSlide(index)}
                  aria-label={`Show campus ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="campus-arrow"
              onClick={goToNextCampusSlide}
              aria-label="Next campus image"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="home-features-section" id="features">
        <div className="home-container">
          <div className="section-heading section-heading-light">
            <span className="section-eyebrow">
              <Sparkles size={14} />
              POWERFUL FEATURES
            </span>

            <h2>
              Everything your school needs,
              <span> in one place.</span>
            </h2>

            <p>
              SchoolNova brings the most important school-management tools
              together in one simple and professional platform.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  className="feature-card feature-card-clickable"
                  key={feature.title}
                  onClick={() => onFeatureClick(feature.target)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onFeatureClick(feature.target);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <div className="feature-card-top">
                    <div className="feature-icon">
                      <Icon size={22} />
                    </div>

                    <span className="feature-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section className="home-about-section" id="about">
        <div className="home-container about-container">
          <div className="about-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85"
              alt="Students learning in a modern classroom"
            />

            <div className="about-image-badge">
              <div className="about-badge-icon">
                <MonitorCheck size={20} />
              </div>

              <div>
                <strong>One Smart Platform</strong>
                <span>Built for modern schools</span>
              </div>
            </div>
          </div>

          <div className="about-content">
            <span className="section-eyebrow section-eyebrow-dark">
              <Sparkles size={14} />
              ABOUT SCHOOLNOVA
            </span>

            <h2>
              Less paperwork.
              <br />
              <span>More progress.</span>
            </h2>

            <p>
              SchoolNova is designed to simplify everyday school
              administration by bringing students, teachers, classes,
              attendance, fees and reports together in one organized
              platform.
            </p>

            <p>
              Instead of managing information across scattered files and
              manual records, schools can keep their important data connected
              and easy to access.
            </p>

            <div className="about-check-list">
              <div>
                <CheckCircle2 size={19} />
                <span>Simple and organized school management</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Clear dashboards and useful statistics</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Centralized student and teacher records</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Designed for schools of different sizes</span>
              </div>
            </div>

            <button
              type="button"
              className="about-button"
              onClick={onLogin}
            >
              Explore SchoolNova
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= ACADEMICS ================= */}

      <section className="home-academic-section" id="academic">
        <div className="home-container">
          <div className="section-heading section-heading-dark">
            <span className="section-eyebrow section-eyebrow-dark">
              <GraduationCap size={15} />
              ACADEMIC LEVELS
            </span>

            <h2>
              Designed for every stage
              <span> of learning.</span>
            </h2>

            <p>
              Flexible school management for institutions serving students
              across different academic levels.
            </p>
          </div>

          <div className="academic-grid">
            {academicLevels.map((level) => {
              const Icon = level.icon;

              return (
                <div className="academic-card" key={level.title}>
                  <div className="academic-card-number">
                    {level.number}
                  </div>

                  <div className="academic-card-icon">
                    <Icon size={23} />
                  </div>

                  <h3>{level.title}</h3>

                  <p>{level.description}</p>

                  <div className="academic-card-line" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="home-cta-section" id="contact">
        <div className="home-container">
          <div className="cta-content">
            <div className="cta-icon">
              <GraduationCap size={26} />
            </div>

            <span className="section-eyebrow cta-eyebrow">
              READY TO GET STARTED?
            </span>

            <h2>
              Make your school
              <br />
              <span>simpler to manage.</span>
            </h2>

            <p>
              Bring your school's everyday management into one modern,
              organized platform.
            </p>

            <div className="cta-buttons">
              <button
                type="button"
                className="cta-primary-button"
                onClick={onLogin}
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="cta-outline-button"
                onClick={() => scrollToSection("features")}
              >
                View Features
                <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="home-footer">
        <div className="home-container">
          <div className="footer-main">
            <div className="footer-brand-area">
              <button
                type="button"
                className="home-brand footer-brand"
                onClick={() => scrollToSection("home")}
              >
                <span className="home-brand-icon">
                  <GraduationCap size={22} />
                </span>

                <span className="home-brand-text">
                  <strong>SchoolNova</strong>
                  <small>School Management</small>
                </span>
              </button>

              <p>
                A modern school management platform designed to simplify
                administration and connect your school's everyday operations.
              </p>
            </div>

            <div className="footer-column">
              <h4>Platform</h4>

              <button
                type="button"
                onClick={() => scrollToSection("features")}
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("academic")}
              >
                Academics
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("about")}
              >
                About
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("campuses")}
              >
                Schools & Colleges
              </button>
            </div>

            <div className="footer-column">
              <h4>Management</h4>

              <button type="button">Students</button>
              <button type="button">Teachers</button>
              <button type="button">Attendance</button>
              <button type="button">Fees</button>
            </div>

            <div className="footer-column">
              <h4>Get Started</h4>

              <button type="button" onClick={onLogin}>
                Login
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("features")}
              >
                Explore Features
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} SchoolNova. All rights reserved.
            </span>

            <span>Modern School Management System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;