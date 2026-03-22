import { useState } from "react";
import { register } from "../api";
import { authStyles } from "../authStyles";

export default function RegisterPage() {
  const [role, setRole] = useState("temple");
  const [temple, setTemple] = useState({
    name: "", contact: "", phone: "", email: "",
    address: "", city: "", state: "", pin: "",
    type: "Large", waste: "", password: ""
  });
  const [vendor, setVendor] = useState({
    company: "", owner: "", phone: "", email: "",
    address: "", city: "", state: "", pin: "",
    capacity: "", password: ""
  });

  const ht = (e) => setTemple({ ...temple, [e.target.name]: e.target.value });
  const hv = (e) => setVendor({ ...vendor, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!", role);
    try {
      const data = role === "temple" ? temple : vendor;
      await register(role, data);
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
          <a href="/login" className="auth-nav-link">Sign In</a>
        </nav>

        <div className="auth-body">
          <div className="auth-card">

            <h1 className="auth-title">Create Account</h1>
            <p className="auth-sub">Fill in your details to get started.</p>

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

              {/* ── TEMPLE FORM ── */}
              {role === "temple" && (
                <>
                  <div className="form-row">
                    <div className="field">
                      <label>Temple Name</label>
                      <input name="name" value={temple.name} onChange={ht}
                        placeholder="Shri Siddhivinayak Temple" required />
                    </div>
                    <div className="field">
                      <label>Contact Person</label>
                      <input name="contact" value={temple.contact} onChange={ht}
                        placeholder="Full name" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label>Phone Number</label>
                      <input name="phone" type="tel" value={temple.phone} onChange={ht}
                        placeholder="+91 00000 00000" required />
                    </div>
                    <div className="field">
                      <label>Email ID</label>
                      <input name="email" type="email" value={temple.email} onChange={ht}
                        placeholder="temple@example.com" required />
                    </div>
                  </div>

                  <div className="field">
                    <label>Temple Address</label>
                    <input name="address" value={temple.address} onChange={ht}
                      placeholder="Street address" required />
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label>City</label>
                      <input name="city" value={temple.city} onChange={ht}
                        placeholder="Mumbai" required />
                    </div>
                    <div className="field">
                      <label>State</label>
                      <input name="state" value={temple.state} onChange={ht}
                        placeholder="Maharashtra" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label>PIN Code</label>
                      <input name="pin" value={temple.pin} onChange={ht}
                        placeholder="400001" required />
                    </div>
                    <div className="field">
                      <label>Temple Type</label>
                      <select name="type" value={temple.type} onChange={ht}>
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>Daily Flower Waste Estimate (kg)</label>
                    <input name="waste" type="number" value={temple.waste} onChange={ht}
                      placeholder="e.g. 10" required />
                  </div>

                  <div className="field">
                    <label>Password</label>
                    <input name="password" type="password" value={temple.password} onChange={ht}
                      placeholder="Create a strong password" required />
                  </div>
                </>
              )}

              {/* ── VENDOR FORM ── */}
              {role === "vendor" && (
                <>
                  <div className="form-row">
                    <div className="field">
                      <label>Company Name</label>
                      <input name="company" value={vendor.company} onChange={hv}
                        placeholder="EcoBloom Pvt. Ltd." required />
                    </div>
                    <div className="field">
                      <label>Owner Name</label>
                      <input name="owner" value={vendor.owner} onChange={hv}
                        placeholder="Full name" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label>Phone Number</label>
                      <input name="phone" type="tel" value={vendor.phone} onChange={hv}
                        placeholder="+91 00000 00000" required />
                    </div>
                    <div className="field">
                      <label>Email ID</label>
                      <input name="email" type="email" value={vendor.email} onChange={hv}
                        placeholder="vendor@example.com" required />
                    </div>
                  </div>

                  <div className="field">
                    <label>Company Address</label>
                    <input name="address" value={vendor.address} onChange={hv}
                      placeholder="Street address" required />
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label>City</label>
                      <input name="city" value={vendor.city} onChange={hv}
                        placeholder="Pune" required />
                    </div>
                    <div className="field">
                      <label>State</label>
                      <input name="state" value={vendor.state} onChange={hv}
                        placeholder="Maharashtra" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label>PIN Code</label>
                      <input name="pin" value={vendor.pin} onChange={hv}
                        placeholder="411001" required />
                    </div>
                    <div className="field">
                      <label>Capacity per Day (kg)</label>
                      <input name="capacity" type="number" value={vendor.capacity} onChange={hv}
                        placeholder="e.g. 50" required />
                    </div>
                  </div>

                  <div className="field">
                    <label>Password</label>
                    <input name="password" type="password" value={vendor.password} onChange={hv}
                      placeholder="Create a strong password" required />
                  </div>
                </>
              )}

              <button type="button" onClick={handleSubmit} className="auth-submit">
                Create Account →
              </button>

            </form>

            <p className="auth-footer">
              Already registered? <a href="/login">Sign in</a>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}