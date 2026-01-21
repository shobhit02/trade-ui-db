import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Stack, CircularProgress } from '@mui/material';

// Lazy load routes for code splitting
const TradesPage = lazy(() => import('./TradesPage').then((m) => ({ default: m.TradesPage })));
const TradeDetailsPage = lazy(() =>
  import('./TradeDetailsPage').then((m) => ({ default: m.TradeDetailsPage }))
);
const AboutPage = lazy(() => import('./AboutPage').then((m) => ({ default: m.AboutPage })));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

export const App = () => {
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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/trades" replace />} />
            <Route path="/trades" element={<TradesPage />} />
            <Route path="/trades/:id" element={<TradeDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};
