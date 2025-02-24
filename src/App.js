import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Register from './components/regiser';
import Login from "./components/Login"
import { Dashboard } from './main';
import Course from './pages/course';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useEffect } from 'react';
import { useUserStore } from "./useStore/userStore";
import Compile from './onlinecompile/compile';

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);
  
  return (
    <>
    
   
    <BrowserRouter>
    <Routes>
  
    <Route path="/register" element={<Register />} />
    <Route path='/*' element={<Dashboard/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Course/>}/>
    <Route path='/Online-compiler' element={<Compile/>}/>
  
  </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
