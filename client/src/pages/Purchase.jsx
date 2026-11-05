
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import 
{ 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Divider, 
    Avatar,
    CircularProgress,
} from "@mui/material";
import { useState, useEffect} from "react";
import { Button } from "@mui/material";
import { products, chatroom } from "../util/api";
import { users } from "../util/api";

const Purchase = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const product = location.state?.product;
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState("");

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "null");

    const [seller, setSeller] = useState(null);

    //We need this to get the sellers picture
    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const data = await users.getUserByEmail(product.sellerEmail);
                console.log("Seller returned:", data);
                setSeller(data);
                console.log("Seller set to:", seller);
            } catch (error) {
                console.error("Error fetching seller:", error);
            }
        };

        fetchSeller();
    }, [product]);

    if (!product) {
        return <Navigate to="/" replace />;
    }

    //console.log("Purchase page received:", product);

    const handlePurchase = async () => {
        if (!userInfo?.email) {
            setError("Please log in to purchase this item.");
            return;
        }

        setPurchasing(true);
        setError("");

        try {
            const updatedProduct = {
                ...product,
                status: "sold",
                buyerEmail: userInfo.email,
            };

            const response = await products.updateProduct(updatedProduct);

            if (!response.ok) {
                throw new Error("Failed to purchase this item.");
            }

            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "An error occurred while purchasing.");
        } finally {
            setPurchasing(false);
        }
    };

    const handleChat = async () => {
        if (!userInfo?.email) {
            setError("Please log in to purchase this item.");
            return;
        }

        await chatroom.newChatRoom(userInfo, product);
        navigate("/chat");
    };

    const handleProfile = async () => {
        console.log("Show profile");
    };

    return (
        <Box sx={{
            width: "100%",
            maxWidth: "1500px",
            mx: "auto",
            px: { xs: 1, sm: 2, md: 4 },
            py: 3,
        }}>
            <Grid
                container
                spacing={{ xs: 1, sm: 2, md: 3 }}
                alignItems="stretch"
                sx={{ flexWrap: "nowrap" }}
            >

                {/* PRODUCT IMAGE */}
                <Grid item xs={8} sx={{ minWidth: 0, flex: "2 1 0%" }}>
                    <Paper
                        elevation={2}
                        sx={{
                            height: { xs: "350px", sm: "450px", md: "600px" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            backgroundColor: "#f5f5f5",
                        }}
                    >
                        <Box
                            component="img"
                            src={product.imageUrl}
                            alt={product.title || product.name || "Product"}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Paper>
                </Grid>

                {/* PRODUCT INFO */}
                <Grid item xs={4} sx={{ minWidth: 0, flex: "1 1 0%" }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: { xs: 1.5, sm: 2, md: 3 },
                            height: "100%",
                            boxSizing: "border-box",
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            {product.title || product.name || product.productName || "Product"}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        {/* SELLER INFO */}
                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                            <Avatar
                                src={seller?.profileImage || ""}
                                alt={seller?.name || product.sellerName || "Seller"}
                                sx={{
                                    width: 55,
                                    height: 55,
                                }}
                            />

                            <Box  sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, py: 1  }}>
                                <Typography variant="caption" color="text.secondary" justifyContent="left">
                                    Seller
                                </Typography>

                                 {seller ? (
                                    <Typography variant="body1" fontWeight="bold">
                                        {`${seller.firstName || ""} ${seller.lastName || ""}`.trim() || seller.businessName || "Unknown Seller"}
                                    </Typography>
                                ) : (
                                    <CircularProgress size={20} />
                                )}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* BUTTNS */}
                        {String(product.status || "").toLowerCase() !== "sold" && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleChat}
                                >
                                    Talk to Seller
                                </Button>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handlePurchase}
                                    disabled={purchasing}
                                >
                                    {purchasing ? "Processing..." : "Purchase Item"}
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={handleProfile}
                                >
                                    View Profile
                                </Button>
                            </Box>
                        )}

                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Divider sx={{ mb: 2 }} />

                        {/* DESC */}
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {product.description || product.details || "No description provided."}
                        </Typography>

                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Purchase;