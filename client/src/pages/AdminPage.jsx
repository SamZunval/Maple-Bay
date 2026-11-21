import { Navigate} from "react-router-dom";
import 
{ 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Divider, 
    Tooltip,
    TextField,
    MenuItem,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Button, IconButton,
    AccountCircleIcon

} from "@mui/material";
import { useState, useEffect} from "react";
import { users,stats,products,report } from "../util/api";

const AdminPage = () => {
    const [statistics, setStats] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedReport, setSelectedReport] = useState("");
    const [userList, setUserList] = useState([]);
    const [reportList, setReportList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState({});

    const [reportPage, setReportPage] = useState(1);
    const reportsPerPage = 5;
    const [openProduct, setOpenProduct] = useState(false);
    const [openBan, setOpenBan] = useState(false);

    const [user, setUser] = useState({});
    const formatPrice = (price) => {
        const amount = Number(price);
        return Number.isFinite(amount)
            ? new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
            }).format(amount)
        : price;
    };
    const handleBan = async () => {
        await report.banUser(selectedUser);
        var data = await report.getReportedUsers();
        //reload page
        setUserList(data);
        setIsDisabled(true);
        setSelectedUser("");
        setReportList([]);
        setSelectedReport("");
        setSelectedProduct({});
        setUser({});
    }

    useEffect(() => {
        const fetchStats = async () => {
            try {
                var data = await stats.getStats();
                const stat = [
                { number: data.numUsers, description: "Total Users" },
                { number: data.numReports, description: "Total Reports" },
                { number: data.numProducts, description: "Total Products" },
                { number: data.numProductsSold, description: "Products Sold" }
                ];
                setStats(stat);
                data = await report.getReportedUsers();
                setUserList(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    },[]);

    const fetchReports = async (email) => {
        try {
            var data = await report.getUserReports(email);
            setReportList(data);
            setIsDisabled(!data);
            data = await users.getUserByEmail(email);
            setUser(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

return (

<Box sx={{ maxWidth: "1600px", mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
    {/* TITLE */}
    <Paper
        sx={{
            maxWidth: "2000px",
            width: "100%",
            p: 1,
            boxShadow: 3,
            maxheight: "100px",
            height: "75%",
            backgroundColor: "#F0F0F0",
        }}
    >
        <Typography variant="h3" gutterBottom>
            {"Administrative Dashboard"}
        </Typography>

        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3} sx={{
        justifyContent: "center",
        alignItems: "center",
        }}>
        {statistics.map((stat, index) => (
          <Grid  key={index}>
            <Box sx={{ textAlign: "center", p: 1 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
              >
                {stat.number.toLocaleString()}
              </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {stat.description}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Paper>

    <Divider sx={{ mb: 2 }} />

    <Paper
        elevation={4}
        sx={{
            maxWidth: "2000px",
            width: "100%",
            p: 1,
            boxShadow: 3,
            maxheight: "100px",
            height: "75%",
        }}
    >
      {/* User Dropdown */}
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Select User
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
      <TextField
                        fullWidth
                        required
                        select
                        label="Reported User"
                        name="reportedUser"
                        value={selectedUser}
                        slotProps={{//fixes weird react labeling bug about not targetting an id
                            input: { id: "my-select-input" },
                            inputLabel: { htmlFor: "my-select-input" },
                        }}
                        onChange={async (e) => {setSelectedUser(e.target.value);await fetchReports(e.target.value)}}
                    >
                        {userList.map((reason) => (
                            <MenuItem key={reason.email} value={reason.email}>
                                {reason.email}
                            </MenuItem>
                        ))}
                    </TextField>
                    </Box>
                        <Box sx={{ flex: 1 }}>
      <TextField
                        fullWidth
                        required
                        select
                        label="User Reports"
                        name="reports"
                        value={selectedReport}
                        slotProps={{//fixes weird react labeling bug about not targetting an id
                            input: { id: "my-select-inpu2" },
                            inputLabel: { htmlFor: "my-select-inpu2" },
                        }}
                        onChange={async (e) => {
                            setSelectedReport(e.target.value);
                            if(e.target.value != ""){
                                var pro = reportList.find(item => item._id === e.target.value).product;
                                if(pro == ""){
                                    setSelectedProduct({});
                                }
                                else{
                                    var data = await products.getProduct(pro);
                                    setSelectedProduct(data);
                                }
                            }
                            
                        }}
                        disabled={isDisabled}
                    >
                        {reportList.map((rep) => (
                            <MenuItem key={rep._id} value={rep._id}>
                                {rep._id}
                            </MenuItem>
                        ))}
                    </TextField>
                    </Box>
    </Box>
       <Divider sx={{ mb: 2 }} />
        {selectedReport && (
            <Paper
      elevation={4}
      sx={{
        maxWidth: "2000px",
            width: "100%",
            p: 1,
            boxShadow: 3,
            maxheight: "100px",
            height: "75%",
      }}
    >
            <Typography variant="h6" fontWeight="bold" mb={1}>
                        {"Report Reason: " + reportList.find(item => item._id === selectedReport).reason}
            </Typography>
            <Typography variant="h6" fontWeight="bold" mb={1}>
                        {"Comments: " + reportList.find(item => item._id === selectedReport).comment}
            </Typography>
            </Paper>
        )}
      <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>

        <Box sx={{ flex: 1 }}>
            {user.userType && (
            <Card
                sx={{ overflow: "hidden",
                 }}
                >
                    {/* PROFILE PICTURE */}
                    {user.profileImage ? (
                        <Box
                            component="img"
                            src={user.profileImage}
                            alt="Profile Picture"
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <AccountCircleIcon
                            sx={{
                                fontSize: 60,
                                color: "grey.500",
                            }}
                        />
                    )}

                    {/* USERNAME */}
                    <Typography variant="body1" fontWeight="bold">
                        {user.userType == "business"
                            ? user.businessName
                            : user.firstName + " " + user.lastName}
                    </Typography>

                    {/* BAN BUTTON */}
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => setOpenBan(true)}
                    >
                        Ban User
                    </Button>
                </Box>
            )}
        </Box>

        <Divider sx={{ mb: 2 }} />
        {/* USER REPORTS LIST */}
        {reportList.length > 0 && (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    User Reports ({reportList.length})
                </Typography>

                {/* REPORT TABLE */}
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <strong>Report ID</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Reason</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Comment</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Product</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {reportList
                                .slice(
                                    (reportPage - 1) * reportsPerPage,
                                    reportPage * reportsPerPage
                                )
                                .map((report) => (
                                    <TableRow key={report._id}>
                                        <TableCell>
                                            {report._id}
                                        </TableCell>

                                        <TableCell>
                                            {report.reason}
                                        </TableCell>

                                        <TableCell>
                                            {report.comment || "No comment provided"}
                                        </TableCell>

                                        <TableCell>
                                           
                                                
                                                {report.product ? (
                                                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                    <typography variant="body2" sx={{ mb: 1 }}>
                                                        {report.product}
                                                    </typography>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ mb: 1,  width: "fit-content" }}
                                                        onClick={async () => {
                                                            var data = await products.getProduct(report.product);
                                                            setSelectedProduct(data);
                                                            setOpenProduct(true);
                                                        }}
                                                    >
                                                        View Product
                                                    </Button>
                                                  </Box>
                                                
                                                ) : (
                                                    "No product"
                                                )} 
                                            
                                           
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* PAGINATION */}
                {reportList.length > reportsPerPage && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <Pagination
                            count={Math.ceil(reportList.length / reportsPerPage)}
                            page={reportPage}
                            onChange={(event, value) => setReportPage(value)}
                            color="primary"
                        />
                    </Box>
                )}
            </Box>
        )}

        {reportList.length === 0 && selectedUser && (
            <Typography sx={{ mt: 3 }} color="text.secondary">
                No reports found for this user.
            </Typography>
        )}

    </Paper>

    {/* Product Dialog */}
    <Dialog
        open={openProduct}
        onClose={() => setOpenProduct(false)}
        fullWidth
        maxWidth="sm"
    >
        <DialogTitle>
            Product Information
        </DialogTitle>

        <DialogContent>
            {/* PRODUCT CARD */}
            {selectedProduct.imageUrl && (
                <Card sx={{ overflow: "hidden" }}>
                    {typeof selectedProduct.imageUrl === "string" &&
                        selectedProduct.imageUrl && (
                            <Box
                                component="img"
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.title}
                                loading="lazy"
                                sx={{
                                    display: "block",
                                    width: "100%",
                                    height: 260,
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
                                    lineHeight: 1.3,
                                    mt: 1.5,
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {selectedProduct.title}
                            </Typography>

                            {(selectedProduct.categoryName ||
                                selectedProduct.condition ||
                                selectedProduct.listingType) && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        {[
                                            selectedProduct.categoryName,
                                            selectedProduct.condition,
                                            selectedProduct.listingType === "peer-to-peer"
                                                ? "Pick up from seller"
                                                : "Shipping to buyer",
                                        ]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </Typography>
                                )}

                            {selectedProduct.price !== undefined && (
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                        justifyContent: "center",
                                    }}
                                >
                                    {formatPrice(selectedProduct.price)}
                                </Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </DialogContent>

        <DialogActions>
            <Button
                onClick={() => setOpenProduct(false)}
                sx={{ mr: 1, mb: 1 , justifyContent: "center", width: "100%"}}
                variant="contained"
            >
                Close
            </Button>
        </DialogActions>
    </Dialog>

    {/* Ban dialog*/}
    <Dialog
        open={openBan}
        onClose={() => setOpenBan(false)}
        maxWidth="xs"
        fullWidth
    >
        {/* TITLE */}
        <DialogTitle
            sx={{
                textAlign: "center",
                fontWeight: "bold",
                pb: 1,
            }}
        >
            Are you sure you want to ban this user?
        </DialogTitle>

        {/* BUTTONS */}
        <DialogActions
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                px: 3,
                pb: 3,
            }}
        >
            <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => {
                    // Handle ban logic here
                    handleBan();
                    setOpenBan(false);
                }}
            >
                Yes, ban this user
            </Button>

            <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => setOpenBan(false)}
            >
                No, cancel
            </Button>
        </DialogActions>
    </Dialog>

</Box>




);
}
export default AdminPage;