import { useState, useEffect, useMemo, useCallback } from 'react';
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

const DEFAULT_FORM_VALUES: TradeFormValues = {
  tradeId: '',
  version: 1,
  counterPartyId: '',
  bookId: '',
  maturityDate: todayStr(),
};

export const TradesPage = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<TradeFormValues | null>(null);
  const [originalValues, setOriginalValues] = useState<TradeFormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: yupResolver(tradeFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
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

  const openCreateDialog = useCallback(() => {
    setDialogMode('create');
    setMessage(null);
    setError(null);
    setOriginalValues(null);
    reset(DEFAULT_FORM_VALUES);
    setDialogOpen(true);
  }, [reset]);

  const openEditDialog = useCallback(
    (trade: Trade) => {
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
    },
    [reset]
  );

  const handleRowDoubleClick = useCallback(
    (params: GridRowParams<Trade>) => {
      openEditDialog(params.row);
    },
    [openEditDialog]
  );

  const applySave = useCallback(
    (values: TradeFormValues) => {
      const result: SaveResult = saveTrade(trades, values);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setTrades(result.trades);
      setMessage(result.message);
      setDialogOpen(false);
      setPendingValues(null);
    },
    [trades]
  );

  const onSubmit = useCallback(
    (values: TradeFormValues) => {
      setMessage(null);
      setError(null);

      const sameVersion = trades.find(
        (t) => t.tradeId === values.tradeId && t.version === values.version
      );

      if (sameVersion) {
        setPendingValues(values);
        setConfirmOpen(true);
        return;
      }

      applySave(values);
    },
    [trades, applySave]
  );

  const handleConfirmReplace = useCallback(() => {
    if (pendingValues) {
      applySave(pendingValues);
    }
    setConfirmOpen(false);
  }, [pendingValues, applySave]);

  const handleCancelReplace = useCallback(() => {
    setConfirmOpen(false);
    setPendingValues(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'tradeId',
        headerName: 'Trade ID',
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Typography variant="body2" component="span">
            {params.value}
          </Typography>
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
            aria-label={`Edit trade ${params.row.tradeId} version ${params.row.version}`}
            size="small"
            onClick={() => openEditDialog(params.row as Trade)}
            tabIndex={0}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        ),
      },
    ],
    [openEditDialog]
  );

  const rows = useMemo(
    () =>
      trades.map((t, idx) => ({
        id: `${t.tradeId}-${t.version}-${idx}`,
        ...t,
      })),
    [trades]
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

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="trade-dialog-title"
      >
        <DialogTitle id="trade-dialog-title">
          {dialogMode === 'create' ? 'Create Trade' : 'Edit Trade'}
        </DialogTitle>
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
              const fieldError = errors[field.name]?.message as string | undefined;

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
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? `${field.name}-error` : undefined}
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
                    reset(DEFAULT_FORM_VALUES);
                  }
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={handleCancelReplace}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Replace Existing Trade?</DialogTitle>
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
