/// <reference types="cypress" />

export let random = (Math.random() + 1).toString(36).substring(7);

export let allowDataUsage = () => {
  cy.contains('Average Order');
  cy.get('body').then(($body) => {
    if ($body.find('[class="admin__fieldset"]').is(':visible')) {
      cy.contains('.action-primary', 'Allow').click({ force: true });
    }
  });
};
