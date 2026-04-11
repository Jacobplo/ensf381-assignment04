import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      setStatus({ type: "error", message: "All fields are required." });
      return false;
    }
    if (username.length < 3 || username.length > 20) {
      setStatus({ type: "error", message: "Username must be between 3 and 20 characters." });
      return false;
    }
    if (!/^[a-zA-Z]/.test(username)) {
      setStatus({ type: "error", message: "Username must start with a letter." });
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setStatus({ type: "error", message: "Username may only contain letters, numbers, underscores, and hyphens." });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: "error", message: "Invalid email format." });
      return false;
    }
    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters." });
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one uppercase letter." });
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one lowercase letter." });
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one number." });
      return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password)) {
      setStatus({ type: "error", message: "Password must contain at least one special character." });
      return false;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return false;
    }
    return true;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    fetch("http://localhost:5050/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus({ type: "success", message: data.message });
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus({ type: "error", message: data.message });
        }
      })
      .catch(() => {
        setStatus({ type: "error", message: "Could not connect to server." });
      });
  };

  return (
    <div className="content">
      <form>
        <h2>Sign Up</h2>
        <label>Username</label><br />
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <label>Email</label><br />
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <label>Password</label><br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <label>Confirm Password</label><br />
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <button onClick={handleSignup}>Sign Up</button>
        <br />
        {status && (
          <p style={{ color: status.type === "error" ? "red" : "green" }}>
            {status.message}
          </p>
        )}
        <p>
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;