import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await API.post("/api/auth/register", form);

      console.log(res.data);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER"
      });
      setErrorMessage("");

    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed";
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Rule-Based Discount Engine</h1>
      <p>Manage and apply discounts intelligently.</p>
      <div className="auth-shell">
        <section className="auth-card">
          <p className="eyebrow">Create account</p>
          <h2>Create your account</h2>
          <p className="form-help">Fill in your details to get started.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <select name="role" value={form.role} onChange={handleChange}>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>

            {errorMessage ? <div className="empty-state">{errorMessage}</div> : null}

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="switch-row">
            <span>Already have an account?</span>
            <Link to="/login">Login here</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;