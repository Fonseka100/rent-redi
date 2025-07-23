import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Thermostat as ThermostatIcon,
  Person as PersonIcon,
  WbSunny as SunIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      setWeatherLoading(true);
      const response = await userAPI.getUserWeather(id);
      setWeather(response.data.weather);
    } catch (err) {
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setWeatherLoading(false);
    }
  }, [id]);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserById(id);
      setUser(response.data);
      setError(null);
      await fetchWeatherData();
    } catch (err) {
      setError('Failed to fetch user data. Please try again.');
      toast.error('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, fetchWeatherData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={2}
      >
        <CircularProgress size={60} sx={{ color: '#1976d2' }} />
        <Typography variant="h6" color="textSecondary">
          Loading user details...
        </Typography>
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
        <Alert severity="error">{error || 'User not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                width: 56, 
                height: 56 
              }}
            >
              <PersonIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Chip
                icon={<LocationIcon />}
                label={`${user.cityName || 'Unknown'}, ${user.zipCode}`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/edit/${id}`)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              Edit User
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#1976d2', 
                    width: 48, 
                    height: 48,
                    mr: 2
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  User Information
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
                    Zip Code:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.zipCode}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
                    Coordinates: 
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.latitude?.toFixed(4)}, {user.longitude?.toFixed(4)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weather Information */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: '#ff9800', 
                      width: 48, 
                      height: 48,
                      mr: 2
                    }}
                  >
                    <SunIcon />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff9800', mr: 2 }}>
                    Current Weather
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={fetchWeatherData}
                  disabled={weatherLoading}
                  sx={{
                    borderColor: '#ff9800',
                    color: '#ff9800',
                    '&:hover': {
                      backgroundColor: '#fff3e0',
                    },
                  }}
                >
                  {weatherLoading ? <CircularProgress size={16} /> : 'Refresh'}
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {weather ? (
                <Box>
                  {/* Temperature Display */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                    sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                      borderRadius: 3,
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)'
                    }}
                  >
                    <ThermostatIcon sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h2" sx={{ fontWeight: 700 }}>
                      {Math.round(weather.temperature)}°C
                    </Typography>
                  </Box>

                  {/* Weather Description */}
                  <Box 
                    textAlign="center" 
                    mb={2}
                    sx={{
                      p: 2,
                      backgroundColor: '#fff3e0',
                      borderRadius: 2,
                      border: '1px solid #ffe0b2'
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: 'capitalize',
                        color: '#e65100',
                        fontWeight: 600
                      }}
                    >
                      {weather.description}
                    </Typography>
                  </Box>

                  {/* Weather Details */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 3,
                          backgroundColor: '#e3f2fd',
                          borderRadius: 2,
                          border: '1px solid #bbdefb'
                        }}
                      >
                        <HumidityIcon sx={{ fontSize: 28, color: '#1976d2', mb: 1 }} />
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Humidity
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
                          {weather.humidity}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 3,
                          backgroundColor: '#e8f5e8',
                          borderRadius: 2,
                          border: '1px solid #c8e6c9'
                        }}
                      >
                        <WindIcon sx={{ fontSize: 28, color: '#388e3c', mb: 1 }} />
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Wind Speed
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#388e3c' }}>
                          {weather.windSpeed} m/s
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : weatherLoading ? (
                <Box 
                  textAlign="center" 
                  py={4}
                  sx={{
                    p: 4,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <CircularProgress size={40} sx={{ color: '#ff9800', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Loading weather data...
                  </Typography>
                </Box>
              ) : (
                <Box 
                  textAlign="center" 
                  py={4}
                  sx={{
                    p: 4,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <SunIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No weather data available
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={fetchWeatherData}
                    disabled={weatherLoading}
                    sx={{
                      backgroundColor: '#ff9800',
                      '&:hover': { backgroundColor: '#f57c00' },
                      mt: 2
                    }}
                  >
                    {weatherLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Get Weather Data'
                    )}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;
