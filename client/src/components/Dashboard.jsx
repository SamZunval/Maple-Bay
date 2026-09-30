import {useState,useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";
import * as api from "../util/api"; 

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
          const loadStats = async () => {
              let stat = await api.stats.getStats();
              setStats(stat);
          }
          loadStats();
      }, []);

  return (
    <Box sx={{ maxWidth: 700, margin: "2rem auto"}}>
      <Typography variant="h4" sx={{ mb: 3 ,color: "#f680dc"}}>
        Management Dashboard
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Number of free users: {stats.numFree}
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Number of paid users: {stats.numPaid}
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Number of times that contact info has been revealed: {stats.revealedData}
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Number of matches to date: {stats.matches}
      </Typography>
    </Box>
  );
};

export default Dashboard;
