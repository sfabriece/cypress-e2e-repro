/* eslint-disable unicorn/prevent-abbreviations */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// eslint-disable-next-line unicorn/prevent-abbreviations
// import '@cypress/code-coverage/support';
import './commands';

import { isMobile } from './utils';

const API_URL = process.env['NX_API_URL'];

beforeEach(() => {
  // cy.intercept middleware to remove 'if-none-match' headers from all requests
  // to prevent the server from returning cached responses of API requests

  cy.intercept(
    { url: `${API_URL}/**`, middleware: true },
    (request) => delete request.headers['if-none-match']
  );

  // Throttle API responses for mobile testing to simulate real world condition
  if (isMobile()) {
    cy.intercept({ url: `${API_URL}/**`, middleware: true }, (request) => {
      request.on('response', (response) => {
        // Throttle the response to 1 Mbps to simulate a mobile 3G connection
        response.setThrottle(1000);
      });
    });
  }
});
