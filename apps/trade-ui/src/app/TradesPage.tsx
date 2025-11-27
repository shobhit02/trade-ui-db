import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridToolbar, GridRowParams } from '@mui/x-data-grid';

import { Trade, TradeFormValues, SaveResult } from './types';
import { saveTrade } from './tradeLogic';
import { TRADE_FORM_FIELDS, tradeFormSchema } from './formConfig';
import { fetchTrades } from './tradeService';
import { todayStr } from './utils/date';

export const TradesPage: React.FC = () => {
  const [trades, setTrades] = React.useState<Trade[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingValues, setPendingValues] = React.useState<TradeFormValues | null>(null);
  const [originalValues, setOriginalValues] = React.useState<TradeFormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: yupResolver(tradeFormSchema),
    defaultValues: {
      tradeId: '',
      version: 1,
      counterPartyId: '',
      bookId: '',
      maturityDate: todayStr(),
    },
  });

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchTrades();
        if (isMounted) {
          setTrades(data);
        }
      } catch (e) {
        if (isMounted) {
          setLoadError('Failed to load trades.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultFormValues: TradeFormValues = {
    tradeId: '',
    version: 1,
    counterPartyId: '',
    bookId: '',
    maturityDate: todayStr(),
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setMessage(null);
    setError(null);
    setOriginalValues(null);
    reset(defaultFormValues);
    setDialogOpen(true);
  };

  const openEditDialog = React.useCallback((trade: Trade) => {
    const editValues: TradeFormValues = {
      tradeId: trade.tradeId,
      version: trade.version,
      counterPartyId: trade.counterPartyId,
      bookId: trade.bookId,
      maturityDate: trade.maturityDate,
    };
    setDialogMode('edit');
    setMessage(null);
    setError(null);
    setOriginalValues(editValues);
    reset(editValues);
    setDialogOpen(true);
  }, [reset]);

  const handleRowDoubleClick = (params: GridRowParams) => {
    const row = params.row as Trade;
    openEditDialog(row);
  };

  const applySave = (values: TradeFormValues) => {
    const result: SaveResult = saveTrade(trades, values);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setTrades(result.trades);
    setMessage(result.message);
    setDialogOpen(false);
    setPendingValues(null);
  };

  const onSubmit = (values: TradeFormValues) => {
    setMessage(null);
    setError(null);

    const sameVersion = trades.find(
      (t) => t.tradeId === values.tradeId && t.version === values.version,
    );

    if (sameVersion) {
      setPendingValues(values);
      setConfirmOpen(true);
      return;
    }

    applySave(values);
  };

  const handleConfirmReplace = () => {
    if (pendingValues) {
      applySave(pendingValues);
    }
    setConfirmOpen(false);
  };

  const handleCancelReplace = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'tradeId',
        headerName: 'Trade ID',
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">{params.value}</Typography>
          </Stack>
        ),
      },
      { field: 'version', headerName: 'Version', flex: 0.7, type: 'number', sortable: true },
      { field: 'counterPartyId', headerName: 'Counter-Party', flex: 1 },
      { field: 'bookId', headerName: 'Book ID', flex: 1 },
      { field: 'maturityDate', headerName: 'Maturity Date', flex: 1 },
      { field: 'createdDate', headerName: 'Created Date', flex: 1 },
      {
        field: 'expired',
        headerName: 'Expired',
        flex: 0.8,
        sortable: true,
        renderCell: (params) =>
          params.value ? (
            <Chip label="Expired" color="error" size="small" />
          ) : (
            <Chip label="Active" color="success" size="small" />
          ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.5,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <IconButton
            aria-label="Edit trade"
            size="small"
            onClick={() => openEditDialog(params.row as Trade)}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        ),
      },
    ],
    [openEditDialog],
  );

  const rows = React.useMemo(
    () =>
      trades.map((t, idx) => ({
        id: `${t.tradeId}-${t.version}-${idx}`,
        ...t,
      })),
    [trades],
  );

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Trades</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            aria-label="Add trade"
          >
            Add Trade
          </Button>
        </Stack>

        {message && (
          <Alert severity="success" data-testid="success-alert">
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" data-testid="error-alert">
            {error}
          </Alert>
        )}
        {loadError && !loading && <Alert severity="error">{loadError}</Alert>}

        <Paper sx={{ p: 2, height: 500 }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <CircularProgress />
            </Stack>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              autoPageSize
              sortingOrder={['asc', 'desc']}
              disableColumnFilter={false}
              disableColumnMenu={false}
              disableColumnSelector={false}
              onRowDoubleClick={handleRowDoubleClick}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                mt: 1,
                borderRadius: 1,
                '& .MuiDataGrid-toolbarContainer': {
                  gap: 1,
                },
              }}
            />
          )}
        </Paper>
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{dialogMode === 'create' ? 'Create Trade' : 'Edit Trade'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 2,
              mt: 1,
            }}
            noValidate
          >
            {TRADE_FORM_FIELDS.map((field) => {
              const fieldError =
                errors[field.name] && (errors[field.name]?.message as string | undefined);

              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  type={field.type}
                  {...register(field.name)}
                  error={!!fieldError}
                  helperText={fieldError}
                  slotProps={{
                    inputLabel: field.shrinkLabel ? { shrink: true } : undefined,
                  }}
                />
              );
            })}

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button type="submit" variant="contained">
                {dialogMode === 'create' ? 'Create' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  if (dialogMode === 'edit' && originalValues) {
                    reset(originalValues);
                  } else {
                    reset(defaultFormValues);
                  }
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelReplace}>
        <DialogTitle>Replace Existing Trade?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            A trade with the same Trade Id and Version already exists. Do you want to replace it?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReplace}>Cancel</Button>
          <Button onClick={handleConfirmReplace} variant="contained" color="error">
            Replace
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
