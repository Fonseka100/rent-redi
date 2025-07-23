import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetail from './components/UserDetail';
import { theme } from './config/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                RentRedi User Management
              </Typography>
            </Toolbar>
          </AppBar>

          <Container
            maxWidth="xl"
            sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}
          >
            <Routes>
              <Route path="/" element={<UserList />} />
              <Route path="/create" element={<UserForm />} />
              <Route path="/edit/:id" element={<UserForm />} />
              <Route path="/user/:id" element={<UserDetail />} />
            </Routes>
          </Container>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
