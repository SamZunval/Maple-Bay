import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Alert,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  Button,
  InputAdornment ,
  Divider,
   
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const valueFor = (product, fields) => {
  const key = Object.keys(product).find((field) =>
    fields.includes(field.toLowerCase()),
  );
  return key ? product[key] : undefined;
};

const formatPrice = (price) => {
  const amount = Number(price);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(amount)
    : price;
};



const ProductListings = ({productList, loading, error, currentUserEmail, filterByUser = false, showAddButton = false,}
    
) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const navigate = useNavigate();

  const categories = [
    ...new Set(
      productList
        .map((product) => valueFor(product, ["category"]))
        .filter(
          (value) => typeof value === "string" && value.trim(),
        ),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const query = search.trim().toLowerCase();

  //Filtration
  const visibleProducts = productList.filter((product) => {
    
    // Displays products belonging to the current user
    if (filterByUser) {
        const productEmail = String(
            product.sellerEmail || "",
        ).trim().toLowerCase();

        if (
            !currentUserEmail ||
            productEmail !== currentUserEmail.trim().toLowerCase()
        ) {
            return false;
        }
    }

    // Displays products that are active
    if (
      String(valueFor(product, ["status"]) || "")
        .trim()
        .toLowerCase() !== "active"
    ) {
      return false;
    }

    const productCategory = valueFor(product, ["category"]);

    // Filters products by category
    if (category !== "all" && productCategory !== category) {
      return false;
    }

    // Displays all matching products when search is empty
    if (!query) {
      return true;
    }

    // Searches product information
    return Object.values(product).some(
      (value) =>
        (typeof value === "string" || typeof value === "number") &&
        String(value).toLowerCase().includes(query),
    );
  });

    return (
    <Box
        sx={{
        maxWidth: "2000px",
        width: "95%",
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 5,
        }}
    >
        {/* THE SEARCH STACK*/}
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={0}
            sx={{
                mb: 4,
                backgroundColor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: "30px",
                overflow: "hidden",
            }}
        >
            <TextField
                fullWidth
                placeholder="Search the Bay"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                        backgroundColor: "transparent",
                        "& fieldset": {
                            border: "none",
                        },
                    },
                }}
            />
            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    display: { xs: "none", sm: "block" },
                    borderColor: "divider",
                }}
            />
            <FormControl
                sx={{
                    minWidth: { xs: "100%", sm: 220 },
                }}
            >
                <Select
                    labelId="listing-category-label"
                    label="Category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    sx={{
                        borderRadius: 0,
                        backgroundColor: "transparent",
                        "& fieldset": {
                            border: "none",
                        },
                    }}
                >
                    <MenuItem value="all">All categories</MenuItem>
                    {categories.map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>

        <Typography
        component="h2"
        variant="h5"
        sx={{ mb: 2, color: "#3d0f3e" }}
        >
        My Listings
        </Typography>

        {loading && (
        <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
            <CircularProgress />
            <Typography color="text.secondary">
            Loading listings…
            </Typography>
        </Stack>
        )}

        {!loading && error && (
        <Alert severity="error">Query failed: {error}</Alert>
        )}

        {!loading && !error && productList.length === 0 && (
        <Alert severity="info">No listings yet</Alert>
        )}

        {!loading &&
        !error &&
        productList.length > 0 &&
        visibleProducts.length === 0 && (
            <Alert severity="info">
            No listings match your search.
            </Alert>
        )}

        {!loading && !error && visibleProducts.length > 0 && (
        <Box
        
            sx={{
            display: "grid",
            gridTemplateColumns:
                "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 3,
            }}
        >
            {visibleProducts.map((product, index) => {
            const title =
                valueFor(product, [
                "title",
                "name",
                "productname",
                "product_name",
                ]) || `Tech item ${index + 1}`;

            const image = valueFor(product, [
                "imageurl",
                "image_url",
                "image",
                "photo",
            ]);

            const price = valueFor(product, ["price"]);

            const description = valueFor(product, [
                "description",
                "details",
            ]);

            const seller =
                valueFor(product, [
                "sellername",
                "businessname",
                "seller",
                ]) || valueFor(product, ["user"]);

            const location = valueFor(product, ["location", "city"]);
            const categoryName = valueFor(product, ["category"]);
            const condition = valueFor(product, ["condition"]);

            const listingType = valueFor(product, [
                "listingtype",
                "sellertype",
            ]);

            const id = valueFor(product, ["_id", "id"]);

            return (
                <Card
                key={id || `${title}-${index}`}
                onClick={() =>{ 
                    console.log("Product clicked:", product);
                    console.log("Product name:", valueFor(product, [
                        "title",
                        "name",
                        "productname",
                        "product_name",
                    ]));

                    navigate("/purchase" , {state: {product}})
                }}
                sx={{ overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                    },
                 }}
                >
                {typeof image === "string" && image && (
                    <Box
                    component="img"
                    src={image}
                    alt={title}
                    loading="lazy"
                    sx={{
                        display: "block",
                        width: "100%",
                        height: 260, //ajust the height as needed
                        objectFit: "cover",
                        bgcolor: "grey.100",
                    }}
                    />
                )}

                {/* THE STACK */}
                <CardContent sx={{ p: 2 }}>
                    <Stack
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                    >
                    <Typography
                        component="h3"
                        variant="subtitle1"
                        sx={{
                            color: "#3d0f3e", 
                            lineHeight: 1.3 ,
                            mt: 1.5,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {title}
                    </Typography>

                    {(categoryName || condition || listingType) && (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {[
                            categoryName, condition, listingType === "peer-to-peer" ? 
                            "Pick up from seller" : "Shipping to buyer"

                        ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                    )}

                    {price !== undefined && (
                        <Typography
                        sx={{ fontWeight: 700, whiteSpace: "nowrap", justifyContent: "center" }}
                        >
                        {formatPrice(price)}
                        </Typography>
                    )}
                    </Stack>

                    

                    {/* {description && (
                    <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                            mt: 1.5,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {description}
                    </Typography>
                    )} */}

                    {(seller || location) && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {[seller, location].filter(Boolean).join(" · ")}
                    </Typography>
                    )}
                </CardContent>
                </Card>
            );
            })}
        </Box>
        )}

        {showAddButton && (<Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-product")}
        sx={{
            position: "fixed",
            right: 20,
            bottom: "2%",
            zIndex: 1000,
            width: 50,
            height: 50,
            minWidth: 50,
            borderRadius: "50%",
            padding: 0,
        }}
        >
            <AddIcon sx={{ fontSize: 50 }} />
        </Button>)}
        
    </Box>
  );
};

export default ProductListings;