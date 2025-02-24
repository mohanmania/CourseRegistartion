import React, { useState } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { auth, db } from "../firebase";  
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
     // Changed to camelCase for consistency
    courseName: ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validatePassword(form.password)) {
        throw new Error("Password must contain at least 6 characters, including letters, numbers, and special characters.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, "usersCourses", user.uid), {  // Fixed collection name spelling
        name: form.name,
        email: form.email,
   
        courseName: form.courseName,
        uid: user.uid
      });

      message.success("Registration Successful!");
      navigate("/");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    

   
      <Container maxWidth="sm" >
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Course Registion
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
        
          <TextField
            fullWidth
            label="Course Name"
            name="courseName"
            type="text"
            value={form.courseName}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            helperText="Must contain letters, numbers, and special characters (min 6 characters)"
          />
          <Button
            variant="contained"
            color="success"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>

  );
}

export default Register;