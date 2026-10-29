import { useLocation, Navigate, useNavigate} from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { Button } from "@mui/material";
import { products,chatroom } from "../util/api";

const Purchase = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const product = location.state?.product;
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState("");

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "null");


    if (!product) {
        return <Navigate to="/" replace />;
    }
    console.log("Purchase page received:", product);

    if (!product) {
        return (
            <Box sx={{ p: 4 }}>
            <Typography variant="h5">
                No product was selected.
            </Typography>
            </Box>
        );
    }

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
    const handleChat = async() => {
        if (!userInfo?.email) {
            setError("Please log in to purchase this item.");
            return;
        }
        await chatroom.newChatRoom(userInfo,product);
        navigate("/chat")
    }

    const handleProfile = async() =>{

        console.log("Show profile ")
    }

    return (
    <Box sx={{ p: 4 }}>
        <Typography variant="h4">
            {product.title || product.name || product.productName || "Product"}
        </Typography>

        <Typography>
            Price: {product.price}
        </Typography>

        <Typography>
            Description: {product.description || product.details}
        </Typography>

        {String(product.status || "").toLowerCase() !== "sold" && (
            <div>
            <Button
                variant="contained"
                onClick={handleChat}
            >
                {"Talk to Seller"}
            </Button>
            <Button
                variant="contained"
                onClick={handlePurchase}
                disabled={purchasing}
            >
                {purchasing ? "Processing..." : "Purchase Item"}
            </Button>
             <Button
                variant="contained"
                onClick={handleProfile}
            >
                {"View Profiel"}
            </Button>
            </div>
        )}
    </Box>
    );
};

export default Purchase;