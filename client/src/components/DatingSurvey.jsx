import { useState } from "react";
import {
  Paper,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Alert,
  Typography,
  Box
} from "@mui/material";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import * as api from "../util/api"
import { useNavigate } from "react-router-dom";


const Survey = (props) => {
        const [dateName, setDateName] = useState("");
        const [location, setLocation] = useState("");
        const [rating, setRating] = useState(0);
        const [nextDate, setNextDate] = useState(""); 
            
   const navigate = useNavigate();
   
    
    return (
        <Paper elevation={4} sx={{ mt: "0.5em" }}>
            <CardContent>
               
                <CardHeader title="Your Dating Survey" sx={{ color: "#f680dc",fontWeight: "bold" }}/>
                 {/* <TextField fullWidth label="Who is your date?" variant="outlined" margin="normal"  /> */}
                <TextField fullWidth label="Who is your date?" value={dateName} onChange={(e) => setDateName(e.target.value)}sx={{ mb: "1em" }}/>

                <TextField fullWidth label="Your date location" value={location}onChange={(e) => setLocation(e.target.value)}sx={{ mb: "1em" }}/>

                <Box sx={{ mb: "1em" }}> <Typography variant="h5" sx={{ color: "#f680dc",mb: "0.5em" }}>  How satisfied are you with this date? </Typography>

               <Rating value={rating}onChange={(event, newValue) => setRating(newValue)}   icon={<FavoriteIcon fontSize="large" sx={{color: "#fc2d38"}} />} emptyIcon={<FavoriteBorderIcon fontSize="inherit" />} />
             </Box>

             <Box sx={{ mb: "1em" }}>
            <Typography variant="h6" sx={{ color: "#f680dc", mb: "0.5em" }}>  Do you want the next date?</Typography>
        
             <Button variant={nextDate === "yes" ? "contained" : "outlined"}color="primary" onClick={() => setNextDate("yes")}>
              Yes
            </Button>

            <Button variant={nextDate === "no" ? "contained" : "outlined"} color="primary"onClick={() => setNextDate("no")} >
              No
            </Button>
          </Box>
  

               <Button fullWidth variant="contained"  disabled={!dateName || !location || rating === 0 || !nextDate} onClick={() => {api.surveys.postSurvey({ dateName, location,rating, nextDate}), navigate("/Date")}}>
             Submit </Button>

            </CardContent>
			{props.error && <Alert severity="error">{props.error}</Alert>}
        </Paper>
    );
};

export default Survey;
