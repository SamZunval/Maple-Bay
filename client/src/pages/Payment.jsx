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
    ToggleButtonGroup,
    Typography,
    Divider
} from "@mui/material";
import { Avatar} from "@mui/material";
import { 
    IconButton, 
    InputAdornment 
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";
import { useLocation, Navigate, useNavigate} from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock"; //its nice we have all these icons
import ShieldIcon from "@mui/icons-material/Shield"; //its nice we have all these icons


import * as api from "../util/api"
import { products } from "../util/api";


const Payment = () => {


    const location = useLocation();
    const product = location.state?.product;
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "null");
    const navigate = useNavigate();

    const [showCvv, setShowCvv] = useState(false);
    
    const productName = product.title
    const productPrice = product.price;
    const quantity = product.quantity || 1; 

    // Calculate totals
    const subtotal = productPrice * quantity;
    const hst = subtotal * 0.13;
    const total = subtotal + hst;

    // Field used to check if all forms are filed 
    const [paymentInfo, setPaymentInfo] = useState({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        streetAddress: "",
        city: "",
        province: "",
        postalCode: ""
    });

    const isPaymentComplete = Object.values(paymentInfo).every(
        value => value.trim() !== ""
    );
    const formatPrice = (price) => `$${price.toFixed(2)}`;

    useEffect(() => {
        //For testing remove later
        console.log("Product prop received in Payment component:", product);
    });

    const handlePurchase = async () => {
        //setPurchasing(true);

        try {
            const updatedProduct = {
                ...product,
                status: "awaiting-shipment",
                buyerEmail: userInfo.email,
            };

            const response = await products.updateProduct(updatedProduct);

            if (!response.ok) {
                throw new Error("Failed to purchase this item.");
            }

            navigate("/", { replace: true });
        } catch (err) {
            //setError(err.message || "An error occurred while purchasing.");
        } finally {
            //setPurchasing(false);
        }
    };


    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
                px: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    maxWidth: 1100,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 4,
                    justifyContent: "left",
                    textAlign: "left",

                }}
            >

                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        p: { xs: 3, md: 4 },
                        xs: { borderRight: { xs: "none", md: "1px solid #e0e0e0" },
                                textAlign: { xs: "left", md: "left" },
                        },
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" mb={1} xs={{ textAlign: "left" }}>
                        Payment Details
                    </Typography>

                    <Typography color="text.secondary" mb={3}>
                        Credit or debit card

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 1
                            }}
                        >
                            <LockIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                                Your payment is secure. Your card details will not be shared with sellers.
                            </Typography>
                        </Box>
                    </Typography>

                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {/* Cardholder name */}
                        <TextField
                            fullWidth
                            label="Cardholder Name"
                            value={paymentInfo.cardholderName}
                            onChange={(e) =>
                                setPaymentInfo({
                                    ...paymentInfo,
                                    cardholderName: e.target.value
                                })
                            }
                        />
                        {/* Card number */}
                        <TextField
                            fullWidth
                            label="Card Number"
                            value={paymentInfo.cardNumber}
                            onChange={(e) =>
                                setPaymentInfo({
                                    ...paymentInfo,
                                    cardNumber: e.target.value
                                })
                            }
                        />

                        <Box sx={{ display: "flex", gap: 2, }}>
                            {/* Expiry date */}
                            <TextField
                                fullWidth
                                label="Expiry Date"
                                value={paymentInfo.expiryDate}
                                onChange={(e) =>
                                    setPaymentInfo({
                                        ...paymentInfo,
                                        expiryDate: e.target.value
                                    })
                                }
                            />
                            {/* CVV */}
                            <TextField
                                fullWidth
                                label="CVV"
                                type={showCvv ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setShowCvv(!showCvv)
                                                }
                                                edge="end"
                                            >
                                                {showCvv
                                                    ? <VisibilityOff />
                                                    : <Visibility />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                value={paymentInfo.cvv}
                                onChange={(e) =>
                                    setPaymentInfo({
                                        ...paymentInfo,
                                        cvv: e.target.value
                                    })
                                }
                            />
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="h6" fontWeight="bold">
                            Billing Address
                        </Typography>

                        {/* Street address */}
                        <TextField
                            fullWidth
                            label="Street Address"
                            value={paymentInfo.streetAddress}
                            onChange={(e) =>
                                setPaymentInfo({
                                    ...paymentInfo,
                                    streetAddress: e.target.value
                                })
                            }
                        />

                       {/* City  */}
                        <TextField
                            fullWidth
                            label="City"
                            value={paymentInfo.city}
                            onChange={(e) =>
                                setPaymentInfo({
                                    ...paymentInfo,
                                    city: e.target.value
                                })
                            }
                        />

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                            }}
                        >
                            <TextField 
                                fullWidth 
                                label="Province"  
                                value={paymentInfo.province}
                                onChange={(e) =>
                                    setPaymentInfo({
                                        ...paymentInfo,
                                        province: e.target.value
                                    })
                                }
                            />

                            <TextField 
                                fullWidth 
                                label="Postal Code"
                                value={paymentInfo.postalCode}
                                onChange={(e) =>
                                    setPaymentInfo({
                                        ...paymentInfo,
                                        postalCode: e.target.value
                                    })
                                }
                            />
                        </Box>

                    </Box>
                </Paper>

                <Box
                    sx={{
                        width: { xs: "100%", md: 360 },
                        p: { xs: 3, md: 4 },
                        backgroundColor: "#25252d",
                        color: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >

                    <Typography variant="h5" fontWeight="bold" mb={3}>
                        Order Summary
                    </Typography>

                    {/* PRODUCT */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: 75,
                                height: 75,
                                fontSize: 35,
                                backgroundColor: "#3b3b45",
                            }}
                        >
                            🎧
                        </Avatar>

                        <Box>
                            <Typography fontWeight="bold">
                                {productName}
                            </Typography>

                            <Typography  variant="body2" sx={{ color: "#bdbdc7" }}>
                                Quantity: {quantity}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: "#55555f", mb: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography sx={{ color: "#ccccd3" }}>
                            Subtotal
                        </Typography>

                        <Typography>
                            {formatPrice(subtotal)}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography sx={{ color: "#ccccd3" }}>
                            HST (13%)
                        </Typography>

                        <Typography>
                            {formatPrice(hst)}
                        </Typography>
                    </Box>

                    <Divider sx={{ borderColor: "#55555f", mb: 2 }} />

                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}>
                        <Typography variant="h6" fontWeight="bold">
                            Total
                        </Typography>

                        <Typography variant="h5" fontWeight="bold">
                            {formatPrice(total)}
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "#bdbdc7", textAlign: "center", mb: 2 }}>
                        By placing your order, you agree to eBay's User Agreement and acknowledge the Privacy Notice. 
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={isPaymentComplete ? false : true}
                        sx={{
                            py: 1.5,
                            fontWeight: "bold",
                            fontSize: "1rem",
                            borderRadius: "30px",
                            color: "#ffffff",
                            overflow: "hidden",
                            "&:hover": {
                                backgroundColor: "#B3B7EE",
                            },
                        }}
                        onClick={handlePurchase}
                    >
                        Pay {formatPrice(total)}
                    </Button>

                    <Typography
                        variant="caption"
                        sx={{
                            color: "#bdbdc7",
                            textAlign: "center",
                            mt: 2,
                        }}
                    >
                      Enter your card details
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 1
                        }}
                    >
                        <ShieldIcon sx={{ fontSize: 16, color: "#9395D3" }} />
                        <Typography variant="caption">
                            Purchase protected by <strong>Maple Bay</strong> Money Back Guarantee
                        </Typography>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};


export default Payment;