import {useState,useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import * as api from "../util/api"; 

const Love = () => {
  const [usermarks, setusermarks] = useState([]);
  
  //modal states 
  const [open, setOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
          const loadMatches = async () => {
              let username = JSON.parse(sessionStorage.getItem("userInfo")).userName;
              //console.log("username: " + username);
              let result = await api.users.getMatches(username);
              setusermarks(result);
          }
          loadMatches();
      }, []);

    const handleBlock = async (username) => {
      let user = JSON.parse(sessionStorage.getItem("userInfo")).userName;
      await api.users.blockUser(user,username);
    }

    

  return (
    <Box sx={{ maxWidth: 700, margin: "2rem auto",color: "#f680dc"}}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your Matches
      </Typography>

      {usermarks.map((user) => (
        <Paper key={user._id}  elevation={4}   sx={{ marginBottom: 6, padding: 2 }}
        >
          <div style={{ fontSize: "28px" }}>
            {user.userName}
          </div>
          {/* Profile Picture */}
      <CardMedia
        component="img"
        height="350"
        image={user.profileImage || "https://picsum.photos/345/350?random=1"}
        alt={`${user.firstName || user.userName || 'User'}'s profile`}
        sx={{
          objectFit: 'cover'
        }}
        onError={(e) => {
          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjM1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjM1MCIgZmlsbD0iI2Y1ZjVmNSIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjMyNSIgaGVpZ2h0PSIyNSIgZmlsbD0iIzk5OSIgcng9IjUiLz48dGV4dCB4PSIxNzIiIHk9IjI3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
        }}
      />
          <div style={{ fontSize: "18px", marginTop: "10px" }}>
            {user.firstName} {user.lastName}
          </div>

          <div style={{ fontSize: "15px", marginTop: "10px" }}>
            {user.city}, {user.province}
          </div>

          <div style={{ fontSize: "15px", marginTop: "10px" }}>
            {user.address}, {user.postalCode}
          </div>

          <div style={{ fontSize: "15px", marginTop: "10px" }}>
            Birthday: {user.birthDay}
          </div>
          <Button fullWidth variant="contained" 
            onClick={() => {
              setContactInfo(user.email);
              setOpen(true);
            }}          
          >
            Display Contact Information
          </Button>
          
          <Button fullWidth variant="contained"
              onClick={() =>{handleBlock(user.userName)}}
          >
              Block user
          </Button>
        </Paper>
      ))}

    {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Contact Information</DialogTitle>

        <DialogContent>
          <Typography>
            {contactInfo}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Love;
