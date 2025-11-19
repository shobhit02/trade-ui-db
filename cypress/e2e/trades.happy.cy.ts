describe('Trades - happy path', () => {
  it('creates a new trade successfully via dialog', () => {
    cy.visit('/');

    cy.findByRole('button', { name: /trades/i }).click(); // ensure on /trades if navigation exists

    cy.findByRole('button', { name: /add trade/i }).click();

    cy.findByLabelText(/trade id/i).clear().type('T9');
    cy.findByLabelText(/version/i).clear().type('1');
    cy.findByLabelText(/counter-party id/i).clear().type('CP-9');
    cy.findByLabelText(/book id/i).clear().type('B9');
    cy.findByLabelText(/maturity date/i).clear().type('2099-01-01');

    cy.findByRole('button', { name: /create/i }).click();

    cy.contains(/trade T9 v1 created successfully/i).should('be.visible');
    cy.contains('T9').should('exist');
  });
});
