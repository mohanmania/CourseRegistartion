import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Import CSS file

function Login() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({ email: "", password: "" });
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreed) {
      message.error("Please agree to the Terms and Conditions");
      return;
    }

    if (details.password.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, details.email, details.password);
      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
<div className="main-div">
<div className="login-container"  >
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={details.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={details.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label>I agree to the Terms and Conditions</label>
        </div>
        <button type="submit">Login</button>
        <p>New User?<Link to='/register'>Register</Link></p>
      </form>
    </div>
 
</div>
 );
}

export default Login;
