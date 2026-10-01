import { useState } from "react";
import {
    Paper,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Alert
} from "@mui/material";

import { 
    IconButton, 
    InputAdornment 
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import * as api from "../util/api"

import logo from "../assets/Ducky.png";
import { useNavigate } from 'react-router-dom'; 

const Login = (props) => {

    const [userName, setUserName] = useState(sessionStorage.getItem("userName") || "");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

     const handleLogin = async () => {
            try {
                var loggedInUser = await api.users.loginUser( userName, password );
                if (!loggedInUser || Object.keys(loggedInUser).length === 0) {
                    alert("Invalid username or password. Please try again.");
                    console.log("Login failed for user:", userName);
                    return;
                }
                sessionStorage.setItem("userInfo", JSON.stringify(loggedInUser));

               console.log(`[Login Success] Welcome back, ${loggedInUser.firstName}!`, loggedInUser);
                
                if(loggedInUser.member == "Paid"){
                    navigate('/swipe');
                }
                else {
                    navigate('/profile');
                }
    
            } catch (err) {
                console.error("Login error:", err);
            }
        };

    return (
        <Paper elevation={4} sx={{ mt: "0.5em" }}>
            <CardContent>
                <img src={logo} alt="Cupid Community Logo" style={{ width: "40%", maxWidth: "200px", margin: "1em" }} />
                <CardHeader title="Login your Account" sx={{ color: "#f680dc" }}/>
                <TextField fullWidth label="Email" value={userName} onChange={(e) => setUserName(e.target.value)} sx={{ mb: "1em" }}
                />
                <TextField fullWidth label="Password" value={password} type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} sx={{ mb: "1em" }}
                 InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button fullWidth variant="contained" disabled={!password || !userName}
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </CardContent>
			{props.error && <Alert severity="error">{props.error}</Alert>}
        </Paper>
    );
};

export default Login;