import { useState } from "react";

import {
  Snackbar
} from "@mui/material";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx"; 
import Register from './components/SignUp.jsx';
import Profile from './components/Profile.jsx';
import Loves from './components/Love.jsx';
// import Display from './components/DisplayPage.jsx';
import Dashboard from "./components/Dashboard.jsx";
import Date from './components/Date.jsx'
import DatingSurvey from './components/DatingSurvey.jsx'
import Matches from "./components/Matches.jsx";
import Swipe from "./components/Swipe.jsx";
import { Navigate } from "react-router-dom";
import Search from './components/Search.jsx';
import Payment from './components/Payment.jsx';
import DisplayUser from "./components/DisplayUser.jsx";
import "./App.css";
import Header from "./components/Header.jsx";
import { createTheme, ThemeProvider } from "@mui/material";

  const ProtectedRoute = ({ children }) => {
      if (!sessionStorage.getItem("userInfo")) {
          alert("Please log in to access this page.");
          return <Navigate to="/signup" replace />;
      }

      return children;
  };

  const ManagerRoute = ({ children }) => {
      if (!sessionStorage.getItem("userInfo")) {
          alert("Please log in to access this page.");
          return <Navigate to="/signup" replace />;
      }
      else{
        let user = JSON.parse(sessionStorage.getItem("userInfo"));

        if(user.member !== "Admin"){
          alert("This page is admin only!");
          return <Navigate to="/profile" replace />;
        }
        
      }
      return children;
  };

function App() {
 
  // Snackbar State & Functions
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const closeSnackbar = () => setSnackbarVisible(false);
  const openSnackbar = (text) => {
    setSnackbarMessage(text);
    setSnackbarVisible(true);
  }
  
const theme = createTheme({
  palette: {
    primary: {
      main: "#f680dc"
    },

  text:{
    primary: "#3d0f3e"
      }
  }
 
});


  return (<ThemeProvider theme={theme}>
    
    <BrowserRouter>
      <Header appTitle="Duck Dating" log={openSnackbar} />
    
      <Routes>
        <Route path="/" element={<Home log={openSnackbar} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/swipe" element={<ProtectedRoute><Swipe /></ProtectedRoute>} />

        <Route path="/Love" element={<ProtectedRoute><DisplayUser /></ProtectedRoute>} />
        <Route path="/Search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/Payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/DisplayUser" element={<ProtectedRoute><DisplayUser /></ProtectedRoute>} />
        <Route path="/Loves" element={<ProtectedRoute><Loves /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/date" element={<ProtectedRoute><Date /></ProtectedRoute>} />

        <Route path="/DatingSurvey" element={<ProtectedRoute><DatingSurvey /></ProtectedRoute>} />
        <Route path="/Dashboard" element={<ManagerRoute><Dashboard /></ManagerRoute>} />
      </Routes>
      <div className="background"></div>

      <Snackbar
        sx={{zIndex: 99}}
        open={snackbarVisible}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        message={snackbarMessage}
      />
    </BrowserRouter>
    
  </ThemeProvider>);
};

export default App;
