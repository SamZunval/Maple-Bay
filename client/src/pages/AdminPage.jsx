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

} from "@mui/material";
import { useState, useEffect} from "react";
import { Button, IconButton} from "@mui/material";
import { users,stats,products,report } from "../util/api";
const AdminPage = () => {
    const [statistics, setStats] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedReport, setSelectedReport] = useState("");
    const [userList, setUserList] = useState([]);
    const [reportList, setReportList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState({});
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
    <Box sx={{  mx: "auto", px: { xs: 2, sm: 3 } }}>
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
          <Grid item xs={6} md={3} key={index}>
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
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        {user.userType == "business" ? user.businessName: user.firstName + " " + user.lastName}
                    </Typography>
                    <Box
                    component="img"
                    src={user.profileImage}
                    alt={"Profile Picture"}
                    loading="lazy"
                    sx={{
                        display: "block",
                        width: "100%",
                        height: 260, //ajust the height as needed
                        objectFit: "cover",
                        bgcolor: "grey.100",
                    }}
                    />
                    <Button color="error" variant="contained" onClick={handleBan}>Ban User</Button>

            </Card>
            )}
        </Box>
        <Box sx={{ flex: 1 }}>
                {selectedProduct.imageUrl &&(
                <Card
                sx={{ overflow: "hidden",
                 }}
                >
                {typeof selectedProduct.imageUrl === "string" && selectedProduct.imageUrl && (
                    <Box
                    component="img"
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
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
                        {selectedProduct.title}
                    </Typography>

                    {(selectedProduct.categoryName || selectedProduct.condition || selectedProduct.listingType) && (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {[
                            selectedProduct.categoryName, selectedProduct.condition, selectedProduct.listingType === "peer-to-peer" ?
                            "Pick up from seller" : "Shipping to buyer"

                        ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                    )}

                    {selectedProduct.price !== undefined && (
                        <Typography
                        sx={{ fontWeight: 700, whiteSpace: "nowrap", justifyContent: "center" }}
                        >
                        {formatPrice(selectedProduct.price)}
                        </Typography>
                    )}
                    </Stack>
                </CardContent>
                </Card>
        )}
        </Box>
        </Box>
    </Paper>
      </Box>
    );
}
export default AdminPage;