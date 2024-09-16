import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Backendapi from "./Backendapi";
import "./DA.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();
  // linear - gradient(286deg, rgb(76, 160, 252) 23 %, rgb(224, 47, 238) 76 %)

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post(
        `${Backendapi.REACT_APP_BACKEND_API_URL}/login`,
        {
          username,
          password,
        }
      );

      localStorage.setItem("auth", JSON.stringify(response.data.userInfo));
      if (response.data) {
        if (response.data.userInfo.isAdmin === "yes") {
          // navigate("/admin/list");
          navigate("/mainpage")
          setLoading(false)
          window.location.reload();
        } else {
          navigate("/mainpage");
          setLoading(false)
          window.location.reload();
        }
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        setError("Network error (or) Internal Server Error");
      } else {
        setError("Invalid username or password");
      }
      console.error(error);
      setLoading(false);
    }

  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <h3 style={{ margin: "20px 0px" }}>Login</h3>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <b>Username : </b>
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
            className="login-input"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <b>Password : </b>
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="login-input"
          />
        </div>

        {error && <p style={{color:"red"}}>{error}</p>}

        <button style={{ width: "80%" }} type="submit" disabled ={loading} className="login-button">
          {
            loading ?  "Please wait..." : "Login" 
          } 
        </button>

        {/* "Forgot Password" link to navigate to another component */}
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Link to="/reset/request">Forgot Password?</Link>
        </div>

      </form>
    </div>
  );
};

export default Login;
