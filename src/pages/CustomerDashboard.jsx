import { useEffect, useState } from "react";
import API from "../services/api";

function CustomerDashboard() {
  const [rules, setRules] = useState([]);
  const [orderValues, setOrderValues] = useState({});

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await API.get("/api/discount-rules");
        setRules(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRules();
  }, []);

  const totalRules = rules.length;
  const activeRules = rules.filter((rule) => rule.isActive).length;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Customer view</p>
          <h1 className="dashboard-heading">Discount rules</h1>
          <p className="dashboard-subtitle">Check available offers and test your order value.</p>
        </div>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="meta">Available rules</div>
          <span className="metric-value">{totalRules}</span>
        </div>
        <div className="metric-card">
          <div className="meta">Active rules</div>
          <span className="metric-value">{activeRules}</span>
        </div>
      </div>

      <div className="dashboard-content customer-dashboard-content">
        <section className="panel">
          <h2>Available Discounts</h2>
          <p className="panel-copy">Enter an order value to check eligibility or apply a discount.</p>

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
                  <span className="pill">Min order: {rule.minOrderValue}</span>
                  <span className="pill">Discount: {rule.discountPercent}%</span>
                </div>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter order value"
                  value={orderValues[rule._id] ?? ""}
                  onChange={(e) =>
                    setOrderValues({
                      ...orderValues,
                      [rule._id]: e.target.value,
                    })
                  }
                />

                <div className="rule-actions">
                  <button
                    className="ghost-button"
                    onClick={async () => {
                      try {
                        const orderValue = Number(orderValues[rule._id]);
                        const res = await API.post("/api/discount-rules/check-eligibility", {
                          ruleId: rule._id,
                          orderValue,
                        });

                        alert(res.data.isEligible ? "Eligible" : res.data.reason);
                      } catch (err) {
                        console.log(err);
                        alert(err.response?.data?.message || "Error checking eligibility");
                      }
                    }}
                  >
                    Check Eligibility
                  </button>

                  <button
                    className="primary-button"
                    onClick={async () => {
                      try {
                        const orderValue = Number(orderValues[rule._id]);
                        const res = await API.post("/api/discount-rules/apply", {
                          ruleId: rule._id,
                          orderValue,
                        });
                        alert(`Discount applied. Final amount: ${res.data.finalAmount}`);
                      } catch (err) {
                        alert(err.response?.data?.message || "Unable to apply discount");
                      }
                    }}
                  >
                    Apply Discount
                  </button>
                </div>
              </article>
            ))}

            {rules.length === 0 ? <p className="empty-state">No discount rules are available right now.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CustomerDashboard;