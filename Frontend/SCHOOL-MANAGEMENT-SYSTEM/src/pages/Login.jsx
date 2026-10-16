
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import "../styles/Login.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://school-nova-pied.vercel.app"
).replace(/\/+$/, "");

function Login({ setIsLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (signup) => {
    setIsSignup(signup);
    setError("");
    setNotice("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isSignup) {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      const endpoint = isSignup ? "register" : "login";

      const payload = isSignup
        ? { name: name.trim(), email: cleanEmail, password }
        : { email: cleanEmail, password };

      const response = await fetch(
        `${API_URL}/api/users/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Something went wrong.");
        return;
      }

      if (isSignup) {
        setNotice("Account created successfully. Please sign in.");
        setIsSignup(false);
        setPassword("");
        setConfirmPassword("");
        return;
      }

      if (!data.token || !data.user) {
        setError("The server returned an incomplete login response.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);
    } catch (err) {
      console.error("Authentication error:", err);
      setError(
        "Unable to connect to SchoolNova. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-visual-overlay" />

        <div className="login-visual-content">
          <div className="login-logo">
            <GraduationCap size={30} />
          </div>

          <span className="login-eyebrow">
            SCHOOL MANAGEMENT PLATFORM
          </span>

          <h1>
            Manage Your School.
            <span> Empower Your Future.</span>
          </h1>

          <p>
            SchoolNova brings students, teachers, classes, attendance
            and fees together in one organized digital workspace.
          </p>

          <div className="login-trust">
            <ShieldCheck size={19} />
            <span>Secure & organized school management</span>
          </div>
        </div>
      </div>

      <div className="login-form-area">
        <div className="login-form-card">
          <div className="login-mobile-logo">
            <div>
              <GraduationCap size={25} />
            </div>
            <span>SchoolNova</span>
          </div>

          <div className="login-heading">
            <span>
              {isSignup ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
            </span>

            <h2>
              {isSignup ? "Join SchoolNova" : "Sign in to your account"}
            </h2>

            <p>
              {isSignup
                ? "Create your account to get started."
                : "Enter your credentials to access SchoolNova."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <div className="login-field">
                <label htmlFor="signup-name">Full Name</label>

                <div className="login-input-wrapper">
                  <UserRound size={19} />

                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    maxLength={100}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email">Email Address</label>

              <div className="login-input-wrapper">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  maxLength={254}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <div className="login-input-wrapper">
                <LockKeyhole size={19} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  placeholder={
                    isSignup
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="login-field">
                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <div className="login-input-wrapper">
                  <LockKeyhole size={19} />

                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            {notice && (
              <div className="login-notice" role="status">
                {notice}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading
                ? isSignup
                  ? "Creating Account..."
                  : "Signing In..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}

              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="login-auth-switch">
            <span>
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={() => switchMode(!isSignup)}
              disabled={loading}
            >
              {isSignup ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="login-footer-text">
            <span>© 2026 SchoolNova</span>
            <span>School Management Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
