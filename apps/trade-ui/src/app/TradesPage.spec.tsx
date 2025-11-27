import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TradesPage } from './TradesPage';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>{ui}</BrowserRouter>
    </ThemeProvider>,
  );
};

describe('TradesPage integration – validations', () => {
  beforeEach(() => {
    // Clear any previous state
    jest.clearAllMocks();
  });

  it('shows error when saving lower version for same Trade Id', async () => {
    renderWithTheme(<TradesPage />);
    const user = userEvent.setup();

    // Wait for initial load
    await screen.findByText(/trades/i);

    // open dialog for create
    await user.click(screen.getByRole('button', { name: /add trade/i }));

    await user.clear(screen.getByLabelText(/trade id/i));
    await user.type(screen.getByLabelText(/trade id/i), 'T2');
    await user.clear(screen.getByLabelText(/version/i));
    await user.type(screen.getByLabelText(/version/i), '1');
    await user.clear(screen.getByLabelText(/counter-party id/i));
    await user.type(screen.getByLabelText(/counter-party id/i), 'CP-X');
    await user.clear(screen.getByLabelText(/book id/i));
    await user.type(screen.getByLabelText(/book id/i), 'B9');
    await user.clear(screen.getByLabelText(/maturity date/i));
    await user.type(screen.getByLabelText(/maturity date/i), '2099-01-01');

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(
      await screen.findByText(/version must be >= existing version 2/i),
    ).toBeInTheDocument();
  });

  it('shows Yup error when maturity date is in the past', async () => {
    renderWithTheme(<TradesPage />);
    const user = userEvent.setup();

    // Wait for initial load
    await screen.findByText(/trades/i);

    await user.click(screen.getByRole('button', { name: /add trade/i }));

    await user.type(screen.getByLabelText(/trade id/i), 'T9');
    await user.type(screen.getByLabelText(/version/i), '1');
    await user.type(screen.getByLabelText(/counter-party id/i), 'CP-9');
    await user.type(screen.getByLabelText(/book id/i), 'B9');
    await user.type(screen.getByLabelText(/maturity date/i), '2000-01-01');

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(
      await screen.findByText(/maturity date must be today or later\./i),
    ).toBeInTheDocument();
  });

  it('creates a new trade successfully', async () => {
    renderWithTheme(<TradesPage />);
    const user = userEvent.setup();

    // Wait for initial load
    await screen.findByText(/trades/i);

    await user.click(screen.getByRole('button', { name: /add trade/i }));

    await user.clear(screen.getByLabelText(/trade id/i));
    await user.type(screen.getByLabelText(/trade id/i), 'T99');
    await user.clear(screen.getByLabelText(/version/i));
    await user.type(screen.getByLabelText(/version/i), '1');
    await user.clear(screen.getByLabelText(/counter-party id/i));
    await user.type(screen.getByLabelText(/counter-party id/i), 'CP-99');
    await user.clear(screen.getByLabelText(/book id/i));
    await user.type(screen.getByLabelText(/book id/i), 'B99');
    await user.clear(screen.getByLabelText(/maturity date/i));
    await user.type(screen.getByLabelText(/maturity date/i), '2099-12-31');

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/trade T99 v1 created successfully/i)).toBeInTheDocument();
    expect(screen.getByText('T99')).toBeInTheDocument();
  });

  it('shows replace confirmation dialog when same trade id and version exist', async () => {
    renderWithTheme(<TradesPage />);
    const user = userEvent.setup();

    // Wait for initial load
    await screen.findByText(/trades/i);

    await user.click(screen.getByRole('button', { name: /add trade/i }));

    await user.clear(screen.getByLabelText(/trade id/i));
    await user.type(screen.getByLabelText(/trade id/i), 'T2');
    await user.clear(screen.getByLabelText(/version/i));
    await user.type(screen.getByLabelText(/version/i), '2');
    await user.clear(screen.getByLabelText(/counter-party id/i));
    await user.type(screen.getByLabelText(/counter-party id/i), 'CP-NEW');
    await user.clear(screen.getByLabelText(/book id/i));
    await user.type(screen.getByLabelText(/book id/i), 'B2');
    await user.clear(screen.getByLabelText(/maturity date/i));
    await user.type(screen.getByLabelText(/maturity date/i), '2099-12-31');

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/replace existing trade\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /replace/i })).toBeInTheDocument();
  });

  it('resets form to original values in edit mode', async () => {
    renderWithTheme(<TradesPage />);
    const user = userEvent.setup();

    // Wait for initial load
    await screen.findByText(/trades/i);

    // Find and click edit button (wait for data grid to load)
    const editButtons = await screen.findAllByLabelText(/edit trade/i);
    await user.click(editButtons[0]);

    // Verify dialog is open with edit mode
    expect(screen.getByText(/edit trade/i)).toBeInTheDocument();

    // Get original value
    const tradeIdField = screen.getByLabelText(/trade id/i) as HTMLInputElement;
    const originalValue = tradeIdField.value;

    // Modify the value
    await user.clear(tradeIdField);
    await user.type(tradeIdField, 'MODIFIED');

    // Click reset
    await user.click(screen.getByRole('button', { name: /reset/i }));

    // Verify value is restored
    expect(tradeIdField.value).toBe(originalValue);
  });

  it('resets form to default values in create mode', async () => {
    renderWithTheme(<TradesPage />);
    const user = userEvent.setup();

    // Wait for initial load
    await screen.findByText(/trades/i);

    await user.click(screen.getByRole('button', { name: /add trade/i }));

    // Modify trade id
    const tradeIdField = screen.getByLabelText(/trade id/i) as HTMLInputElement;
    await user.type(tradeIdField, 'TEST');

    // Click reset
    await user.click(screen.getByRole('button', { name: /reset/i }));

    // Verify value is reset to empty
    expect(tradeIdField.value).toBe('');
  });
});
