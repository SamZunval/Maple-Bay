
import { useState } from "react";
import {
    Paper,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Alert,
    Box,
    Typography
} from "@mui/material";
import * as api from "../util/api";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Ducky.png";

const Payment = () => {
    const navigate = useNavigate();
    const [error] = useState("");

    const [cardData, setCardData] = useState({
        userName: (sessionStorage.getItem("userName")) || "",
        firstName: "",
        lastName: "",
        cardNumber: "",
        expiryDate: "",
        securityCode: "",
        email: "",
        postalCode: "",
        member: ""

    });

    const PAYMENT_AMOUNT = "5.00$";

    const handleChange = (e) => {
      setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
  
        console.log("[Profile Update] Sending updated data to server:", cardData);
        const user = sessionStorage.getItem("userInfo");
        const userData = JSON.parse(user);

        const updatedUser = {
            ...userData,
            ...cardData,
            member: "Paid"
        };

        try 
        {
            const response = await api.users.updateUser(updatedUser);

            if (response.ok) {
                sessionStorage.setItem("userInfo", JSON.stringify(updatedUser));

                alert("Profile updated successfully!");
                navigate("/Search");
            } else {
                alert("Failed to update profile on the server.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("An error occurred while saving.");
        }
    };    

    return (
    <Paper elevation={4} sx={{ mt: 2, p: 3, maxWidth: "60%", mx: "auto" }}>
        <CardContent>
            <Box textAlign="center">
                <img
                src={logo}
                alt="Cupid Community Logo"
                style={{ 
                    width: "40%", 
                    maxWidth: "180px", 
                    marginBottom: "1em", 
                    marginTop: "0",
                }}
                />
            </Box>

            <CardHeader
                title="Become a Premium member!"
                sx={{ 
                    color: "#f680dc", 
                    textAlign: "center" 
                }}
            />
            <Typography
            sx={{
                textAlign: "center",
                mx: "auto", 
                mb: 2,
                color: "#555",
                width: "80%", 
                fontSize: "1.3rem",
            }}
            >
            Upgrade to Premium to unlock exclusive features. View who has liked you, connect
            with more people, and set up dates directly with other profiles. Enjoy a better,
            more personalized experience.
            </Typography>
            <Typography
            sx={{
                marginBottom: 2,
                padding: 1.5,
                backgroundColor: "#fdf0f9",
                borderRadius: 1,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",

            }}
            >
            Amount: {PAYMENT_AMOUNT}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={cardData.firstName}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={cardData.lastName}
                    onChange={handleChange}
                />
            </Box>
            
            <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                type="text"
                value={cardData.cardNumber}
                onChange={handleChange}
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
                fullWidth
                label="Expiry Date (MM/YY)"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleChange}
            />
            <TextField
                fullWidth
                label="CVV"
                name="securityCode"
                type="password"
                value={cardData.securityCode}
                onChange={handleChange}
            />
            </Box>
            
            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={cardData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
            />
            
            <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={cardData.postalCode}
                onChange={handleChange}
                sx={{ mb: 3 }}
            />
            
            <Button
                fullWidth
                variant="contained"
                disabled={
                    !cardData.cardNumber ||
                    !cardData.securityCode ||
                    !cardData.expiryDate || // fixed typo
                    !cardData.firstName ||
                    !cardData.lastName
                }
                onClick={handlePayment}
                sx={{
                    backgroundColor: "#f680dc",
                    "&:hover": { backgroundColor: "#d46bb8" },
                    py: 1.2,
                }}
                >
                Pay {PAYMENT_AMOUNT}
            </Button>
        </CardContent>
        {error && <Alert severity="error">{error}</Alert>}
    </Paper>
    );
};

export default Payment;
