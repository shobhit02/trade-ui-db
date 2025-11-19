describe('Trades - validation', () => {
  it('shows validation error when maturity date is in the past in dialog', () => {
    cy.visit('/');

    cy.findByRole('button', { name: /trades/i }).click();

    cy.findByRole('button', { name: /add trade/i }).click();

    cy.findByLabelText(/trade id/i).clear().type('T10');
    cy.findByLabelText(/version/i).clear().type('1');
    cy.findByLabelText(/counter-party id/i).clear().type('CP-10');
    cy.findByLabelText(/book id/i).clear().type('B10');
    cy.findByLabelText(/maturity date/i).clear().type('2000-01-01');

    cy.findByRole('button', { name: /create/i }).click();

    cy.contains(/maturity date must be today or later/i).should('be.visible');
  });
});
