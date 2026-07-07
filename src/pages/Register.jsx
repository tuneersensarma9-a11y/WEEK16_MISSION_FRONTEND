import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
        "http://localhost:5000/api/auth/register",
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
        alert(data.message);
        navigate("/");
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

        <h1 className="title">Create Account</h1>

        <p className="subtitle">
          Join VitalSync Healthcare Portal
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn"
            type="submit"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <span>
            Already have an account?
          </span>

          <br />

          <button
            className="link-btn"
            onClick={() => navigate("/")}
          >
            Login Here
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;