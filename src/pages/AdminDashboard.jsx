import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    name: "",
    minOrderValue: "",
    allowedRole: "CUSTOMER",
    maxUsage: "",
    discountPercent: ""
  });

  const fetchRules = async () => {
    const res = await API.get("/api/discount-rules");
    setRules(res.data);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createRule = async () => {
    try {
      await API.post("/api/discount-rules", form);
      alert("Rule created");
      fetchRules();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const toggleRule = async (id) => {
    try {
      await API.patch(`/api/discount-rules/${id}/toggle`);
      fetchRules();
    } catch (err) {
      alert("Error toggling rule");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <h3>Create Discount Rule</h3>

      <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
      <input name="minOrderValue" placeholder="Min Order" onChange={handleChange} /><br /><br />
      <input name="maxUsage" placeholder="Max Usage" onChange={handleChange} /><br /><br />
      <input name="discountPercent" placeholder="Discount %" onChange={handleChange} /><br /><br />

      <select name="allowedRole" onChange={handleChange}>
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select>

      <br /><br />
      <button onClick={createRule}>Create Rule</button>

      <hr />

      <h3>All Rules</h3>

      {rules.map((rule) => (
        <div key={rule._id} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <p><b>{rule.name}</b></p>
          <p>Min: {rule.minOrderValue}</p>
          <p>Discount: {rule.discountPercent}%</p>
          <p>Status: {rule.isActive ? "Active" : "Inactive"}</p>

          <button onClick={() => toggleRule(rule._id)}>
            Toggle Active
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;