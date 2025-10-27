import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { userId, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/auth/staff/reset-password/${userId}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      {message && <p style={{ marginTop: "15px", color: "blue" }}>{message}</p>}
    </div>
  );
}
