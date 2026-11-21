import { useState, useEffect } from "react";
//holy shit this is a lot of imports
//and we will add MORE
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
  Alert,
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
  Rating,
  Fade,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import FlagIcon from "@mui/icons-material/Flag";
import ReportPage from "../components/ReportPage";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import duycky from "../assets/Ducky.png";
import ProductListings from "../components/ProductListing";
import ReviewPage from "../components/ReviewPage";

import { products, review } from "../util/api";
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
  // Variable to keep track of report page state
  const [reportopen, setReportOpen] = useState(false);
  const handleReportClickOpen = () => {
    setReportOpen(true);
  };

  const handleReportClose = () => {
    setReportOpen(false);
  };
  {
    /* Rudy code */
  }
  const [productList, setProductList] = useState([]);
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
  const [lastName] = useState(savedUser?.lastName || "");
  const currentUserEmail = savedUser?.email;
  const [image, setImage] = useState(savedUser?.profileImage || null);
  const [userType] = useState(savedUser?.userType || "");

  {
    /* Change boxes */
  }
  const [showProducts, setshowProducts] = useState(true);
  const [showAbout, setshowAbout] = useState(false);
  const [showFeedback, setshowFeedback] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionCategory, setTransactionCategory] = useState("bought");
  const [transactionError, setTransactionError] = useState("");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(null);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);

  {
    /*Add product variables */
  }

  const location = useLocation();
  const navigate = useNavigate();
  const sellerEmail = location.state?.sellerEmail;
  const isPublicProfile = Boolean(sellerEmail);
  const profileEmail = sellerEmail || currentUserEmail;
  const displayedUser = isPublicProfile ? profileUser : savedUser;

  {
    /* Edit variables code */
  }
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [verificationDocumentType, setVerificationDocumentType] = useState("");
  const [verificationConfirmed, setVerificationConfirmed] = useState(false);
  const [verificationImage, setVerificationImage] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    password: "",
    province: "",
    city: "",
    userType: "personal",
    about: "",
  });

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

  useEffect(() => {
    if (!profileEmail) {
      setFeedbackLoading(false);
      return;
    }

    let active = true;
    setFeedbackLoading(true);

    const loadReviews = async () => {
      try {
        if (!isPublicProfile) {
          const reviewsGiven = await review.getUserReviews(profileEmail, true);
          if (active) {
            setReviewedProducts(
              reviewsGiven.map((item) => String(item.product)),
            );
          }
        }

        const reviewsReceived = await review.getUserReviews(profileEmail);
        const reviewsWithNames = await Promise.all(
          reviewsReceived.map(async (item) => {
            const user = await users.getUserByEmail(item.reviewer);
            return {
              ...item,
              reviewerName:
                user?.businessName ||
                `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                item.reviewer,
            };
          }),
        );
        if (active) {
          setReceivedReviews(reviewsWithNames);
        }
      } catch (err) {
        console.error("Error loading profile reviews:", err);
      } finally {
        if (active) {
          setFeedbackLoading(false);
        }
      }
    };

    loadReviews();
    return () => {
      active = false;
    };
  }, [profileEmail, isPublicProfile]);

  useEffect(() => {
    let active = true;
    setProfileUser(null);

    if (sellerEmail) {
      users
        .getUserByEmail(sellerEmail)
        .then((user) => {
          if (active) {
            setProfileUser(user);
          }
        })
        .catch((err) => {
          console.error("Error loading profile:", err);
        });
    }

    return () => {
      active = false;
    };
  }, [sellerEmail]);

  const userEmail = String(currentUserEmail || "")
    .trim()
    .toLowerCase();
  const transactionHistory = productList.filter((product) => {
    const status = String(valueFor(product, ["status"]) || "").toLowerCase();
    const buyerEmail = String(valueFor(product, ["buyeremail"]) || "")
      .trim()
      .toLowerCase();
    const sellerEmail = String(
      valueFor(product, ["selleremail"]) || valueFor(product, ["user"]) || "",
    )
      .trim()
      .toLowerCase();

    if (!userEmail) return false;
    if (transactionCategory === "shipping") {
      return (
        ["awaiting-shipment", "shipped"].includes(status) &&
        (buyerEmail === userEmail || sellerEmail === userEmail)
      );
    }

    return (
      status === "sold" &&
      (transactionCategory === "bought" ? buyerEmail : sellerEmail) ===
        userEmail
    );
  });

  const updateShipmentStatus = async (product, status) => {
    setTransactionError("");
    const updatedProduct = {
      ...product,
      status,
    };

    try {
      const response = await products.updateProduct(updatedProduct);
      if (!response.ok) {
        throw new Error("Unable to update the shipment status.");
      }
      setProductList((previous) =>
        previous.map((item) =>
          String(valueFor(item, ["_id", "id"])) ===
          String(valueFor(product, ["_id", "id"]))
            ? updatedProduct
            : item,
        ),
      );
    } catch (err) {
      setTransactionError(
        err.message || "Unable to update the shipment status.",
      );
    }
  };

  useEffect(() => {
    if (!showTransactions || transactionCategory !== "shipping") return;

    let active = true;
    const refreshShipments = async () => {
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
          setTransactionError(
            err.message || "Unable to refresh shipment status.",
          );
        }
      }
    };

    refreshShipments();
    const interval = window.setInterval(refreshShipments, 10000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [showTransactions, transactionCategory]);

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
      profileImage: image,
      email: registerData.email !== "" ? registerData.email : savedUser.email,
      about: registerData.about !== "" ? registerData.about : savedUser.about,
    };

    //Many logs for testing
    // console.log(
    //   "[Profile Update] Sending updated data to server:",
    //   updatedUser,
    // );
    // console.log("[registerData]:", registerData);

    // console.log("Email used for update:", updatedUser.email);
    // console.log("Original saved email:", savedUser.email);
    // console.log("Form email:", registerData.email);

    try {
      const response = await users.updateUser(updatedUser);
      if (response.ok) {
        sessionStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setSavedUser(updatedUser);
        setImage(updatedUser.profileImage);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        console.log("Profile updated successfully!");
        window.location.reload();
      } else {
        console.log("Failed to update profile on the server.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      console.log("An error occurred while saving.");
    }
  };

  const handleButtonChange = (event, newType) => {
    setRegisterData({ ...registerData, ["userType"]: newType });
  };

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleVerifyAccount = async () => {
    if (
      !verificationDocumentType ||
      !verificationConfirmed ||
      !verificationImage
    )
      return;

    setVerificationError("");
    const verifiedUser = {
      ...savedUser,
      accountVerified: true,
      verificationDocumentType,
      verificationDate: new Date().toISOString(),
    };

    setVerifyingAccount(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const documentResponse = await users.submitVerification({
        userId: savedUser._id,
        documentType: verificationDocumentType,
        imageData: verificationImage,
      });
      if (!documentResponse.ok) {
        throw new Error("Unable to save the identity document.");
      }

      const response = await users.updateUser(verifiedUser);
      if (response.ok) {
        sessionStorage.setItem("userInfo", JSON.stringify(verifiedUser));
        setSavedUser(verifiedUser);
        setOpenVerification(false);
        setVerificationConfirmed(false);
        setVerificationImage("");
      } else {
        throw new Error("Unable to update the account verification status.");
      }
    } catch (error) {
      console.error("Error verifying account:", error);
      setVerificationError(error.message || "Unable to verify the account.");
    } finally {
      setVerifyingAccount(false);
    }
  };

  //Begin html
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
            src={
              isPublicProfile
                ? displayedUser?.profileImage || duycky
                : image || duycky
            }
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
            {isPublicProfile
              ? displayedUser?.businessName ||
                `${displayedUser?.firstName || ""} ${displayedUser?.lastName || ""}`.trim()
              : businessName || `${firstName} ${lastName}`}
            {(isPublicProfile
              ? displayedUser?.accountVerified
              : savedUser?.accountVerified) && (
              <Tooltip title="Identity verification completed">
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    ml: 0.75,
                  }}
                >
                  <VerifiedIcon
                    color="primary"
                    sx={{ verticalAlign: "middle", fontSize: "1.1em" }}
                  />
                  <Typography
                    component="span"
                    variant="caption"
                    color="primary"
                    sx={{ ml: 0.25, fontWeight: 700 }}
                  >
                    Verified
                  </Typography>
                </Box>
              </Tooltip>
            )}
            {isPublicProfile && (
              <Tooltip title="Report Product">
                <IconButton onClick={handleReportClickOpen} color="error">
                  <FlagIcon />
                </IconButton>
                <ReportPage
                  open={reportopen}
                  onClose={handleReportClose}
                  reviewer={
                    JSON.parse(sessionStorage.getItem("userInfo") || "null")
                      .email
                  }
                  reviewee={profileEmail}
                  product={""}
                />
              </Tooltip>
            )}
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
            {(isPublicProfile
              ? displayedUser?.userType
              : userType
            )?.toLowerCase() === "business"
              ? "Business"
              : "Personal"}{" "}
            account
          </Typography>

          {/* edit button */}

          {!isPublicProfile && (
            <Box
              sx={{
                gridColumn: 2,
                gridRow: 3,
                justifySelf: "end",
                display: "flex",
                gap: 1,
              }}
            >
              {!savedUser?.accountVerified && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setVerificationError("");
                    setOpenVerification(true);
                  }}
                >
                  ✅ Verify Account
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setOpenEditProfile(true);
                }}
              >
                ✏️ Edit Profile
              </Button>
            </Box>
          )}
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
        {!isPublicProfile && (
          <>
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
          </>
        )}
      </Paper>

      {/* Divider */}
      <Divider sx={{ width: "95%", my: 3 }} />

      {/*----------------------- Product Listings ---------------------------*/}
      <Fade in={showProducts} timeout={200} mountOnEnter unmountOnExit>
        <Box
          sx={{
            maxWidth: "2000px",
            width: "95%",
            mx: "auto",
          }}
        >
          <ProductListings
            productList={productList}
            currentUserEmail={profileEmail}
            loading={loading}
            error={error}
            filterByUser={true}
            showAddButton={!isPublicProfile}
          />
        </Box>
      </Fade>

      {/*Transaction history */}
      <Fade
        in={showTransactions && !isPublicProfile}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
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
            <ToggleButton value="shipping">Shipping</ToggleButton>
          </ToggleButtonGroup>
          {transactionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {transactionError}
            </Alert>
          )}
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : transactionHistory.length === 0 ? (
            <Typography color="text.secondary">
              No {transactionCategory} transactions yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 3,
              }}
            >
              {transactionHistory.map((product) => (
                <Card
                  key={valueFor(product, ["_id", "id"])}
                  onClick={() => navigate("/purchase", { state: { product } })}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
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
                    {(() => {
                      const status = String(
                        valueFor(product, ["status"]) || "",
                      ).toLowerCase();
                      const sellerEmail = String(
                        valueFor(product, ["selleremail"]) ||
                          valueFor(product, ["user"]) ||
                          "",
                      )
                        .trim()
                        .toLowerCase();
                      const isSeller = sellerEmail === userEmail;

                      return transactionCategory === "shipping" ? (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Shipment status:{" "}
                            {status === "shipped"
                              ? "In transit"
                              : "Awaiting shipment"}
                          </Typography>
                          {isSeller && status === "awaiting-shipment" && (
                            <Button
                              onClick={(event) => {
                                event.stopPropagation();
                                updateShipmentStatus(product, "shipped");
                              }}
                            >
                              Mark as shipped
                            </Button>
                          )}
                          {!isSeller && status === "shipped" && (
                            <Button
                              onClick={(event) => {
                                event.stopPropagation();
                                updateShipmentStatus(product, "sold");
                              }}
                            >
                              Confirm delivery
                            </Button>
                          )}
                          {isSeller && status === "shipped" && (
                            <Typography variant="body2" color="text.secondary">
                              Waiting for the buyer to confirm delivery.
                            </Typography>
                          )}
                        </>
                      ) : null;
                    })()}
                    <Typography component="h3" variant="h6">
                      {valueFor(product, ["title"]) || "Marketplace item"}
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {formatPrice(valueFor(product, ["price"]))}
                    </Typography>
                    {transactionCategory !== "shipping" && (
                      <Typography variant="body2" color="text.secondary">
                        {transactionCategory === "bought"
                          ? `Seller: ${valueFor(product, ["sellername"]) || valueFor(product, ["user"])}`
                          : `Buyer: ${valueFor(product, ["buyeremail"])}`}
                      </Typography>
                    )}
                    {transactionCategory === "bought" &&
                      reviewedProducts &&
                      !reviewedProducts.includes(
                        String(valueFor(product, ["_id", "id"])),
                      ) && (
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            setReviewTarget({
                              reviewee:
                                valueFor(product, ["selleremail"]) ||
                                valueFor(product, ["user"]),
                              product: valueFor(product, ["_id", "id"]),
                            });
                          }}
                        >
                          Review this item
                        </Button>
                      )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
          <ReviewPage
            open={Boolean(reviewTarget)}
            onClose={() => setReviewTarget(null)}
            reviewer={currentUserEmail}
            onSubmitted={() =>
              setReviewedProducts((previous) => [
                ...previous,
                String(reviewTarget.product),
              ])
            }
            reviewee={reviewTarget?.reviewee}
            product={reviewTarget?.product}
          />
        </Box>
      </Fade>

      {/* About Section */}
      <Fade in={showAbout} timeout={200} mountOnEnter unmountOnExit>
        <Box
          sx={{
            maxWidth: "2000px",
            width: "95%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: 4,
          }}
        >
          <Box
            sx={{
              backgroundColor: "secondary.main",
              borderRadius: 4,
              border: "1px solid #eadbea",
              p: { xs: 3, sm: 4 },
              boxShadow: "0px 3px 12px rgba(61, 15, 62, 0.06)",
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              sx={{
                mb: 3,
                color: "#3d0f3e",
                fontWeight: "bold",
              }}
            >
              About Me
            </Typography>

            {/* Biography */}
            <Box sx={{ mb: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <InfoOutlinedIcon sx={{ color: "primary" }} />
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="#3d0f3e"
                >
                  Introduction
                </Typography>
              </Stack>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  pl: 4,
                }}
              >
                {(isPublicProfile ? displayedUser?.about : savedUser?.about) ||
                  "No about information added yet."}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "#eadbea", my: 2 }} />

            {/* Location */}
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <LocationOnOutlinedIcon sx={{ color: "primary" }} />
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="#3d0f3e"
                >
                  Location
                </Typography>
              </Stack>

              <Typography
                variant="body1"
                sx={{ color: "text.secondary", pl: 4 }}
              >
                {(isPublicProfile
                  ? displayedUser?.province
                  : savedUser?.province) &&
                (isPublicProfile ? displayedUser?.city : savedUser?.city)
                  ? `${isPublicProfile ? displayedUser.city : savedUser.city}, ${isPublicProfile ? displayedUser.province : savedUser.province}`
                  : "No location information added yet."}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Feedback Section */}
      <Fade in={showFeedback} timeout={200} mountOnEnter unmountOnExit>
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
          {feedbackLoading ? (
            <Stack alignItems="center" sx={{ py: 6 }}>
              <CircularProgress />
            </Stack>
          ) : receivedReviews.length === 0 ? (
            <Typography color="text.secondary">No reviews yet.</Typography>
          ) : (
            <Stack spacing={2}>
              <Typography>
                Average rating:{" "}
                {(
                  receivedReviews.reduce(
                    (total, item) => total + Number(item.value),
                    0,
                  ) / receivedReviews.length
                ).toFixed(1)}{" "}
                / 5
              </Typography>
              {receivedReviews.map((item) => (
                <Paper key={item._id} sx={{ p: 2 }}>
                  <Typography>
                    Item:{" "}
                    {valueFor(
                      productList.find(
                        (product) =>
                          String(valueFor(product, ["_id", "id"])) ===
                          String(item.product),
                      ) || {},
                      ["title"],
                    ) || item.product}
                  </Typography>
                  <Typography>From: {item.reviewerName}</Typography>
                  <Rating value={Number(item.value)} readOnly />
                  <Typography>{item.comment}</Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Fade>

      <Divider sx={{ width: "95%", my: 3 }} />

      {/*------------------------- Account Verification ------------------------------------------------*/}
      <Dialog
        open={!isPublicProfile && openVerification}
        onClose={() => setOpenVerification(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Verify your account</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            Complete verification to show buyers that your seller profile is
            trusted.
          </Typography>
          {verificationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {verificationError}
            </Alert>
          )}
          <TextField
            select
            fullWidth
            required
            label="Identity document"
            value={verificationDocumentType}
            onChange={(event) =>
              setVerificationDocumentType(event.target.value)
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="Canadian driver's licence">
              Canadian driver's licence
            </MenuItem>
            <MenuItem value="Passport">Passport</MenuItem>
            <MenuItem value="Provincial ID">Provincial ID</MenuItem>
          </TextField>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            {verificationImage && (
              <Box
                component="img"
                src={verificationImage}
                alt="Identity document preview"
                sx={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "contain",
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: "#f5f5f5",
                }}
              />
            )}
            <Button
              variant="outlined"
              component="label"
              disabled={verifyingAccount}
            >
              {verificationImage
                ? "Replace document"
                : "Upload identity document"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (!file) return;
                  if (
                    !["image/jpeg", "image/png", "image/webp"].includes(
                      file.type,
                    )
                  ) {
                    setVerificationError("Upload a JPG, PNG, or WebP image.");
                    return;
                  }
                  if (file.size > 4 * 1024 * 1024) {
                    setVerificationError(
                      "The document image must be 4 MB or smaller.",
                    );
                    return;
                  }
                  setVerificationError("");
                  const reader = new FileReader();
                  reader.onload = () => setVerificationImage(reader.result);
                  reader.onerror = () =>
                    setVerificationError("Unable to read the selected image.");
                  reader.readAsDataURL(file);
                }}
              />
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={verificationConfirmed}
                onChange={(event) =>
                  setVerificationConfirmed(event.target.checked)
                }
                disabled={verifyingAccount}
              />
            }
            label="I confirm that the information provided is accurate."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenVerification(false)}
            color="inherit"
            disabled={verifyingAccount}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={
              !verificationDocumentType ||
              !verificationConfirmed ||
              !verificationImage ||
              verifyingAccount
            }
            onClick={handleVerifyAccount}
          >
            {verifyingAccount ? (
              <>
                <CircularProgress size={18} sx={{ mr: 1 }} />
                Checking...
              </>
            ) : (
              "Complete verification"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/*------------------------- Edit Profile Modle ------------------------------------------------*/}
      <Dialog
        open={!isPublicProfile && openEditProfile}
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
            name="about"
            multiline
            rows={4}
            fullWidth
            value={registerData.about}
            onChange={handleChange}
            placeholder="Tell people a little about yourself..."
            sx={{ mb: 2 }}
          />

          {/* Personal Name Fields */}
          {userType === "personal" && (
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
          {userType === "business" && (
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
        </DialogContent>

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
