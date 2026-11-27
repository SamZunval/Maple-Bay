import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import {
    TextField,
    Button,
    Stack,
    Box,
} from "@mui/material";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Paper,
  Divider,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { products, chatroom } from "../util/api";
import { users } from "../util/api";
import FlagIcon from "@mui/icons-material/Flag";
import ReportPage from "../components/ReportPage";
import VerifiedIcon from "@mui/icons-material/Verified";

function Product(props) {
    const { onClose, open, product,seller} = props;

  const handleClose = () => {
    onClose();
  };

  const [reportopen, setReportOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "null");
  const sellerEmail = String(product?.sellerEmail || product?.user || "")
    .trim()
    .toLowerCase();
  const isSeller =
    Boolean(userInfo?.email) &&
    sellerEmail === String(userInfo.email).trim().toLowerCase();

  //const [seller, setSeller] = useState(null);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleReportClickOpen = () => {
    setReportOpen(true);
  };

  const handleReportClose = () => {
    setReportOpen(false);
  };
  //console.log("Purchase page received:", product);

    const handlePurchase = async () => {

        navigate("/payment", { state: { product } });
    };

  const handleChat = async () => {
    if (!userInfo?.email) {
      setError("Please log in to contact the seller.");
      return;
    }

    try {
      const response = await chatroom.newChatRoom(userInfo, {
        ...product,
        user: product.sellerEmail || product.user,
      });
      if (!response.ok) {
        throw new Error("Unable to start a chat with the seller.");
      }
      navigate("/chat");
    } catch (err) {
      setError(err.message || "An error occurred while starting the chat.");
    }
  };

  const handleProfile = () => {
    navigate("/profile", {
      state: { sellerEmail: product.sellerEmail || product.user },
    });
  };

  return (
    <Dialog fullWidth maxWidth="1500" onClose={handleClose} open={open} closeAfterTransition disableRestoreFocus={true} slotProps={{
    backdrop: {
      transitionDuration: { exit: 0 } // Speeds up the DOM teardown
    }
  }}>
      <Box
      sx={{
        width: "100%",
        mx: "auto",
      }}
    >
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 3 }}
        alignItems="stretch"
        sx={{ flexWrap: "nowrap" }}
      >
        {/* PRODUCT IMAGE */}
        <Grid item xs={8} sx={{ minWidth: 0, flex: "2 1 0%",py:2,paddingLeft:2 }}>
          <Paper
            elevation={2}
            sx={{
              height: { xs: "350px", sm: "450px", md: "600px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              //backgroundColor: "#f5f5f5",
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
        <Grid item xs={4} sx={{ minWidth: 0, flex: "1 1 0%",py:2,paddingRight:2 }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              height: "100%",
              boxSizing: "border-box",
              
            }}
          >
            <Typography variant="h4" gutterBottom>
              {product.title ||
                product.name ||
                product.productName ||
                "Product"}
              <Tooltip title="Report Product">
                <IconButton onClick={handleReportClickOpen} color="error">
                  <FlagIcon />
                </IconButton>
                <ReportPage
                  open={reportopen}
                  onClose={handleReportClose}
                  reviewer={userInfo ? userInfo.email : ""}
                  reviewee={product.sellerEmail}
                  product={product._id}
                />
              </Tooltip>
            </Typography>
            <Divider sx={{ mb: 2 }} />

                        {/* SELLER INFO */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                            <Avatar
                                src={seller?.profileImage || ""}
                                alt={seller?.name || product.sellerName || "Seller"}
                                sx={{
                                    width: 55,
                                    height: 55,
                                }}
                            />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                  py: 1,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  justifyContent="left"
                >
                  Seller
                </Typography>

                {seller ? (
                  <Typography variant="body1" fontWeight="bold">
                    {`${seller.firstName || ""} ${seller.lastName || ""}`.trim() ||
                      seller.businessName ||
                      "Unknown Seller"}
                    {seller.accountVerified && (
                      <Tooltip title="Identity verification completed">
                        <VerifiedIcon
                          color="primary"
                          sx={{
                            ml: 0.75,
                            verticalAlign: "middle",
                            fontSize: "1em",
                          }}
                        />
                      </Tooltip>
                    )}
                  </Typography>
                ) : (
                  <CircularProgress size={20} />
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* BUTTNS */}
            {String(product.status || "").toLowerCase() === "active" &&
              !isSeller && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  {product.listingType === "peer-to-peer" ? (
                    <Button variant="contained" fullWidth onClick={handleChat}>
                      Chat
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handlePurchase}
                      disabled={purchasing}
                    >
                      {purchasing ? "Processing..." : "Buy Item"}
                    </Button>
                  )}

                  <Button variant="contained" fullWidth onClick={handleProfile}>
                    View Profile
                  </Button>
                </Box>
              )}
            {product.status === "awaiting-shipment" && (
              <Typography sx={{ mb: 2 }} color="text.secondary">
                Purchase placed. The seller has not shipped this item yet.
              </Typography>
            )}
            {product.status === "shipped" && (
              <Typography sx={{ mb: 2 }} color="text.secondary">
                This item is in transit. Track and confirm delivery in
                Transactions.
              </Typography>
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
              {product.description ||
                product.details ||
                "No description provided."}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>

    </Dialog>
  );
}
export default Product;
