import { Box, CircularProgress } from '@mui/material';

export const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    gap={2}
  >
    <CircularProgress size={size} />
    {message && (
      <Box color="text.secondary" fontSize="0.875rem">
        {message}
      </Box>
    )}
  </Box>
); 