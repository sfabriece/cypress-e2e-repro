import { faker } from '@faker-js/faker';

import { type User } from './models';

describe('Pets Functionality', () => {
  beforeEach(function () {
    cy.task('db:seed');

    cy.intercept('POST', '/pets').as('createPet');
    cy.intercept('POST', '/pets/**/submit').as('submitPet');
    cy.intercept('GET', '/pets/view/**').as('viewPet');
  });

  describe('Creating a new pet', () => {
    it('should allow users to add new pet from the dashboard', () => {
      const pet = {
        date: '2021-01-01',
        comment: faker.lorem.sentence()
      };

      cy.database('find', 'user').then((user: User) => {
        cy.login(user.email, 's3cret1234');
      });

      cy.getBySel('dashboard-submit-pet').should('be.visible').click();

      cy.location('pathname').should('equal', '/pets/new');

      // Create Pet Page

      cy.getBySel('pet-title').should('be.visible').and('contain', 'New pet');

      cy.getBySel('pet-status').should('contain', 'Draft');

      // Pick kind
      cy.getBySel('pet-kind-select').select(1);

      // Add dates
      cy.clock();
      cy.getBySel('pet-date').type('2021-01-01');

      // comment
      cy.getBySel('pet-general-comment').type(pet.comment);

      cy.getBySel('pet-save-button')
        .should('be.visible')
        .and('contain', 'Submit Pet')
        .click();

      cy.wait('@createPet');

      cy.getToastByMessage('Pet created').should('be.visible');

      // Pet Page

      // Get pet id from url
      cy.location('pathname')
        .invoke('split', '/')
        .its(2)
        .then((petId) => {
          cy.location('pathname').should('equal', `/pets/${petId}`);
        });

      // cy.getBySel('pet-status').should('have.text', 'Draft'); // TODO: not working multiple elements found

      // cy.getBySel('pet-date').should('contain','01/01/2021'); //TODO: not working multiple elements found

      cy.getBySel('pet-general-comment').should('have.value', pet.comment);

      // To scroll to the bottom of the page
      //TODO: I tried scrolling to the bottom of the page but it didn't work. Selecting blindly the button
      cy.getBySel('pet-submit-button').click();

      cy.get('.alert-submit-pet').should('be.visible');
      cy.get('.alert-submit-pet')
        .contains('Cancel')
        .should('be.visible')
        .click();

      cy.getBySel('pet-preview-button')
        .should('be.visible')
        .and('have.text', 'Preview');

      cy.getBySel('pet-delete-button')
        .should('be.visible')
        .and('have.text', 'Remove');

      cy.getBySel('pet-save-button')
        .should('be.visible')
        .and('contain', 'Save');

      cy.getBySel('pet-submit-button')
        .should('be.visible')
        .and('have.text', 'Submit pet')
        .click();

      cy.get('.alert-submit-pet').contains('Submit pet').should('be.visible');

      cy.get('.alert-submit-pet')
        .contains('Do you want to submit this pet?')
        .should('be.visible');

      cy.get('.alert-confirm-button').should('be.visible').click();

      cy.wait('@submitPet');

      cy.getToastByMessage('Pet submitted').should('be.visible');

      cy.location('pathname')
        .invoke('split', '/')
        .its(3)
        .then((petId) => {
          cy.location('pathname').should('equal', `/pets/submitted/${petId}`);
        });

      //TODO: it seams the url change is successful but the page is not rendered

      //TODO: I tried visiting the root to see if it works but it results in a black screen.
      //You can disable the visit for the assertions that are supposed to be on the submitted page
      cy.visit(`/`);

      // Submitted page

      cy.getBySel('petsubmit-title').should('be.visible').and('contain', 'Pet');
      cy.getBySel('petsubmit-status').should('contain', 'Submitted');

      cy.getBySel('petsubmit-duplicate')
        .should('be.visible')
        .and('have.text', 'Duplicate');
    });
  });
});
