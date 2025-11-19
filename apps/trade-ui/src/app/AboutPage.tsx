import React from 'react';
import { Typography, Box } from '@mui/material';

export const AboutPage: React.FC = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      About Trade Store
    </Typography>
    <Typography variant="body1">
      This UI allows operations users to browse, validate, and maintain trades with client-side
      business rules and strong test coverage.
    </Typography>
  </Box>
);
