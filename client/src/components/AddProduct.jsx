
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as api from "../util/api"

const AddProduct = () => {
    const navigate = useNavigate();

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    
    const [product, setProduct] = useState({
        title: "",
        description: "",
        category: "",
        condition: "",
        price: "",
        currency: "CAD",
        city: "",
        province: "",
        imageUrl: "",
        quantityAvailable: "",
        status: "active",
    });

    const categories = [
        "Audio",
        "Laptops",
        "Monitors",
        "Computer Accessories",
        "Cameras",
        "Other",
    ];

    const conditions = [
        "Untouched",
        "Like New",
        "Very Good",
        "Good",
        "Fair",
        "Well-worn"
    ];

    const handleProductChange = (event) => {
        const { name, value } = event.target;

        setProduct((previousProduct) => ({
            ...previousProduct,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                setProduct((previousProduct) => ({
                    ...previousProduct,
                    imageUrl: reader.result,
                }));
            };

            reader.onerror = (error) => {
                console.error("Error reading file: ", error);
            };
        }
    };

    const handleSubmit = async () => {
        try {
            
            const newProduct = {
                ...product,
                user: userInfo.userType === 'personal'
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : userInfo.businessName,
                sellerEmail: userInfo.email,
            };
            console.log("Submitting product:", newProduct);

            await api.products.postProduct(newProduct);

            navigate('/profile');

        } catch (err) {
            console.error("Registration error:", err);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4, px: 2 }}>
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 650,
                    p: 3,
                    borderRadius: 3,
                }}
            >
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Add Product
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    {/* Product Image */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 1,
                        }}
                    >
                        <Avatar
                            src={product.imageUrl || undefined}
                            variant="rounded"
                            sx={{
                                width: 180,
                                height: 140,
                                mb: 2,
                                bgcolor: "#f0f0f0",
                                color: "black",
                                border: "1px dashed #999",
                            }}
                        >
                            {!product.imageUrl && (
                                <AddIcon sx={{ fontSize: 50 }} />
                            )}
                        </Avatar>

                        <Button variant="outlined" component="label">
                            Add Product Image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Box>

                    <TextField
                        fullWidth
                        required
                        label="Product Title"
                        name="title"
                        value={product.title}
                        onChange={handleProductChange}
                    />

                    <TextField
                        fullWidth
                        required
                        multiline
                        rows={3}
                        label="Description"
                        name="description"
                        value={product.description}
                        onChange={handleProductChange}
                    />

                    <TextField
                        fullWidth
                        required
                        select
                        label="Category"
                        name="category"
                        value={product.category}
                        onChange={handleProductChange}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        select
                        label="Condition"
                        name="condition"
                        value={product.condition}
                        onChange={handleProductChange}
                    >
                        {conditions.map((condition) => (
                            <MenuItem key={condition} value={condition}>
                                {condition}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Price (CAD)"
                        name="price"
                        value={product.price}
                        onChange={handleProductChange}
                        inputProps={{ min: 0, step: "0.01" }}
                    />

                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Quantity Available"
                        name="quantityAvailable"
                        value={product.quantityAvailable}
                        onChange={handleProductChange}
                        inputProps={{ min: 1, step: 1 }}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            fullWidth
                            required
                            label="City"
                            name="city"
                            value={product.city}
                            onChange={handleProductChange}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Province"
                            name="province"
                            value={product.province}
                            onChange={handleProductChange}
                        />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                        >
                            Add Product
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddProduct;
