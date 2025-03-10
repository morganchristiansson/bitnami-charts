/// <reference types="cypress" />
import { random, checkErrors } from '../support/utils';

it('should be possible to create a new Jenkins pipeline', () => {
  cy.login();
  cy.visit('/view/All/newJob');

  cy.fixture('items').then((item) => {
    cy.get('#name').type(`${item.freestyleProject.name}-${random}`);
    cy.contains(item.freestyleProject.type).click();
    cy.contains('button', 'OK').should('be.enabled').click();
    cy.contains('Error').should('not.be.visible');

    cy.get('.radio-block-start').contains('Git').click();
    cy.get("[name*='url']").type(item.freestyleProject.repositoryURL);
    cy.contains('button', 'Save').click();
    cy.contains('h1', item.freestyleProject.name);
  });

  // As a new Git project is created in every execution, the next build
  // will always be the first one.
  const nextBuildNumber = 1;
  cy.contains('Build Now').click();
  cy.contains(`#${nextBuildNumber}`);

  cy.contains('Build Now');
  // Depending on the setup, the node where to execute the build needs to be
  // provisioned, which can take up some time
  cy.get(`a[href$='/${nextBuildNumber}/'][class*='display-name']`).click();

  cy.fixture('items').then((item) => {
    cy.visit(
      `/job/${item.freestyleProject.name}-${random}/${nextBuildNumber}/`
    );
    cy.contains(`Build #${nextBuildNumber}`);
    cy.contains('Build has been executing for');
  });
});

it('should list the built-in node', () => {
  cy.login();
  cy.visit('/computer');

  cy.contains('Manage nodes and clouds');
  cy.get('table#computers').within(() => {
    cy.contains('tr', 'Built-In Node');
  });
});
