import { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import duycky from "../assets/Ducky.png";

import { products } from "../util/api";
import { users } from "../util/api";

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

const Profile = () => {
  {
    /* Rudy code */
  }
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  {
    /* User Info States */
  }

  /*SAVED USERS keeps all the orginial values form session storage*/
  const [savedUser, setSavedUser] = useState(() => {
    const user =
      typeof window !== "undefined" ? sessionStorage.getItem("userInfo") : null;
    return user ? JSON.parse(user) : null;
  });

  const [businessName, setBusinessName] = useState(
    savedUser?.businessName || "",
  );
  const [firstName, setFirstName] = useState(savedUser?.firstName || "");
  const [province, setProvince] = useState(savedUser?.province || "");
  const [city, setCity] = useState(savedUser?.city || "");
  const [lastName, setLastName] = useState(savedUser?.lastName || "");
  const [email, setEmail] = useState(savedUser?.email || "");
  const [image, setImage] = useState(savedUser?.profileImage || null);
  const [userType, setUserType] = useState(savedUser?.userType || "");

  {
    /* Change boxes */
  }
  const [showProducts, setshowProducts] = useState(true);
  const [showAbout, setshowAbout] = useState(false);
  const [showFeedback, setshowFeedback] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionCategory, setTransactionCategory] = useState("bought");

  {
    /* Edit variables code */
  }
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [about, setAbout] = useState("");

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    password: "",
    province: "",
    city: "",
    userType: "personal",
  });

  const [uType, setuType] = useState("personal");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log(savedUser);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 180; // was 300
        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.4);

        setImage(compressedBase64);
      };
    };

    reader.readAsDataURL(file);
  };

  const passwordVisibility = (field) => {
    if (field === "current") setShowCurrentPassword(!showCurrentPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  {
    /* Update user */
  }
  const handleSave = async () => {
    if (newPassword.length > 0 || confirmPassword.length > 0) {
      if (currentPassword !== savedUser.password) {
        alert(
          "The current password you entered is incorrect. Changes not saved.",
        );
        return;
      }

      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          alert("The new passwords do not match.");
          return;
        }
        if (newPassword === savedUser.password) {
          alert("The new password cannot be the same as the current one.");
          return;
        }
      }
    }

    const updatedUser = {
      ...savedUser,
      firstName:
        registerData.firstName !== ""
          ? registerData.firstName
          : savedUser.firstName,
      lastName:
        registerData.lastName !== ""
          ? registerData.lastName
          : savedUser.lastName,
      city: registerData.city !== "" ? registerData.city : savedUser.city,
      province:
        registerData.province !== ""
          ? registerData.province
          : savedUser.province,
      password:
        registerData.password !== ""
          ? registerData.password
          : savedUser.password,
      profileImage:
        registerData.profileImage !== ""
          ? registerData.profileImage
          : savedUser.profileImage,
      email: registerData.email !== "" ? registerData.email : savedUser.email,
    };

    console.log(
      "[Profile Update] Sending updated data to server:",
      updatedUser,
    );
    console.log("[registerData]:", registerData);

    console.log("Email used for update:", updatedUser.email);
    console.log("Original saved email:", savedUser.email);
    console.log("Form email:", registerData.email);
    try {
      const response = await users.updateUser(updatedUser);
      if (response.ok) {
        sessionStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setSavedUser(updatedUser);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile on the server.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while saving.");
    }
  };

  const handleButtonChange = (event, newType) => {
    if (newType !== null) {
      setuType(newType);
    }
    setRegisterData({ ...registerData, ["userType"]: newType });
  };

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  {
    /*rudy code*/
  }

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        mt: 2,
        mb: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: "2000px",
          width: "95%",
          p: 1,
          boxShadow: 3,
          maxheight: "100px",
          height: "75%",
          backgroundColor: "#F0F0F0",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "100px auto",
            gridTemplateRows: "auto auto auto",
            alignItems: "start",
            columnGap: 1,
          }}
        >
          {/* Image */}
          <Box
            component="img"
            src={image ? image : duycky}
            alt="Company Logo"
            sx={{
              width: "100%",
              maxWidth: 100,
              height: 100,
              objectFit: "contain",
              borderRadius: "50%",
              padding: 0,
              gridColumn: "1",
              gridRow: "1 / 4",
            }}
          />

          {/*Name text */}
          <Typography
            variant="h6"
            sx={{
              gridColumn: 2,
              gridRow: 1,
              fontWeight: "bold",
              textAlign: "left",
              mt: 0,
            }}
          >
            {businessName ? businessName : firstName + " " + lastName}
          </Typography>

          {/*Additional text */}
          <Typography
            variant="body2"
            sx={{
              gridColumn: 2,
              gridRow: 3,
              textAlign: "left",
              alignSelf: "center",
            }}
          >
            {userType?.toLowerCase() === "business" ? "Business" : "Personal"}{" "}
            account
          </Typography>

          {/* edit button */}

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenEditProfile(true);
            }}
            sx={{ gridColumn: 2, gridRow: 3, justifySelf: "end", mt: 1 }}
          >
            ✏️ Edit Profile
          </Button>
        </Box>
      </Paper>

      {/*Selection buttons */}
      <Paper
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignSelf: "flex-start",
          mt: 2,
          ml: 5,
        }}
      >
        <Button
          variant="text"
          color="black"
          onClick={() => {
            setshowProducts(true);
            setshowAbout(false);
            setshowFeedback(false);
            setShowTransactions(false);
          }}
        >
          Shop
        </Button>
        <Divider orientation="vertical" flexItem />

        <Button
          variant="text"
          color="black"
          onClick={() => {
            setshowAbout(true);
            setshowProducts(false);
            setshowFeedback(false);
            setShowTransactions(false);
          }}
        >
          About
        </Button>
        <Divider orientation="vertical" flexItem />

        <Button
          variant="text"
          color="black"
          onClick={() => {
            setshowFeedback(true);
            setshowAbout(false);
            setshowProducts(false);
            setShowTransactions(false);
          }}
        >
          Feedback
        </Button>
        <Divider orientation="vertical" flexItem />

        <Button
          variant="text"
          color="black"
          onClick={() => {
            setShowTransactions(true);
            setshowProducts(false);
            setshowAbout(false);
            setshowFeedback(false);
          }}
        >
          Transactions
        </Button>
      </Paper>

      {/* Divider */}
      <Divider sx={{ width: "95%", my: 3 }} />

      {/* Product Listings */}
      {showProducts && (
        <Box
          sx={{
            maxWidth: "2000px",
            width: "95%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: 5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 4 }}
          >
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

          <Typography
            component="h2"
            variant="h5"
            sx={{ mb: 2, color: "#3d0f3e" }}
          >
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
                const description = valueFor(product, [
                  "description",
                  "details",
                ]);
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
                  <Card
                    key={id || `${title}-${index}`}
                    sx={{ overflow: "hidden" }}
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
          {/* Add product button */}

          <Button
            variant="contained"
            color="primary"
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
          </Button>
        </Box>
      )}

      {showTransactions && (
        <Box
          sx={{
            maxWidth: "2000px",
            width: "95%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: 5,
          }}
        >
          <Typography
            component="h2"
            variant="h5"
            sx={{ mb: 2, color: "#3d0f3e" }}
          >
            Transactions
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={transactionCategory}
            onChange={(_event, value) => value && setTransactionCategory(value)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="bought">Bought</ToggleButton>
            <ToggleButton value="sold">Sold</ToggleButton>
          </ToggleButtonGroup>
          {(() => {
            const currentEmail = savedUser?.email?.toLowerCase();
            const history = productList.filter((product) => {
              if (
                String(valueFor(product, ["status"])).toLowerCase() !== "sold"
              ) {
                return false;
              }
              const relevantEmail =
                transactionCategory === "bought"
                  ? valueFor(product, ["buyeremail"])
                  : valueFor(product, ["user"]);
              return String(relevantEmail || "").toLowerCase() === currentEmail;
            });

            if (history.length === 0) {
              return (
                <Typography color="text.secondary">
                  No {transactionCategory} transactions yet.
                </Typography>
              );
            }

            return (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 3,
                }}
              >
                {history.map((product) => (
                  <Card key={valueFor(product, ["_id", "id"])}>
                    {valueFor(product, ["imageurl", "image_url"]) && (
                      <Box
                        component="img"
                        src={valueFor(product, ["imageurl", "image_url"])}
                        alt={valueFor(product, ["title"]) || "Transaction item"}
                        sx={{
                          display: "block",
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <CardContent>
                      <Typography component="h3" variant="h6">
                        {valueFor(product, ["title"]) || "Marketplace item"}
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>
                        {formatPrice(valueFor(product, ["price"]))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {transactionCategory === "bought"
                          ? `Seller: ${valueFor(product, ["sellername"]) || valueFor(product, ["user"])}`
                          : `Buyer: ${valueFor(product, ["buyeremail"])}`}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            );
          })()}
        </Box>
      )}

      {/* About Section */}
      {showAbout && (
        <Box
          sx={{
            maxWidth: "2000px",
            width: "95%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: 5,
          }}
        >
          <Typography
            component="h2"
            variant="h5"
            sx={{ mb: 2, color: "#3d0f3e" }}
          >
            About
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This is the about section. You can add information about your
            business or personal profile here.
          </Typography>
        </Box>
      )}

      {/* Feedback Section */}
      {showFeedback && (
        <Box
          sx={{
            maxWidth: "2000px",
            width: "95%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: 5,
          }}
        >
          <Typography
            component="h2"
            variant="h5"
            sx={{ mb: 2, color: "#3d0f3e" }}
          >
            Feedback
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This is the feedback section.
          </Typography>
        </Box>
      )}

      {/*------------------------- Edit Profile Modle ------------------------------------------------*/}
      <Dialog
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Profile</DialogTitle>

        <DialogContent>
          {/* Profile Image */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
              mt: 1,
            }}
          >
            <Avatar
              src={image}
              sx={{
                width: 100,
                height: 100,
                mb: 1,
                bgcolor: "black",
              }}
            />

            <Button
              variant="outlined"
              component="label"
              sx={{ color: "black", borderColor: "black" }}
            >
              Upload new Profile Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {/* About Section */}
          <TextField
            label="About"
            multiline
            rows={4}
            fullWidth
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            placeholder="Tell people a little about yourself..."
          />
        </DialogContent>

        {/* Personal or Business */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            width: "100%",
            backgroundColor: "#f0f0f0",
            borderRadius: "30px",
            padding: "4px",
            mb: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              left: uType === "personal" ? "1%" : "50%",
              width: "calc(50% - 1%)",
              backgroundColor: "var(--primary-color)",
              borderRadius: "30px",
              transition: "left 0.3s ease",
            }}
          />

          <ToggleButtonGroup
            color="primary"
            value={uType}
            exclusive
            onChange={handleButtonChange}
            sx={{
              display: "flex",
              width: "100%",
              position: "relative",
              zIndex: 1,
              "& .MuiToggleButtonGroup-grouped": {
                flex: 1,
                border: "none",
                borderRadius: "30px !important",
                padding: "8px 24px",
              },
              "& .Mui-selected": {
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color) !important",
              },
            }}
          >
            <ToggleButton value="personal">Personal</ToggleButton>
            <ToggleButton value="business">Business</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Personal Name Fields */}
        {uType === "personal" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={registerData.firstName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={registerData.lastName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {/* Business Name */}
        {uType === "business" && (
          <TextField
            fullWidth
            label="Business Name"
            name="businessName"
            value={registerData.businessName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        )}

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={registerData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* Location Fields */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={registerData.city}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Province"
            name="province"
            value={registerData.province}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </Box>

        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              handleSave();
              setOpenEditProfile(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
