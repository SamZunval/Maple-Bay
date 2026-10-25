import { useLocation, Navigate, useNavigate} from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { Button } from "@mui/material";
import { products } from "../util/api";

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

        <Button
            variant="contained"
            onClick={handlePurchase}
            disabled={purchasing}
            >
            {purchasing ? "Processing..." : "Purchase Item"}
        </Button>
    </Box>
    );
};

export default Purchase;