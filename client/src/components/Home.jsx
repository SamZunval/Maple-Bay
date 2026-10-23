import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { products } from "../util/api";

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

const Home = () => {
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
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

  const categories = [
    ...new Set(
      productList
        .map((product) => valueFor(product, ["category"]))
        .filter((value) => typeof value === "string" && value.trim()),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const query = search.trim().toLowerCase();
  const visibleProducts = productList.filter((product) => {
    if (String(valueFor(product, ["status"]) || "").trim().toLowerCase() !== "active") {
      return false;
    }
    const productCategory = valueFor(product, ["category"]);
    if (category !== "all" && productCategory !== category) {
      return false;
    }
    if (!query) {
      return true;
    }
    return Object.values(product).some(
      (value) =>
        (typeof value === "string" || typeof value === "number") &&
        String(value).toLowerCase().includes(query),
    );
  });

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

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search listings"
          placeholder="Laptop, phone, tablet, etc."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FormControl sx={{ minWidth: { xs: "100%", sm: 220 } }}>
          <InputLabel id="listing-category-label">Category</InputLabel>
          <Select
            labelId="listing-category-label"
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
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

      <Typography component="h2" variant="h5" sx={{ mb: 2, color: "#3d0f3e" }}>
        Listings
      </Typography>

      {loading && (
        <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
          <CircularProgress />
          <Typography color="text.secondary">Loading listings…</Typography>
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
          <Alert severity="info">No listings match your search.</Alert>
        )}

      {!loading && !error && visibleProducts.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
            const description = valueFor(product, ["description", "details"]);
            const seller =
              valueFor(product, ["sellername", "businessname", "seller"]) ||
              valueFor(product, ["user"]);
            const location = valueFor(product, ["location", "city"]);
            const categoryName = valueFor(product, ["category"]);
            const condition = valueFor(product, ["condition"]);
            const listingType = valueFor(product, [
              "listingtype",
              "sellertype",
            ]);
            const id = valueFor(product, ["_id", "id"]);

            return (
              <Card key={id || `${title}-${index}`} sx={{ overflow: "hidden" }}>
                {typeof image === "string" && image && (
                  <Box
                    component="img"
                    src={image}
                    alt={title}
                    loading="lazy"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      bgcolor: "grey.100",
                    }}
                  />
                )}
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{ color: "#3d0f3e", lineHeight: 1.3 }}
                    >
                      {title}
                    </Typography>
                    {price !== undefined && (
                      <Typography
                        sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                      >
                        {formatPrice(price)}
                      </Typography>
                    )}
                  </Stack>

                  {(categoryName || condition || listingType) && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {[categoryName, condition, listingType]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                  )}
                  {description && (
                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 1.5,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                      }}
                    >
                      {description}
                    </Typography>
                  )}
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
    </Box>
  );
};

export default Home;
