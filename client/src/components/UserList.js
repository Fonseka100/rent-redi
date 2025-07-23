import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { LoadingSpinner } from './common/LoadingSpinner';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Opacity as HumidityIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';

// Constants
const WEATHER_ICONS = {
  rain: '🌧️',
  drizzle: '🌧️',
  snow: '❄️',
  cloud: '☁️',
  clear: '☀️',
  sun: '☀️',
  thunder: '⛈️',
  fog: '🌫️',
  mist: '🌫️',
  default: '🌤️'
};

const CARD_STYLES = {
  card: {
    height: 260,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    borderRadius: 3,
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    border: '1px solid #e0e0e0',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
  },
  content: {
    flexGrow: 1,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  name: {
    fontWeight: 600,
    color: '#667eea',
    mb: 2,
    fontSize: '0.95rem',
    lineHeight: 1.2,
    height: '2.4rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word'
  },
  location: {
    backgroundColor: '#f8f9fa',
    borderColor: '#667eea',
    color: '#667eea',
    mb: 1,
    fontSize: '0.75rem',
    fontWeight: 500,
    height: '20px',
    maxWidth: '100%',
    '& .MuiChip-label': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 24px)'
    }
  },
  coordinates: {
    mb: 2,
    p: 1.5,
    backgroundColor: '#f8f9fa',
    borderRadius: 2,
    border: '1px solid #e3e3e3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '32px'
  },
  weather: {
    mb: 2,
    p: 1.5,
    backgroundColor: '#e3f2fd',
    borderRadius: 2,
    border: '1px solid #bbdefb',
    height: '50px',
    display: 'flex',
    alignItems: 'center'
  },
  actions: {
    pt: 1.5,
    borderTop: '1px solid #f0f0f0',
    height: '50px',
    alignItems: 'center'
  }
};

// Utility functions
const getWeatherIcon = (description) => {
  const desc = description?.toLowerCase() || '';
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (desc.includes(key)) return icon;
  }
  return WEATHER_ICONS.default;
};

const formatCoordinate = (coord) => {
  return coord ? coord.toFixed(4) : 'N/A';
};

// Sub-components
const UserName = ({ name }) => (
  <Typography variant="h6" gutterBottom sx={CARD_STYLES.name}>
    {name}
  </Typography>
);

const UserLocation = ({ cityName, zipCode }) => (
  <Chip
    icon={<LocationIcon />}
    label={`${cityName || 'Unknown'}, ${zipCode}`}
    variant="outlined"
    size="small"
    sx={CARD_STYLES.location}
  />
);

const UserCoordinates = ({ latitude, longitude }) => (
  <Box sx={CARD_STYLES.coordinates}>
    <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#555' }}>
      📍 {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
    </Typography>
  </Box>
);

const WeatherInfo = ({ weatherData, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={CARD_STYLES.weather}>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          <LoadingSpinner size={16} message="" />
        </Box>
      </Box>
    );
  }

  if (!weatherData) {
    return (
      <Box sx={CARD_STYLES.weather}>
        <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center', width: '100%' }}>
          No weather data
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={CARD_STYLES.weather}>
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ mr: 0.5, fontSize: '1rem' }}>
            {getWeatherIcon(weatherData.description)}
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ fontSize: '0.9rem' }}>
            {Math.round(weatherData.temperature)}°C
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <HumidityIcon sx={{ fontSize: '0.75rem', mr: 0.5, color: '#2196f3' }} />
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
            {weatherData.humidity}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ActionButtons = ({ onView, onEdit, onDelete }) => (
  <Box display="flex" justifyContent="space-between" mt="auto" sx={CARD_STYLES.actions}>
    <IconButton
      size="small"
      onClick={onView}
      color="primary"
      sx={{
        backgroundColor: '#e3f2fd',
        '&:hover': { backgroundColor: '#bbdefb' },
      }}
    >
      <ViewIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={onEdit}
      color="primary"
      sx={{
        backgroundColor: '#e8f5e8',
        '&:hover': { backgroundColor: '#c8e6c9' },
      }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={onDelete}
      color="error"
      sx={{
        backgroundColor: '#ffebee',
        '&:hover': { backgroundColor: '#ffcdd2' },
      }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Box>
);

const UserCard = ({ user, weatherData, weatherLoading, onView, onEdit, onDelete }) => (
  <Card elevation={3} sx={CARD_STYLES.card}>
    <CardContent sx={CARD_STYLES.content}>
      <UserName name={user.name} />
      <UserLocation cityName={user.cityName} zipCode={user.zipCode} />
      <UserCoordinates latitude={user.latitude} longitude={user.longitude} />
      <WeatherInfo weatherData={weatherData} isLoading={weatherLoading} />
      <ActionButtons onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </CardContent>
  </Card>
);

const EmptyState = ({ onAddUser }) => (
  <Card elevation={3} sx={{ borderRadius: 3, background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid #e0e0e0' }}>
    <CardContent sx={{ p: 6, textAlign: 'center' }}>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        No users found
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Create your first user to get started!
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={onAddUser}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          }
        }}
      >
        Create First User
      </Button>
    </CardContent>
  </Card>
);

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete this user? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

// Main component
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const navigate = useNavigate();

  const fetchWeatherData = useCallback(async (userId) => {
    try {
      setWeatherLoading(prev => ({ ...prev, [userId]: true }));
      const response = await userAPI.getUserWeather(userId);
      setWeatherData(prev => ({
        ...prev,
        [userId]: response.data.weather
      }));
    } catch (err) {
      // Handle weather fetch errors silently
    } finally {
      setWeatherLoading(prev => ({ ...prev, [userId]: false }));
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      const usersData = response.data || [];
      
      const sortedUsers = usersData.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      setUsers(sortedUsers);
      setError(null);
      
      sortedUsers.forEach(user => {
        fetchWeatherData(user.id);
      });
    } catch (err) {
      const errorMessage = 'Failed to fetch users. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchWeatherData]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    try {
      await userAPI.deleteUser(deleteDialog.userId);
      setUsers(users.filter((user) => user.id !== deleteDialog.userId));
      setWeatherData(prev => {
        const newWeatherData = { ...prev };
        delete newWeatherData[deleteDialog.userId];
        return newWeatherData;
      });
      setDeleteDialog({ open: false, userId: null });
      toast.success('User deleted successfully!');
    } catch (err) {
      const errorMessage = 'Failed to delete user. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleUserAction = (action, userId) => {
    switch (action) {
      case 'view':
        navigate(`/user/${userId}`);
        break;
      case 'edit':
        navigate(`/edit/${userId}`);
        break;
      case 'delete':
        setDeleteDialog({ open: true, userId });
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 2, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Users
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Weather information
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {users.length === 0 ? (
        <EmptyState onAddUser={() => navigate('/create')} />
      ) : (
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {users.map((user) => (
            <Grid key={user.id} item xs={12} sm={6} md={4} lg={3} sx={{ minWidth: 280, maxWidth: 320 }}>
              <UserCard
                user={user}
                weatherData={weatherData[user.id]}
                weatherLoading={weatherLoading[user.id]}
                onView={() => handleUserAction('view', user.id)}
                onEdit={() => handleUserAction('edit', user.id)}
                onDelete={() => handleUserAction('delete', user.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default UserList;
