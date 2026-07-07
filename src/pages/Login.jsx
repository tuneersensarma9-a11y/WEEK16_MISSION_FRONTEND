import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Unable to connect to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="card">

        <div className="logo">🩺</div>

        <h1 className="title">VitalSync</h1>

        <p className="subtitle">
          Secure Healthcare Management System
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn"
            type="submit"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <span>
            Don't have an account?
          </span>

          <br />

          <button
            className="link-btn"
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;