import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = Boolean(id);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserById(id);
      const user = response.data;
      setFormData({
        name: user.name || '',
        zipCode: user.zipCode || '',
      });
    } catch (err) {
      setError('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [isEditing, fetchUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'zipCode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      
      let maskedValue = numericValue;
      if (numericValue.length > 5) {
        maskedValue = numericValue.slice(0, 5) + '-' + numericValue.slice(5, 9);
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: maskedValue,
      }));
    } else if (name === 'name') {
      // Limitar o campo name a 100 caracteres
      const limitedValue = value.slice(0, 100);
      setFormData((prev) => ({
        ...prev,
        [name]: limitedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.name.length > 100) {
      setError('Name must be 100 characters or less');
      return false;
    }
    if (!formData.zipCode.trim()) {
      setError('Zip code is required');
      return false;
    }
    if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      setError('Please enter a valid zip code (e.g., 12345 or 12345-6789)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await userAPI.updateUser(id, formData);
        toast.success('User updated successfully!');
        navigate('/');
      } else {
        await userAPI.createUser(formData);
        toast.success('User created successfully!');
        navigate('/');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          disabled={loading}
          sx={{
            mr: 3,
            borderColor: loading ? '#ccc' : '#1976d2',
            color: loading ? '#ccc' : '#1976d2',
            '&:hover': {
              backgroundColor: loading ? 'transparent' : '#e3f2fd',
            },
          }}
          variant="outlined"
        >
          Back
        </Button>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: '#1976d2',
          }}
        >
          {isEditing ? 'Edit User' : 'Create New User'}
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid sx={{ width: '100%' }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
              </Grid>

              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  inputProps={{
                    maxLength: 100
                  }}
                  helperText={
                    loading 
                      ? 'Please wait...' 
                      : `Enter the user's full name`
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: loading ? '#ccc' : '#1976d2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: loading ? '#ccc' : '#1976d2',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  helperText={
                    loading
                      ? 'Please wait...'
                      : 'Enter a valid US zip code (e.g., 12345 or 12345-6789)'
                  }
                  placeholder="12345"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: loading ? '#ccc' : '#1976d2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: loading ? '#ccc' : '#1976d2',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <Box
                  display="flex"
                  gap={3}
                  justifyContent="flex-end"
                  sx={{
                    pt: 3,
                    borderTop: '1px solid #e0e0e0',
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    disabled={loading}
                    sx={{
                      borderColor: '#666',
                      color: '#666',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <SaveIcon />
                    }
                    disabled={loading}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0' },
                      minWidth: 140,
                    }}
                  >
                    {loading
                      ? isEditing
                        ? 'Updating...'
                        : 'Creating...'
                      : isEditing
                        ? 'Update User'
                        : 'Create User'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Card sx={{ backgroundColor: '#e3f2fd', border: '1px solid #bbdefb' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ lineHeight: 1.6 }}
            >
              <strong>ℹ️ Note:</strong> When you create or update a user, the
              system will automatically fetch the latitude, longitude, and
              timezone based on the provided zip code using the OpenWeatherMap
              API.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserForm;
