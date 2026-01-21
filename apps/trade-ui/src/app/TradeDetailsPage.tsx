import { useParams, Navigate } from 'react-router-dom';
import { Typography, Box, Alert } from '@mui/material';

export const TradeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/trades" replace />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Trade Details
      </Typography>
      <Typography variant="body1">Trade ID: {id}</Typography>
      <Alert severity="info" sx={{ mt: 2 }}>
        This page can be extended with richer details later.
      </Alert>
    </Box>
  );
};
