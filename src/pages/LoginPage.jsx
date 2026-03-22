import { useState } from "react";
import { login } from "../api";
import { authStyles } from "../authStyles";

export default function LoginPage() {
  const [role, setRole] = useState("temple");
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login submitted!", role);
    try {
      await login(role, form.identifier, form.password);
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <style>{authStyles}</style>

      <div className="auth-blob ab1" />
      <div className="auth-blob ab2" />

      <div className="auth-page">
        <nav className="auth-nav">
          <a href="/" className="auth-logo">Flora<em>Cycle</em></a>
          <a href="/register" className="auth-nav-link">Register</a>
        </nav>

        <div className="auth-body">
          <div className="auth-card auth-card-sm">

            <h1 className="auth-title">Sign In</h1>
            <p className="auth-sub">Welcome back! Select your account type to continue.</p>

            {/* ── Role Toggle ── */}
            <div className="role-toggle">
              <div className={`role-slider ${role === "vendor" ? "vendor" : ""}`} />
              <button
                type="button"
                className={`role-btn ${role === "temple" ? "active" : ""}`}
                onClick={() => setRole("temple")}
              >
                🛕 Temple
              </button>
              <button
                type="button"
                className={`role-btn ${role === "vendor" ? "active" : ""}`}
                onClick={() => setRole("vendor")}
              >
                ♻️ Vendor
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="field">
                <label>Email / Phone Number</label>
                <input
                  name="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={handle}
                  placeholder="Enter your email or phone"
                  required
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handle}
                  placeholder="Your password"
                  required
                />
              </div>

              <div className="forgot-row">
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              <button type="button" onClick={handleSubmit} className="auth-submit">
                Sign In →
              </button>

            </form>

            <p className="auth-footer">
              Don't have an account? <a href="/register">Create one here</a>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}