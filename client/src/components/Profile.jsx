
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
  Chip
} from "@mui/material";
import { Avatar } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { 
    IconButton, 
    InputAdornment 
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import * as api from "../util/api";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [career, setCareer] = useState("");
  const [college, setCollege] = useState("");
  const [gender, setGender] = useState("");
  const [preferGender, setPreferGender] = useState("");
  const [image, setImage] = useState(null);
  const [member, setMember] = useState("");


  const navigate = useNavigate();

  const language = ["Java", "Python", "C++", "JavaScript", "SQL"];
  const [traits, settraits] = useState([]);
  const [preferLang, setPreferLang] = useState([]);
  
const handleMultiple = (e) => {
      const {
         target: { value },
      } = e;
      settraits(
         typeof value === "string" ? value.split(",") : value
      );
   };

   const handleLanguagePref = (e) => {
      const {
         target: { value },
      } = e;
      setPreferLang(
         typeof value === "string" ? value.split(",") : value
      );
   };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");        
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [savedUser, setSavedUser] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("userInfo");
    if (user) {
      const userData = JSON.parse(user);
      setSavedUser(userData);
      setUserName(userData.userName || "");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setBirthDay(userData.birthDay || "")
      setEmail(userData.email || "");
      setCity(userData.city || "");
      setCareer(userData.career || "");
      setCollege(userData.college || "");
      setGender(userData.gender || "");
      setPreferGender(userData.preferGender || "");
      setMember(userData.member || "");
      setImage(userData.profileImage || null);
    }
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

  const handleSave = async () => {
    if (!savedUser) {
      alert("No user session found.");
      return;
    }

    
    if(newPassword.length > 0 || confirmPassword.length > 0)
    {
      if (currentPassword !== savedUser.password)
      {
        alert("The current password you entered is incorrect. Changes not saved.");
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
      userName,
      firstName,
      lastName,
      birthDay,
      email,
      city,
      career,
      college,
      gender,
      preferGender,
      member,
      password: newPassword ? newPassword : savedUser.password,
      traits,
      preferLang,
      profileImage: image,
    };

    console.log("[Profile Update] Sending updated data to server:", updatedUser);

    try {
      const response = await api.users.updateUser(updatedUser);
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

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <Paper>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Avatar src={image}
                    sx={{ width: 100, height: 100, mb: 1, bgcolor: "#f680dc" }}/>
          <Button
            variant="outlined"
            component="label"
            sx={{ color: "#f680dc", borderColor: "#f680dc" }}>
            Change Profile Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Username" variant="outlined" fullWidth value={userName} 
          onChange={(e) => setUserName(e.target.value)}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="First Name" fullWidth value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField label="Last Name" fullWidth value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField label="Birth Day" fullWidth value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
            />
          </Box>

          <TextField label="Email" fullWidth value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField label="City" fullWidth value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField label="Career" fullWidth value={career}
            onChange={(e) => setCareer(e.target.value)}
          />
          <TextField label="College" fullWidth value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
              <Select
                name="gender" value={gender} onChange={(e) => setGender(e.target.value)} label="Gender">
                  <MenuItem value="Man">Man</MenuItem>
                  <MenuItem value="Women">Women</MenuItem>
                  <MenuItem value="TransMan">Transgender Man</MenuItem>
                  <MenuItem value="TransWomen">Transgender Women</MenuItem>
              </Select>
          </FormControl>

           <FormControl fullWidth>
            <InputLabel>Prefer Gender</InputLabel>
              <Select
               name="preferGender" value={preferGender} onChange={(e) => setPreferGender(e.target.value)} label="Prefer Gender">
                  <MenuItem value="Man">Man</MenuItem>
                  <MenuItem value="Women">Women</MenuItem>
                  <MenuItem value="TransMan">Transgender Man</MenuItem>
                  <MenuItem value="TransWomen">Transgender Women</MenuItem>
              </Select>
          </FormControl>

          <FormControl
               variant="standard"
               size="large"
               sx={{ m: 1, minWidth: 120 }}
               >
               <InputLabel id="select" label="Lang">
                  Select languages
               </InputLabel>
               <Select
                  multiple
                  value={traits}
                  onChange={handleMultiple}
                  renderValue={(selLang) => (
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selLang.map((value) => (
                           <Chip key={value} color="#FFC0CB" label={value} />
                        ))}
                     </Box>
                  )}
                  >
                  {language.map((lang) => (
                     <MenuItem key={lang} value={lang}>
                        {lang}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
          <FormControl
               variant="standard"
               size="large"
               sx={{ m: 1, minWidth: 120 }}
               >
               <InputLabel id="select" label="Lang">
                  Select prefered languages
               </InputLabel>
               <Select
                  multiple
                  value={preferLang}
                  onChange={handleLanguagePref}
                  renderValue={(selLang) => (
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selLang.map((value) => (
                           <Chip key={value} color="#FFC0CB" label={value} />
                        ))}
                     </Box>
                  )}
                  >
                  {language.map((lang) => (
                     <MenuItem key={lang} value={lang}>
                        {lang}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
          <Divider sx={{ my: 3 }}>
            <Typography color="textSecondary">Be Premium!</Typography>
          </Divider>

          <Button
            onClick={() => navigate('/payment')}
            variant="contained"
            sx={{
              borderRadius: "999px",
              px: 4,
              py: 1.5,
              backgroundColor: "#f680dc",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d46bb8",
              },
            }}
          >
              🪪 Upgrade to Premium
          </Button>
          
          <Divider sx={{ my: 3 }}>
            <Typography color="textSecondary">Security & Password</Typography>
          </Divider>

          <TextField fullWidth label="Current Password" type={showCurrentPassword ? "text" : "password"} value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            helperText="Enter your current password to verify"
            InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => passwordVisibility("current")}
                                    edge="end"
                                >
                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={newPassword !== "" && newPassword === savedUser?.password}
              helperText={
                newPassword !== "" && newPassword === savedUser?.password
                  ? "New password must differ from current"
                  : ""
              }
               InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => passwordVisibility("new")}
                      edge="end"
                      >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword !== "" && newPassword !== confirmPassword}
              helperText={
                confirmPassword !== "" && newPassword !== confirmPassword
                  ? "Passwords don't match"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => passwordVisibility("confirm")}
                      edge="end"
                      >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            sx={{ backgroundColor: "#f680dc", "&:hover": { backgroundColor: "#d46bb8" } }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
