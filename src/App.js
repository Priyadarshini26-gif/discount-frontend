import api from "./api/axios";

function App() {
  const testBackend = async () => {
    try {
      const res = await api.get("/");
      alert(res.data);
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  return (
    <div>
      <h1>Frontend is ready</h1>
      <button onClick={testBackend}>Test Backend</button>
    </div>
  );
}

export default App;
