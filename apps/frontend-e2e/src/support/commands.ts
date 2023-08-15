/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../global.d.ts" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add('getToastByMessage', (message: string) => {
  return cy.get('.pm-toast').shadow().contains(message);
});

Cypress.Commands.add('login', (email, password) => {
  const signinPath = '/auth/login';
  const log = Cypress.log({
    name: 'login',
    displayName: 'LOGIN',
    message: [`🔐 Authenticating | ${email}`],
    // @ts-ignore
    autoEnd: false
  });

  cy.intercept('POST', '/auth/login').as('loginUser');
  cy.intercept('GET', '/me').as('getUserProfile');

  cy.location('pathname', { log: false }).then((currentPath) => {
    if (currentPath !== signinPath) {
      cy.visit(signinPath);
    }
  });

  log.snapshot('before');

  cy.getBySel('signin-email').type(email);
  cy.getBySel('signin-password').type(password);

  cy.getBySel('signin-submit').click();
  cy.wait('@loginUser').then(() => {
    log.set({
      consoleProps() {
        return {
          email,
          password
        };
      }
    });

    log.snapshot('after');
    log.end();
  });
});

Cypress.Commands.add(
  'loginByApi',
  (email, password = Cypress.env('defaultPassword')) => {
    return cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      email,
      password
    });
  }
);

Cypress.Commands.add('database', (operation, model, query, logTask = false) => {
  const params = {
    model,
    query
  };

  const log = Cypress.log({
    name: 'database',
    displayName: 'DATABASE',
    message: [`🔎 ${operation}ing within ${model} data`],
    // @ts-ignore
    autoEnd: false,
    consoleProps() {
      return params;
    }
  });

  return cy
    .task(`${operation}:database`, params, { log: logTask })
    .then((data) => {
      log.snapshot();
      log.end();
      return data;
    });
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
