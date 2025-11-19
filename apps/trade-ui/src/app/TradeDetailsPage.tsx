import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

export const TradeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Trade Details
      </Typography>
      <Typography variant="body1">Trade ID: {id}</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        (This page can be extended with richer details later.)
      </Typography>
    </Box>
  );
};
