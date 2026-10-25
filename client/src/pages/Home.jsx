
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { products } from "../util/api";
import ProductListings from "../components/ProductListing";

const Home = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const result = await products.getProducts();

        if (!Array.isArray(result)) {
          throw new Error("The product service returned an invalid response.");
        }

        if (active) {
          setProductList(result);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to retrieve products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 }, py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 1, color: "#3d0f3e", fontWeight: 700 }}
        >
          Welcome to the Maple Bay Marketplace
        </Typography>
      </Box>

      <ProductListings
        productList={productList}
        loading={loading}
        error={error}
      />
    </Box>
  );
};

export default Home;
