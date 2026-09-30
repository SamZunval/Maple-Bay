import {
    Paper,
    CardHeader,
    CardContent,
    Fab
} from '@mui/material';

import logo from "../assets/Ducky.png";
import Search from "./Search";
import Alert from "./Alert";
import Login from "./Login";

const Home = () => {

    return (
        <>
            <Paper elevation={4} sx={{ marginTop: "0.5em", paddingBottom: "1em" }}>
                <img src={logo} alt="Cupid Community Logo" style={{ width: "40%", maxWidth: "200px", margin: "1em" }} />

            </Paper>
            
          
        </>
    );
};

export default Home;