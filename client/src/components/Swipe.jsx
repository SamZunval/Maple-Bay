import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Chip
} from "@mui/material";
import * as api from "../util/api";

const placeholderImage = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80";

const Swipe = () => {
  const [allProfiles, setAllProfiles] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [rejectedUsernames, setRejectedUsernames] = useState(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const userName = userInfo.userName;
    if (userName) {
      try {
        return JSON.parse(sessionStorage.getItem(`rejectedUsers_${userName}`) || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    setCurrentUser(userInfo);
  }, []);

  useEffect(() => {
    if (!currentUser?.userName) return;

    const loadProfiles = async () => {
      try {
        const users = await api.users.getRecomendations(currentUser.userName);

        const filtered = users
          .filter((user) =>
            user.userName &&
            user.userName !== currentUser.userName
          )
          .map((user) => ({
            ...user,
            displayImage: user.profileImage || user.photo || placeholderImage
          }));

        setAllProfiles(filtered);
        setProfiles(filtered.filter(user => !rejectedUsernames.includes(user.userName)));
      } catch (err) {
        console.error(err);
        setError("Unable to load profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [currentUser]); // Only load once per user login

  useEffect(() => {
    if (allProfiles.length > 0) {
      setProfiles(allProfiles.filter(user => !rejectedUsernames.includes(user.userName)));
    }
  }, [rejectedUsernames, allProfiles]);

  const profileBio = (user) => {
    const details = [];
    if (user.career) details.push(user.career);
    if (user.college) details.push(`Studied at ${user.college}`);
    if (user.city || user.province) details.push(`From ${[user.city, user.province].filter(Boolean).join(", ")}`);
    if (user.birthDay) details.push(`Born ${user.birthDay}`);
    return details.join(" · ");
  };

  const handleAccept = async (userName) => {
    setProfiles((prev) => prev.filter((profile) => profile.userName !== userName));
    try {
      if (currentUser?.userName) {
        await api.users.likeUser(currentUser.userName, userName);
      }
    } catch (err) {
      console.warn("Like request failed", err);
    }
  };

  const handleReject = async (userName) => {
    setProfiles((prev) => prev.filter((profile) => profile.userName !== userName));
    try {
        await api.users.blockUser(JSON.parse(sessionStorage.getItem("userInfo") || "{}").userName, userName);
    } catch (err) {
      console.warn("Block request failed", err);
    }
    const currentUser = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const userNameKey = currentUser.userName;
    if (userNameKey) {
      setRejectedUsernames((prev) => {
        const next = [...prev, userName];
        sessionStorage.setItem(`rejectedUsers_${userNameKey}`, JSON.stringify(next));
        return next;
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!profiles.length) {
    return (
      <Paper sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          No profiles available
        </Typography>
        <Typography variant="body1">
          We couldn't find any other users to swipe on right now. Check back later!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#3d0f3e" }}>
        Swipe Profiles
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Tap accept or reject to browse other members. The profile card will update as you move through the stack.
      </Typography>

      <Box sx={{ position: "relative", minHeight: 520, mb: 4 }}>
        {profiles.slice(0, 4).reverse().map((profile, index) => {
          return (
            <Card
              key={profile.userName}
              sx={{
                position: "absolute",
                width: { xs: "92%", sm: "100%" },
                maxWidth: { xs: 360, sm: 700, md: 900 },
                mx: { xs: "4%", sm: 0 },
                top: `${index * 8}px`,
                left: { xs: `${index * 4}px`, sm: `${index * 8}px` },
                zIndex: 10 + index,
                boxShadow: 8,
                transform: `scale(${1 - index * 0.02})`,
                transition: "transform 0.2s ease",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                height={index === 0 ? 320 : 300}
                image={profile.displayImage}
                alt={`${profile.firstName || profile.userName} profile`}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {profile.firstName || profile.userName} {profile.lastName || ""}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {profileBio(profile) || "No bio available yet."}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {profile.city && <Chip label={profile.city} />}
                  {profile.career && <Chip label={profile.career} />}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mt: -2, mb: 3 }}>
        <Button
          sx={{ flex: 1, minWidth: 140, backgroundColor: "#e74c3c", color: "#fff", py: 1.5 }}
          variant="contained"
          onClick={() => handleReject(profiles[0].userName)}
        >
          Reject
        </Button>
        <Button
          sx={{ flex: 1, minWidth: 140, backgroundColor: "#4caf50", color: "#fff", py: 1.5 }}
          variant="contained"
          onClick={() => handleAccept(profiles[0].userName)}
        >
          Accept
        </Button>
      </Box>
    </Box>
  );
};

export default Swipe;
