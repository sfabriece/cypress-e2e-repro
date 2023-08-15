/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

declare namespace Cypress {
  interface CustomWindow extends Window {}

  type dbQueryArg = {
    entity: string;
    query: object | [object];
  };

  interface Chainable {
    /**
     *  Window object with additional properties used during test.
     */
    window(options?: Partial<Loggable & Timeoutable>): Chainable<CustomWindow>;

    getBySel(
      dataTestAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>;

    getBySelLike(
      dataTestPrefixAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>;

    getToastByMessage(message: string): Chainable<JQuery<HTMLElement>>;

    /**
     *  Cypress task for directly querying to the database within tests
     */
    task(
      event: 'filter:database',
      arg: dbQueryArg,
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<any[]>;

    /**
     *  Cypress task for directly querying to the database within tests
     */
    task(
      event: 'find:database',
      arg?: any,
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<any>;

    /**
     * Find a single entity via database query
     */
    database(
      operation: 'find',
      entity: 'user',
      query?: object,
      log?: boolean
    ): Chainable<any>;

    /**
     * Filter for data entities via database query
     */
    database(
      operation: 'filter',
      entity: 'user',
      query?: object,
      log?: boolean
    ): Chainable<any>;

    /**
     * Logs-in user by using UI
     */
    login(email: string, password: string): void;

    /**
     * Logs-in user by using API request
     */
    loginByApi(email: string, password?: string): Chainable<Response>;
  }
}
