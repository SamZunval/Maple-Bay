import { useState } from "react";
import {
    Paper,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Alert,
    Box,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import { Avatar } from "@mui/material";
import { 
    IconButton, 
    InputAdornment 
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import * as api from "../util/api"

import { useNavigate } from 'react-router-dom'; 
import personalImage from "../assets/happy.jpg";
import bussinessImage from "../assets/businessmans.png";

const Register = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [registerData, setRegisterData] = useState({
        firstName: "",
        lastName: "",
        businessName: "",
        email: "",
        password: "",
        province: "",
        city: "",
        userType: "personal",

    });
    const [image, setImage] = useState(null);   

    const [error, setError] = useState("");

    const [uType, setuType] = useState("personal");

    const handleButtonChange = (event, newType) => {
        if (newType !== null) {
                setuType(newType);
        }        
        setRegisterData({ ...registerData, ["userType"]: newType });
    };

    const handleChange = (e) => {
       setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };
    
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result); 
            };
            reader.onerror = (error) => {
                console.error("Error reading file: ", error);
            };
        }
    };

     const handleRegister = async () => {
        try {
            
            const newUser = {
                ...registerData,
                profileImage: image  
            };

            await api.users.postUser(newUser);

            console.log("Submitting registration:", newUser);

            setError("");
            sessionStorage.setItem("userName", registerData.email);
        
            navigate('/login');

        } catch (err) {
            setError("Something went wrong with registration.");
            console.error("Registration error:", err);
        }
    };

    return (

        <Box sx={{ display: "flex", justifyContent: "center", py: 4, gap: 2, maxheight: "10vh", overflowY: "auto" }}>

            {/* Left side image */}
            <Paper
                elevation={4}
                sx={{
                    flex: 2,
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    maxWidth: "60%",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Box
                        component="img"
                        src={personalImage}
                        sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: uType === "personal" ? 1 : 0,
                            transition: "opacity 0.5s ease-in-out",
                        }}
                    />

                    <Box
                        component="img"
                        src={bussinessImage}
                        sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: uType === "business" ? 1 : 0,
                            transition: "opacity 0.5s ease-in-out",
                        }}
                    />
                </Box>
            </Paper>

            {/* Right side sign up form */}
            <Paper elevation={4} sx={{ width: "100%", maxWidth: 400, borderRadius: 4, display:"flex"}}>
                <CardContent sx={{ p: 2 }}>
                    <CardHeader title="Create an Account" sx={{ color: "black" }} />

                    {/* Profile Image */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                        <Avatar src={image}
                                sx={{ width: 100, height: 100, mb: 1, bgcolor: "black" }}/>
                        <Button  variant="outlined"
                            component="label"
                            sx={{ color: "black", borderColor: "black" }}
                        >
                        Upload Profile Photo
                        <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Box>

                    {/*Company or user*/}
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            width: "100%",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "30px",
                            padding: "4px",
                            marginBottom: "1em",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: "4px",
                                bottom: "4px",
                                left: uType === "personal" ? "1%" : "50%",
                                width: "calc(50% - 1%)",
                                backgroundColor: "var(--primary-color)",
                                borderRadius: "30px",
                                transition: "left 0.3s ease",
                            }}
                        />

                        <ToggleButtonGroup
                            color="primary"
                            value={uType}
                            exclusive
                            onChange={handleButtonChange}
                            sx={{
                                display: "flex",
                                width: "100%",
                                position: "relative",
                                zIndex: 1,

                                "& .MuiToggleButtonGroup-grouped": {
                                    flex: 1,
                                    border: "none",
                                    borderRadius: "30px !important",
                                    padding: "8px 24px",
                                },

                                "& .Mui-selected": {
                                    backgroundColor: "var(--primary-color) ",
                                    color: "var(--text-color) !important",
                                },
                            }}
                        >
                            <ToggleButton value="personal">
                                Personal
                            </ToggleButton>

                            <ToggleButton value="business">
                                Business
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Form Fields */}
                    {uType == "personal" &&
                    <Box sx={{ display: "flex", gap: 2, color: "black" }}>
                        <TextField fullWidth label="First Name" name="firstName" 
                            value={registerData.firstName} onChange={handleChange} sx={{ mb: "1em", color: "black" }} />

                        <TextField fullWidth label="Last Name" name="lastName" 
                            value={registerData.lastName} onChange={handleChange} sx={{ mb: "1em" }} />
                    </Box>
                    }
                    {uType == "business" &&
                    <Box sx={{ display: "flex", gap: 2, }}>
                        <TextField fullWidth label="Business Name" name="businessName" 
                            value={registerData.businessName} onChange={handleChange} sx={{ mb: "1em" }} />
                    </Box>
                    }


                    <TextField fullWidth label="Password" name="password" type={showPassword ? "text" : "password"}
                        value={registerData.password} onChange={handleChange} 
                        sx={{ mb: "1em" }} 
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
                        }}/>
                    <TextField fullWidth label="Email" name="email" 
                            value={registerData.email} onChange={handleChange} sx={{ mb: "1em" }} />
                    {/*Location fields */}

                    <Box sx={{ display: "flex", gap: 2, }}>
                        <TextField fullWidth label="City" name="city" type="city"
                            value={registerData.city} onChange={handleChange} sx={{ mb: "1em" }} />
                        <TextField fullWidth label="Province" name="province" type="province"
                            value={registerData.province} onChange={handleChange} sx={{ mb: "1em" }} />
                        
                    </Box>                    
                   

                    <Button fullWidth variant="contained" 
                        disabled={((registerData.userType == "business") && (!registerData.businessName)) ||((registerData.userType == "personal") && (!registerData.firstName || !registerData.lastName)) ||!registerData.password||!registerData.province||!registerData.city||!registerData.email}
                        onClick={handleRegister}
                    >
                        {uType === "personal" ? "Create Personal Account" : "Create Business Account"}
                    </Button>
                </CardContent>
                {error && <Alert severity="error">{error}</Alert>}
            </Paper>
        </Box>
    );
};


export default Register;