import { useState,useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  CardMedia,
  Fab  
} from '@mui/material';
import * as api from "../util/api"
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Search = ( ) => {
  const [mockUsers, setUsers] = useState([]);
  /*{
      _id: '69c2b467940e9425c705361b',
      userName: 'userC',
      email: 'userC@gmail.com',
      password: 'ccc',
      address: '100 street',
      birthDay: '15-02-2025',
      city: 'Water Loop',
      postalCode: 'nnn-888',
      province: 'On',
      firstName: 'John',
      lastName: 'Doe'
    } */
  useEffect(() => {
          const loadUsers = async () => {
              let result = await api.users.getUsers();
              setUsers(result);
          }
          loadUsers();
      }, []);
  const [selectedUser, setSelectedUser] = useState(null);

  const [usermarks, setUsermarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usermarks")) || [];
    } catch {
      return [];
    }
  });
  

  const userLabel = (user) => {
    if (!user) return "";
    //return `${user.userName} (${user.email})`; should not display email
    return `${user.userName}`;
  };

const ClickUsermarks = async () => {
    if (!selectedUser) return;

    setUsermarks((prev) => {
      const exists = prev.find(u => u._id === selectedUser._id);

      let updated;

      if (exists) {
        // remove
        updated = prev.filter(u => u._id !== selectedUser._id);
      } else {
        // add
        updated = [...prev, selectedUser];
      }
      
      localStorage.setItem("usermarks", JSON.stringify(updated));
      return updated;
    });
    let username = JSON.parse(sessionStorage.getItem("userInfo")).userName;
    await api.users.likeUser(username, selectedUser.userName);
  };



    const isBookmarked = usermarks.some(
    (u) => u._id === selectedUser?._id
  );

  return (
    <Box sx={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <Typography variant="h4" gutterBottom>Find User</Typography>
      
      <Autocomplete
        options={mockUsers}
        autoHighlight
        getOptionLabel={(option) => userLabel(option)}
        onChange={(_event, newValue) => setSelectedUser(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Search by Username or Email" variant="outlined" />
        )}
        sx={{ mb: 4 }}
      />

     {selectedUser && (
        <Card sx={{ boxShadow: 3, borderRadius: 2, bgcolor: '#fff', position: "relative" }}>
          <CardContent>

            <Typography variant="h5" color="primary" gutterBottom>
              {selectedUser.userName}
            </Typography>

            <Divider sx={{ my: 2 }} />
            <CardMedia
              component="img"
              height="350"
              image={selectedUser.profileImage || "https://picsum.photos/345/350?random=1"}
              alt={`${selectedUser.firstName || selectedUser.userName || 'User'}'s profile`}
              sx={{
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjM1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjM1MCIgZmlsbD0iI2Y1ZjVmNSIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjMyNSIgaGVpZ2h0PSIyNSIgZmlsbD0iIzk5OSIgcng9IjUiLz48dGV4dCB4PSIxNzIiIHk9IjI3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Full Name</Typography>
                <Typography>
                  {selectedUser.firstName || "N/A"} {selectedUser.lastName || ""}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2">Birthday</Typography>
                <Typography>{selectedUser.birthDay}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2">City/Province</Typography>
                <Typography>
                  {selectedUser.city}, {selectedUser.province}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Address</Typography>
                <Typography>
                  {selectedUser.address}, {selectedUser.postalCode}
                </Typography>
              </Grid>
            </Grid>

  
            <Fab
              color="primary"
              onClick={ClickUsermarks}
              sx={{
                position: "absolute",
                bottom: "1em",
                right: "1em"
              }}
            >
              {isBookmarked ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </Fab>

          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Search;  
