import type { User } from './models';

describe('User Sign-up and Login', function () {
  beforeEach(function () {
    cy.task('db:seed'); // reset and seed database

    cy.intercept('POST', '/auth/signup').as('signup');
    cy.intercept('POST', '/auth/advance-onboarding').as('advanceOnboarding');
    cy.intercept('POST', '/auth/complete-onboarding').as('completeOnboarding');
  });

  it('should redirect unauthenticated user to signin page', function () {
    cy.visit('/personal');
    cy.location('pathname').should('equal', '/auth/login');
  });

  it('should go to signup page directly', function () {
    cy.visit('/auth/signup');
    cy.location('pathname').should('equal', '/auth/signup');

    cy.getBySel('auth-title')
      .should('be.visible')
      .and('contain', 'Create account');
  });

  it('should go to signin page directly', function () {
    cy.visit('/auth/login');

    cy.location('pathname').should('equal', '/auth/login');

    cy.getBySel('auth-title').should('be.visible').and('contain', 'Sign in');
  });

  it('should go to login page from sign up page', function () {
    cy.visit('/auth/signup');

    cy.getBySel('signin-link').click();
    cy.location('pathname').should('equal', '/auth/login');
  });

  describe('Signup', function () {
    it('should allow a visitor to sign-up, login, and logout', function () {
      const userInfo = {
        firstName: 'Bob',
        lastName: 'Ross',
        email: 'bob@petmanager.com',
        password: 's3cret1234',
        phoneNumber: '98756567',
        store: {
          name: 'PM Store',
          orgNumber: '123456789',
          address: 'Storvn 1',
          postalCode: '4020',
          city: 'Stavanger'
        }
      };

      // Sign-up User
      cy.visit('/');

      cy.getBySel('signup').click();
      cy.getBySel('auth-title')
        .should('be.visible')
        .and('contain', 'Create account');

      // Account Details
      cy.getBySel('signup-email').type(userInfo.email);
      cy.getBySel('signup-password').type(userInfo.password);
      cy.getBySel('signup-confirm-password').type(userInfo.password);

      cy.getBySel('signup-submit').click();
      cy.wait('@signup');

      // User Details
      cy.getBySel('onboarding-title')
        .should('be.visible')
        .and('contain', 'Welcome!');

      cy.getBySel('userform-firstname').type(userInfo.firstName);
      cy.getBySel('userform-lastname').type(userInfo.lastName);
      cy.getBySel('userform-email')
        .should('be.disabled')
        .and('have.value', userInfo.email);
      cy.getBySel('userform-phone').type(userInfo.phoneNumber);

      cy.getBySel('userform-submit').click();

      cy.wait('@advanceOnboarding');

      // Store Details
      cy.getBySel('storeform-storename').type(userInfo.store.name);
      cy.getBySel('storeform-vatnumber').type(userInfo.store.orgNumber);
      cy.getBySel('storeform-address').type(userInfo.store.address);
      cy.getBySel('storeform-postalcode').type(userInfo.store.postalCode);
      cy.getBySel('storeform-city').type(userInfo.store.city);

      cy.getBySel('storeform-submit').click();

      cy.wait('@completeOnboarding');

      cy.getToastByMessage(
        'Could not advance onboarding, please try again later'
      ).should('be.visible');

      cy.location('pathname').should('equal', '/dashboard');

      cy.contains(
        `${userInfo.store.name} - ${userInfo.store.orgNumber}`
      ).should('be.visible');

      cy.getBySel('sidenav-user')
        .should('be.visible')
        .and('contain', `${userInfo.firstName} ${userInfo.lastName}`);

      // Logout User
      cy.getBySel('sidenav-logout').click();
      cy.location('pathname').should('eq', '/auth/login');

      cy.getBySel('auth-title').should('be.visible').and('contain', 'Sign in');
    });

    describe('should display signup errors', function () {
      beforeEach(function () {
        cy.intercept('POST', '/auth/signup');
        cy.visit('/auth/signup');
      });

      it('should display signup required errors', function () {
        cy.getBySel('signup-email').clear();
        cy.getBySel('signup-password').clear();
        cy.getBySel('signup-confirm-password').clear();

        cy.getBySel('signup-submit').click();

        cy.getBySel('signup-email-helper-text')
          .should('be.visible')
          .and('contain', 'Email')
          .and('contain', 'is required');

        cy.getBySel('signup-password-helper-text')
          .should('be.visible')
          .and('contain', 'Password')
          .and('contain', 'is required');

        cy.getBySel('signup-confirm-password-helper-text')
          .should('be.visible')
          .and('contain', 'Confirm password')
          .and('contain', 'is required');
      });

      it('should display invalid email errors', function () {
        cy.getBySel('signup-email').type('User');

        cy.getBySel('signup-submit').click();

        cy.getBySel('signup-email-helper-text')
          .should('be.visible')
          .and('contain', 'Email')
          .and('contain', 'is invalid');
      });

      it('should display minimum password length errors', function () {
        cy.getBySel('signup-email').clear();
        cy.getBySel('signup-password').type('abcdefg');
        cy.getBySel('signup-confirm-password').type('abcdefg');

        cy.getBySel('signup-submit').click();

        cy.getBySel('signup-password-helper-text')
          .should('be.visible')
          .and('contain', 'Password')
          .and('contain', 'requires at least 8 characters');

        cy.getBySel('signup-confirm-password-helper-text')
          .should('be.visible')
          .and('contain', 'Confirm password')
          .and('contain', 'requires at least 8 characters');
      });

      it('should display maximum password length errors', function () {
        cy.getBySel('signup-email').clear();

        const password =
          '12345678901234567890123456789012345678901234567890123456789012347';
        cy.getBySel('signup-password').type(password);
        cy.getBySel('signup-confirm-password').type(password);

        cy.getBySel('signup-submit').click();

        cy.getBySel('signup-password-helper-text')
          .should('be.visible')
          .and('contain', 'Password')
          .and('contain', 'requires at most 64 characters');

        cy.getBySel('signup-confirm-password-helper-text')
          .should('be.visible')
          .and('contain', 'Confirm password')
          .and('contain', 'requires at most 64 characters');
      });

      it('should display password match errors', function () {
        cy.getBySel('signup-email').clear();

        cy.getBySel('signup-password').type('abcdef');
        cy.getBySel('signup-confirm-password').type('abcdefg');

        cy.getBySel('signup-submit').click();

        cy.getBySel('signup-confirm-password-helper-text')
          .should('be.visible')
          .and('contain', 'does not match');
      });
    });
  });

  describe('Login', function () {
    it('should redirect to the dashboard page after login', function () {
      cy.database('find', 'user').then((user: User) => {
        cy.login(user.email, 's3cret1234');
      });

      cy.location('pathname').should('equal', '/dashboard');
    });

    describe('should display login errors', function () {
      beforeEach(function () {
        cy.visit('/');
      });

      it('should display login required errors', function () {
        cy.getBySel('signin-email').clear();
        cy.getBySel('signin-password').clear();

        cy.getBySel('signin-submit').click();

        cy.getBySel('signin-email-helper-text')
          .should('be.visible')
          .and('contain', 'Email')
          .and('contain', 'is required');

        cy.getBySel('signin-password-helper-text')
          .should('be.visible')
          .and('contain', 'Password')
          .and('contain', 'is required');
      });

      it('should display invalid email errors', function () {
        cy.getBySel('signin-email').type('User');

        cy.getBySel('signin-submit').click();

        cy.getBySel('signin-email-helper-text')
          .should('be.visible')
          .and('contain', 'Email')
          .and('contain', 'is invalid');
      });

      it('should display minimum password length errors', function () {
        cy.getBySel('signin-email').clear();
        cy.getBySel('signin-password').type('abcdefg');

        cy.getBySel('signin-submit').click();

        cy.getBySel('signin-password-helper-text')
          .should('be.visible')
          .and('contain', 'Password')
          .and('contain', 'requires at least 8 characters');
      });

      it('should display maximum password length errors', function () {
        cy.getBySel('signin-email').type('User');
        cy.getBySel('signin-password').type(
          '12345678901234567890123456789012345678901234567890123456789012347'
        );

        cy.getBySel('signin-submit').click();

        cy.getBySel('signin-password-helper-text')
          .should('be.visible')
          .and('contain', 'Password')
          .and('contain', 'requires at most 64 characters');
      });

      it('should error for an invalid user', function () {
        cy.login('testuser@testusertestuser.com', 'invalidPa$$word');

        cy.getToastByMessage('Wrong email or password').should('be.visible');
      });

      it('should error for an invalid password for existing user', function () {
        cy.database('find', 'user').then((user: User) => {
          cy.login(user.email, 'INVALIDAD');
        });

        cy.getToastByMessage('Wrong email or password').should('be.visible');
      });
    });
  });

  describe('Session timeout', function () {});
});
