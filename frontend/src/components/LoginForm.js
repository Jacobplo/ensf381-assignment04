import React, { useState, createContext } from "react";
import AuthMessage from "./AuthMessage";
export const AuthContext = createContext();

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setStatus({ type: "error", message: "Fields cannot be empty" });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }

    fetch("http://localhost:5050/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          setStatus({ type: "success", message: data.message });
          setTimeout(() => window.location = "/flavors", 2000);
        } else {
          setStatus({ type: "error", message: data.message });
        }
      })
      .catch(() => {
        setStatus({ type: "error", message: "Could not connect to server." });
      });
  };

  return (
    <AuthContext.Provider value={{ status }}>
      <div className="login-form">
        <form>
          <h2 className="login-title">Login</h2>
          <label>Username </label>
          <input
            className="login-input"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br /><br />
          <label>Password </label>
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          <p className="forgot-password">Forgot Password?</p>
          <AuthMessage />
        </form>
      </div>
    </AuthContext.Provider>
  );
}

export default LoginForm;