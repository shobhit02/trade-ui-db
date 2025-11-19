import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { TradesPage } from './TradesPage';
import { TradeDetailsPage } from './TradeDetailsPage';
import { AboutPage } from './AboutPage';

export const App: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Trade Store
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/trades">
              Trades
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/trades" replace />} />
          <Route path="/trades" element={<TradesPage />} />
          <Route path="/trades/:id" element={<TradeDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Box>
    </Box>
  );
};
