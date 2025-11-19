import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TradesPage } from './TradesPage';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {ui}
    </ThemeProvider>,
  );
};

describe('TradesPage integration – validations', () => {
  it('shows error when saving lower version for same Trade Id', async () => {
    renderWithTheme(<TradesPage />);
    const user = userEvent.setup();

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
});
