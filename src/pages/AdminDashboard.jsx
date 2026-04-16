import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [report, setReport] = useState([]);
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    name: "",
    minOrderValue: "",
    allowedRole: "CUSTOMER",
    maxUsage: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
    maxDiscountAmount: "",
    isFirstTimeOnly: false,
  });

  const fetchRules = async () => {
    const res = await API.get("/api/discount-rules");
    setRules(res.data);
  };

  const fetchReport = async () => {
  try {
    const res = await API.get("https://discount-backend-1.onrender.com/api/discount-rules/usage-report");
    setReport(res.data);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchRules();
    fetchReport();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createRule = async () => {
    try {
      await API.post("https://discount-backend-1.onrender.com/api/discount-rules", form);
      alert("Rule created");
      fetchRules();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const toggleRule = async (id) => {
    try {
      await API.patch(`https://discount-backend-1.onrender.com/api/discount-rules/${id}/toggle`);
      fetchRules();
    } catch (err) {
      alert("Error toggling rule");
    }
  };

  const activeRules = rules.filter((rule) => rule.isActive).length;
  const totalUsage = report.reduce((sum, item) => sum + (item.usedCount || 0), 0);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Admin console</p>
          <h1 className="dashboard-heading">Manage discount rules</h1>
          <p className="dashboard-subtitle">Create rules, toggle them, and review usage.</p>
        </div>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="meta">Total rules</div>
          <span className="metric-value">{rules.length}</span>
        </div>
        <div className="metric-card">
          <div className="meta">Active rules</div>
          <span className="metric-value">{activeRules}</span>
        </div>
        <div className="metric-card">
          <div className="meta">Usage entries</div>
          <span className="metric-value">{report.length}</span>
        </div>
        <div className="metric-card">
          <div className="meta">Total uses</div>
          <span className="metric-value">{totalUsage}</span>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="panel">
          <h2>Create Discount Rule</h2>
          <p className="panel-copy">Use the controls below to define eligibility, limits, and scheduling.</p>

          <div className="auth-form">
            <div className="field-grid">
              <input className="field-span-2" name="name" placeholder="Rule name" value={form.name} onChange={handleChange} />
              <input name="minOrderValue" placeholder="Minimum order value" value={form.minOrderValue} onChange={handleChange} />
              <input name="discountPercent" placeholder="Discount percent" value={form.discountPercent} onChange={handleChange} />
              <input name="maxUsage" placeholder="Max usage" value={form.maxUsage} onChange={handleChange} />
              <input type="number" name="maxDiscountAmount" placeholder="Max discount amount" value={form.maxDiscountAmount} onChange={handleChange} />
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
              <select name="allowedRole" value={form.allowedRole} onChange={handleChange}>
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
              <label className="summary-card field-span-2" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="checkbox"
                  name="isFirstTimeOnly"
                  checked={form.isFirstTimeOnly}
                  onChange={(e) => setForm({ ...form, isFirstTimeOnly: e.target.checked })}
                  style={{ width: "18px", height: "18px" }}
                />
                <span>
                  <strong>First time only</strong>
                  <span className="helper-text">Limit this discount to a user's first order.</span>
                </span>
              </label>
            </div>

            <button className="primary-button" onClick={createRule}>Create Rule</button>
          </div>
        </section>

        <section className="panel">
          <h2>All Rules</h2>
          <p className="panel-copy">Toggle each rule's active state from the list below.</p>

          <div className="rules-grid">
            {rules.map((rule) => (
              <article key={rule._id} className="rule-card">
                <div className="row-actions">
                  <h3>{rule.name}</h3>
                  <span className={`pill ${rule.isActive ? "success" : "warning"}`}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="pill-row">
                  <span className="pill">Min: {rule.minOrderValue}</span>
                  <span className="pill">Discount: {rule.discountPercent}%</span>
                  <span className="pill">Limit: {rule.maxUsage ?? "Unlimited"}</span>
                </div>

                <div className="rule-actions">
                  <button className="ghost-button" onClick={() => toggleRule(rule._id)}>
                    Toggle Active
                  </button>
                </div>
              </article>
            ))}

            {rules.length === 0 ? <p className="empty-state">No rules have been created yet.</p> : null}
          </div>
        </section>

        <section className="panel" style={{ gridColumn: "1 / -1" }}>
          <h2>Discount Usage Report</h2>
          <p className="panel-copy">Track who used a discount and how often each rule was applied.</p>

          <div className="report-grid">
            {report.length === 0 ? (
              <p className="empty-state">No usage yet.</p>
            ) : (
              report.map((item) => (
                <article key={item._id} className="report-card">
                  <div className="mini-grid">
                    <div>
                      <div className="meta">User</div>
                      <strong>{item.userId?.email}</strong>
                    </div>
                    <div>
                      <div className="meta">Role</div>
                      <strong>{item.userId?.role}</strong>
                    </div>
                    <div>
                      <div className="meta">Rule</div>
                      <strong>{item.ruleId?.name}</strong>
                    </div>
                    <div>
                      <div className="meta">Discount %</div>
                      <strong>{item.ruleId?.discountPercent}</strong>
                    </div>
                  </div>
                  <p className="report-meta">Used count: {item.usedCount}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;