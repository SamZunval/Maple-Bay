import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Paper
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import * as api from '../util/api';

const DisplayUser = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setLoading(false);
      return;
    }

    // Check if current user is logged in
    const currentUserInfo = sessionStorage.getItem("userInfo");
    if (currentUserInfo) {
      try {
        const currentUser = JSON.parse(currentUserInfo);
        setUser(currentUser);
        setLoading(false);
        return;
      } catch (parseError) {
        console.error('Error parsing current user info:', parseError);
      }
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const users = await api.users.getUsers();
        if (!Array.isArray(users) || users.length === 0) {
          setError('No users available in database');
          setUser(null);
        } else {
          // show first user or random, choose as needed
          setUser(users[0]);
        }
      } catch (fetchError) {
        console.error('DisplayUser fetch error:', fetchError);
        setError('Failed to load user from database');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [initialUser]);

  if (loading) {
    return (
      <Card sx={{ maxWidth: 345, height: 500, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{
          height: 350,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5'
        }}>
          <Typography variant="h6" color="text.secondary">
            Loading user...
          </Typography>
        </Box>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card sx={{ maxWidth: 345, height: 500, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{
          height: 350,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5'
        }}>
          <Typography variant="h6" color="text.secondary">
            {error || 'No user data available'}
          </Typography>
        </Box>
      </Card>
    );
  }

  // Calculate age from birthDay
  const calculateAge = (birthDay) => {
    if (!birthDay) return null;
    try {
      const today = new Date();
      const birthDate = new Date(birthDay);
      if (isNaN(birthDate.getTime())) return null;

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age > 0 ? age : null;
    } 
    catch  {
      return null;
    }
  };

  const age = calculateAge(user.birthDay);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",  
        alignItems: "center",      
        minHeight: "100vh",         
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          height: 'auto',
          borderRadius: 3,
          boxShadow: 5,
          bgcolor: '#ffffff',
          overflow: 'visible',
          border: '1px solid #e0e0e0',
          '&:hover': {
            transform: 'scale(1.01)',
            transition: 'transform 0.2s ease-in-out',
          }
          
        }}
      >
        {/* Profile Picture */}
        <CardMedia
          component="img"
          height="350"
          image={user.profileImage || "https://picsum.photos/345/350?random=1"}
          alt={`${user.firstName || user.userName || 'User'}'s profile`}
          sx={{
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjM1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjM1MCIgZmlsbD0iI2Y1ZjVmNSIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjMyNSIgaGVpZ2h0PSIyNSIgZmlsbD0iIzk5OSIgcng9IjUiLz48dGV4dCB4PSIxNzIiIHk9IjI3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
          }}
        />

        <CardContent sx={{ minHeight: 260, bgcolor: '#ffffff' }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5, color: '#111' }}>
            {(user.firstName && user.lastName)
              ? `${user.firstName} ${user.lastName}`
              : (user.userName || 'Unknown User')
            }
            {age && (
              <Typography variant="h5" component="span" sx={{ ml: 1, fontWeight: 'normal', color: '#666' }}>
                {age}
              </Typography>
            )}
          </Typography>

          {(user.city || user.province) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ fontSize: 18, mr: 0.6, color: '#888' }} />
              <Typography variant="body1" sx={{ color: '#555' }}>
                {[user.city, user.province].filter(Boolean).join(', ')}
              </Typography>
            </Box>
          )}

          <Typography variant="body1" sx={{ mb: 2, color: '#444' }}>
            {user.bio || 'No bio provided yet.'}
          </Typography>

          <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
              Details
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.25 }}>Username: {user.userName || 'N/A'}</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.25 }}>Address: {user.address || 'N/A'}</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.25 }}>City / Province: {[user.city, user.province].filter(Boolean).join(' / ') || 'N/A'}</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.25 }}>Postal Code: {user.postalCode || 'N/A'}</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.25 }}>Birthday: {user.birthDay || 'N/A'}</Typography>
            {user.likes && user.likes.length > 0 && (
              <Typography variant="body2" sx={{ color: '#333', mb: 0.25 }}>Likes: {user.likes.join(', ')}</Typography>
            )}
            {user.liked && user.liked.length > 0 && (
              <Typography variant="body2" sx={{ color: '#333', mb: 0.25 }}>Liked by: {user.liked.join(', ')}</Typography>
            )}
            {user.interests && Array.isArray(user.interests) && user.interests.length > 0 && (
              <Typography variant="body2" sx={{ color: '#333', mt: 0.7 }}>Interests: {user.interests.join(', ')}</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DisplayUser;
