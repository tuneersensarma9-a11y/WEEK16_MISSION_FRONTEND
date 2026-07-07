import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    appointmentDate: "",
  });

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setAppointments(data.data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to fetch appointments.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createAppointment = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        setFormData({
          patientName: "",
          doctorName: "",
          appointmentDate: "",
        });

        fetchAppointments();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to create appointment.");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchAppointments();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to delete appointment.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <h2>🩺 VitalSync</h2>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="dashboard">
        <div className="welcome-card">
          <h2>
            Welcome, {user?.name}
          </h2>

          <p>
            Manage your healthcare appointments securely.
          </p>
        </div>

        <div className="appointment-form">
          <h2 className="section-title">
            Book Appointment
          </h2>

          <form onSubmit={createAppointment}>
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="doctorName"
              placeholder="Doctor Name"
              value={formData.doctorName}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />

            <button
              className="btn"
              type="submit"
            >
              Book Appointment
            </button>
          </form>
        </div>

        <h2 className="section-title">
          My Appointments
        </h2>

        {appointments.length === 0 ? (
          <div className="appointment-card">
            <p>No appointments found.</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="appointment-card"
            >
              <h3>{appointment.patientName}</h3>

              <p>
                <strong>Doctor:</strong>{" "}
                {appointment.doctorName}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {appointment.appointmentDate}
              </p>

              <div className="card-buttons">
                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteAppointment(
                      appointment._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Dashboard;