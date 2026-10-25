import { useState } from "react";

import {
  Snackbar
} from "@mui/material";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx"; 
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Header from "./components/Header.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Purchase from "./pages/Purchase.jsx";




import { Navigate } from "react-router-dom";
import "./App.css";


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
      main: "#9395D3"
    },
    secondary: {
      main: "#B3B7EE"
    },

  text:{
    primary: "#black"
      }
  },
   typography: {
        fontFamily: "Oxanium, sans-serif",
    },
 
});


  return (
  <ThemeProvider theme={theme}>
    
    <BrowserRouter>
      <Header appTitle="Maple Bay" log={openSnackbar} />
    
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Home log={openSnackbar} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="/purchase" element={<ProtectedRoute> <Purchase /> </ProtectedRoute>} />

        <Route path="/chat" element={<ProtectedRoute> <ChatPage /> </ProtectedRoute> } />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />

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
