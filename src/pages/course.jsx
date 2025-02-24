import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Button, TextField, Card, CardContent, Typography,
  List, ListItem, ListItemText, IconButton, Container, MenuItem, Select,Drawer
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useUserStore } from "../useStore/userStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { message } from "antd";
import MenuIcon from "@mui/icons-material/Menu";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function Course() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newCourseType, setNewCourseType] = useState("individual");
  const [courseLanguage, setCourseLanguage] = useState("english");
  const [registrations, setRegistrations] = useState({});
  const [showRegisteredCourses, setShowRegisteredCourses] = useState(false);
  const [userRegisteredCourses, setUserRegisteredCourses] = useState([]);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const { currentUser } = useUserStore();

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (currentUser?.courseName) {
      setUserRegisteredCourses(
        Array.isArray(currentUser.courseName) 
          ? currentUser.courseName 
          : [currentUser.courseName]
      );
    }
  }, [currentUser]);
  const drawerContent = (
    <List sx={{ width: 250 }}>
      {["all", "individual", "groupLearning", "selfLearning"].map((category) => (
        <ListItem button key={category} onClick={() => { handleCategoryClick(category); toggleDrawer(); }}>
          <ListItemText primary={category.charAt(0).toUpperCase() + category.slice(1)} />
        </ListItem>
      ))}
      <ListItem button onClick={() => { setShowRegisteredCourses(!showRegisteredCourses); toggleDrawer(); }}>
        <ListItemText primary={showRegisteredCourses ? "Show All Courses" : "Show Registered Courses"} />
      </ListItem>
      <ListItem button component={Link} to="/Online-compiler">
        <PlayArrowIcon sx={{ marginRight: 1 }} />
        <ListItemText primary="Compiler" />
      </ListItem>
    </List>
  );

  const [courses, setCourses] = useState({
    individual: [
      { name: "Java", languages: ["English", "Hindi", "Telugu"] },
      { name: "Python", languages: ["English", "Hindi"] },
      { name: "React", languages: ["English", "Telugu"] }
    ],
    groupLearning: [
      { name: "AI Basics", languages: ["English"] },
      { name: "Data Science", languages: ["English", "Hindi"] },
      { name: "Web Dev", languages: ["English", "Telugu", "Hindi"] }
    ],
    selfLearning: [
      { name: "Machine Learning", languages: ["English"] },
      { name: "Docker", languages: ["English", "Hindi"] },
      { name: "Cloud Computing", languages: ["English", "Telugu"] }
    ]
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDeleteCourse = async (courseName) => {
    try {
      const updatedCourses = userRegisteredCourses.filter(
        course => course !== courseName
      );
      
      setUserRegisteredCourses(updatedCourses);

      if (currentUser?.uid) {
        const userRef = doc(db, "usersCourses", currentUser.uid);
        await updateDoc(userRef, {
          courseName: updatedCourses
        });
      }
      message.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Failed to delete course");
    }
  };

  const handleAddCourse = () => {
    if (!isAdmin || !newCourse.trim() || !newCourseType) return;
    setCourses((prevCourses) => ({
      ...prevCourses,
      [newCourseType]: [
        ...prevCourses[newCourseType],
        {
          name: newCourse.trim(),
          languages: [courseLanguage.charAt(0).toUpperCase() + courseLanguage.slice(1)]
        }
      ]
    }));
    setNewCourse("");
  };

  const handleRegisterStudent = (course) => {
    if (!currentUser?.email) return;
    setRegistrations((prev) => ({
      ...prev,
      [course]: [...(prev[course] || []), currentUser.email]
    }));
    navigate('/register');
  };

  const handleDeleteRegistration = (course) => {
    if (!currentUser?.email) return;
    setRegistrations((prevRegistrations) => {
      const updatedRegistrations = { ...prevRegistrations };
      updatedRegistrations[course] = updatedRegistrations[course].filter(
        (email) => email !== currentUser.email
      );

      if (updatedRegistrations[course].length === 0) {
        delete updatedRegistrations[course];
      }

      return updatedRegistrations;
    });
  };

  const allCourses = Object.entries(courses).flatMap(([category, courseList]) =>
    courseList.map(course => ({ category, ...course }))
  );

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedCourses = showRegisteredCourses
    ? userRegisteredCourses
    : filteredCourses.map(course => course.name);

  return (
    <div className="main-div" style={{
      backgroundColor: "#f4f4f4",
      minHeight: "100vh",
      paddingTop: "80px",
      backgroundImage: `url("../images/img1.jpg")`,
      backgroundSize: "cover",
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat" 
    }}>
      
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleCategoryClick("all")}>All Courses</Button>
              <Button color="inherit" onClick={() => handleCategoryClick("individual")}>Individual</Button>
              <Button color="inherit" onClick={() => handleCategoryClick("groupLearning")}>Grouped</Button>
              <Button color="inherit" onClick={() => handleCategoryClick("selfLearning")}>Self Learning</Button>

              <Button color="inherit" sx={{ marginLeft: "auto" }} onClick={() => setShowRegisteredCourses(!showRegisteredCourses)}>
                {showRegisteredCourses ? "Show All Courses" : "Show Registered Courses"}
              </Button>

              <Link to="/Online-compiler" style={{ textDecoration: "none", color: "inherit" }}>
                <Button color="inherit" startIcon={<PlayArrowIcon />}>Compiler</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>
      {/* User Info */}
      <Container sx={{ textAlign: "center", marginTop: "20px", backgroundColor: "GrayText" }}>
        <Typography variant="h6">Name: {currentUser?.name || "Guest"}</Typography>
        <Typography variant="subtitle1">Email: {currentUser?.email || "N/A"}</Typography>
      </Container>

      {/* Admin Controls */}
      <Container sx={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <TextField
          label="Search Course"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isAdmin && (
          <>
            <Select
              value={newCourseType}
              onChange={(e) => setNewCourseType(e.target.value)}
              size="small"
            >
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="groupLearning">Group Learning</MenuItem>
              <MenuItem value="selfLearning">Self Learning</MenuItem>
            </Select>

            <Select
              value={courseLanguage}
              onChange={(e) => setCourseLanguage(e.target.value)}
              size="small"
            >
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="hindi">Hindi</MenuItem>
              <MenuItem value="telugu">Telugu</MenuItem>
            </Select>

            <TextField
              label="New Course"
              variant="outlined"
              size="small"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddCourse}>
              Add Course
            </Button>
          </>
        )}
      </Container>

      {/* Available Courses */}
      <Container>
        <Card sx={{ maxWidth: 800, margin: "20px auto", padding: "20px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Available Courses
            </Typography>
            
            <List>
              {filteredCourses.map((course) => (
                <ListItem
                  key={course.name}
                  sx={{
                    backgroundColor: "#e3f2fd",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <ListItemText 
                      primary={course.name} 
                      secondary={`Category: ${course.category} | Languages: ${course.languages.join(", ")}`}
                    />
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleRegisterStudent(course.name)}
                      sx={{ mr: 1 }}
                    >
                      Register
                    </Button>
                    {isAdmin && (
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteCourse(course.name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </div>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>

      {/* Registered Courses Card */}
      <Container>
        <Card sx={{ maxWidth: 600, margin: "auto", padding: "20px", marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Registered Courses
            </Typography>
            
            <List>
              {userRegisteredCourses.map((course) => (
                <ListItem
                  key={course}
                  sx={{
                    backgroundColor: "#ffecb3",
                    marginBottom: "10px",
                    borderRadius: "4px"
                  }}
                >
                  <ListItemText primary={course} />
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDeleteCourse(course)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default Course;