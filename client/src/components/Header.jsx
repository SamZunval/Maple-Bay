import React, { useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Badge,

  

} from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from "react-router-dom";
import * as api from "../util/api"
import MenuIcon from "@mui/icons-material/Menu";

const Header = (props) => {

 const [anchor, setAnchor] = useState(null);
 const [numMessages, setNumMessages] = useState(0);

 const getNumMessages = async () => {
  if(isLoggedIn()){
    const user = JSON.parse(sessionStorage.getItem("userInfo"));
    var num = await api.chatroom.getUnreadMessages(user.email);
    setNumMessages(num);
  }
 }

 useEffect(() => {
        const interval = setInterval(getNumMessages, 30000);

        return () => clearInterval(interval); 
    }, []); 

 const handleMenuClick = (path) => {
    if (!sessionStorage.getItem("userInfo")) {
      alert("Please log in to access this page.");
      setAnchor(null);
      return;
    }
    navigate(path);
    setAnchor(null); 
  };

  const adminOnly = () => {
    if (!sessionStorage.getItem("userInfo")) {
      return false;
    }
    if(JSON.parse(sessionStorage.getItem("userInfo")).member === "Admin"){
      return true;
    }
    return false
  }

  const paidOnly = () => {
    if (!sessionStorage.getItem("userInfo")) {
      return false;
    }
    if(JSON.parse(sessionStorage.getItem("userInfo")).member === "Paid" || JSON.parse(sessionStorage.getItem("userInfo")).member === "Admin"){
      return true;
    }
    return false
  }

    const isLoggedIn = () => {
      if (!sessionStorage.getItem("userInfo")) {
        return false;
      }
      else{
        return true;
      }
    }
  

  const handleLogout = () => {
    sessionStorage.clear(); // removes EVERYTHING from session storage
    setAnchor(null);
    navigate("/login"); 
  };

 const navigate = useNavigate();

 return (<>
  
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          {props.appTitle}
        </Typography>
        <div style={{ flex: 1 }} />
        {!isLoggedIn() &&
          <Button style={{ color: "#fffefe" }} onClick={() => navigate("/login")} >Login</Button>
        }        
        {!isLoggedIn() &&
          <Button style={{ color: "#fffefe" }} onClick={() => navigate("/signup")} >Signup </Button>
        }
       {isLoggedIn() &&
        <IconButton aria-label="show unread messages" onClick={() => navigate("/chat")}>
          <Badge badgeContent={numMessages} color="primary">
            <MailIcon />
          </Badge>
        </IconButton>}
        {isLoggedIn() && (
          <IconButton
            style={{ color: "#fffefe" }}
            onClick={(e) => setAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}  
        PaperProps={{sx: {backgroundColor: "primary.main", color: "black",minWidth: "250px"},
        }}
         >
          <MenuItem 
          onClick={() => handleMenuClick("/Profile")}>Profile</MenuItem>
          
          <MenuItem onClick={() => handleMenuClick("/Payment")}>Payment</MenuItem>

          {adminOnly() &&
            <MenuItem onClick={() => handleMenuClick("/Dashboard")}>Management Dashboard</MenuItem>
          }
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>

        </Menu>
      </Toolbar >
    </AppBar >
  </>);
};

export default Header;