import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button,
  IconButton,
  

} from "@mui/material";

import { useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";

const Header = (props) => {

 const [anchor, setAnchor] = useState(null);

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
        <Typography variant="h6">
          {props.appTitle}
        </Typography>
        <div style={{ flex: 1 }} />
        {!isLoggedIn() &&
          <Button style={{ color: "#fffefe" }} onClick={() => navigate("/login")} >Login</Button>
        }        
        {!isLoggedIn() &&
          <Button style={{ color: "#fffefe" }} onClick={() => navigate("/signup")} >Sign Up </Button>
        }
       
        {isLoggedIn() && (
          <IconButton
            style={{ color: "#fffefe" }}
            onClick={(e) => setAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}  
        PaperProps={{sx: {backgroundColor: "#f680dc", color: "#fffefe",minWidth: "250px"},
        }}
         >
          <MenuItem 
          onClick={() => handleMenuClick("/Profile")}>Profile</MenuItem>
          <MenuItem
            disabled={!paidOnly()}
            onClick={() => handleMenuClick("/swipe", true)}
          >
            Swipe {!paidOnly() && "🔒"}
          </MenuItem>
          <MenuItem
            disabled={!paidOnly()}
            onClick={() => handleMenuClick("/Date", true)}
          >
            Date {!paidOnly() && "🔒"}
          </MenuItem>          
          <MenuItem
            onClick={() => handleMenuClick("/DisplayUser", true)}
          >
            UserProfile 
          </MenuItem>
          <MenuItem
            disabled={!paidOnly()}
            onClick={() => handleMenuClick("/Search", true)}
          >
            Search {!paidOnly() && "🔒"}
          </MenuItem>         
          <MenuItem
            disabled={!paidOnly()}
            onClick={() => handleMenuClick("/Loves", true)}
          >
            Love {!paidOnly() && "🔒"}
          </MenuItem>            
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