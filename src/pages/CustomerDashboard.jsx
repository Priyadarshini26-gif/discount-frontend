import { useEffect, useState } from "react";
import API from "../services/api";

function CustomerDashboard() {
  const [rules, setRules] = useState([]);

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Dashboard</h2>

      <h3>Available Discounts</h3>

      {rules.map((rule) => (
        <div key={rule._id} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <p><b>{rule.name}</b></p>
          <p>Min Order: {rule.minOrderValue}</p>
          <p>Discount: {rule.discountPercent}%</p>

          {/*Check eligibility*/} 

          <input type="number" placeholder="Enter order value" onChange={(e) => rule.orderValue = e.target.value}/>

          <button onClick={async ()=>{
            try{
              const res=await API.post("/api/discount-rules/check-eligibility",{
                ruleId: rule._id,
                orderValue: Number(rule.orderValue)
              });

              alert(res.data.isEligible ? "Eligible":res.data.reason);
            }
            catch(err){
              console.log(err); // VERY IMPORTANT
              alert(err.response?.data?.message || "Error checking eligibility");
            }
          }}>
            Check Eligibility
          </button>
          
          {/*Apply Discount button*/} 

          <button onClick={async()=>{
            try{
              const res=await API.post("/api/discount-rules/apply",{
                ruleId: rule._id,
                orderValue: Number(rule.orderValue)
              });
              alert(`Discount Applied! Final Amount: ${res.data.finalAmount}`);
            } 
            catch(err){
              alert(err.response?.data?.message);
            }
          }}>
            Apply Discount
          </button>
        </div>
      ))}
    </div>
  );
}

export default CustomerDashboard;