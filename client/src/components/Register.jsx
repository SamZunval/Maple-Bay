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
        userType: "personal"
    });
    const [image, setImage] = useState(null);   

    const [error, setError] = useState("");

    const [uType, setuType] = useState("personal");

    const handleButtonChange = (event, newType) => {
        setuType(newType);
        setRegisterData({ ...registerData, ["userType"]: newType });
    };

    const handleChange = (e) => {
       setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };
    const disableSubmit = () => {
       return ((registerData.userType == "business") && (!registerData.businessName)) ||((registerData.userType == "personal") && (!registerData.firstName || !registerData.lastName)) ||!registerData.password||!registerData.province||!registerData.city||!registerData.email;
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Paper elevation={4} sx={{ width: "100%", maxWidth: 800, borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <CardHeader title="Create an Account" sx={{ color: "#f680dc" }} />

                    {/* Profile Image */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                        <Avatar src={image}
                                sx={{ width: 100, height: 100, mb: 1, bgcolor: "#f680dc" }}/>
                        <Button  variant="outlined"
                            component="label"
                            sx={{ color: "#f680dc", borderColor: "#f680dc" }}
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
                    <ToggleButtonGroup
                        color="primary"
                        value={uType}
                        exclusive
                        onChange={handleButtonChange}
                        aria-label="User Type"
                    >
                    <ToggleButton value="personal">Personal</ToggleButton>
                    <ToggleButton value="business">Business</ToggleButton>
                    </ToggleButtonGroup>

                    {/* Form Fields */}
                    {uType == "personal" &&
                    <Box sx={{ display: "flex", gap: 2, }}>
                        <TextField fullWidth label="First Name" name="firstName" 
                            value={registerData.firstName} onChange={handleChange} sx={{ mb: "1em" }} />

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
                        value={registerData.password} onChange={handleChange} sx={{ mb: "1em" }} 
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
                        sx={{ backgroundColor: "#f680dc", "&:hover": { backgroundColor: "#d46bb8" } }}
                    >
                        Sign Up
                    </Button>
                </CardContent>
                {error && <Alert severity="error">{error}</Alert>}
            </Paper>
        </Box>
    );
};


export default Register;