/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
export { };

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to select DOM element by data-testid attribute.
             * @example cy.getByTestId('testid')
             */
            getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
            /**
             * Custom command to select DOM element by class attribute.
             * @example cy.getByClass('class')
             */
            getByClass(className: string): Chainable<JQuery<HTMLElement>>
            /**
             * Custom command to check current path
             * @example cy.assertPath('/path')
             */
            assertPath(path: string): Cypress.Chainable<string>
        }
    }
}

Cypress.Commands.add("getByTestId", testId => {
    return cy.get(`[data-testid=${testId}]`);
});

Cypress.Commands.add('getByClass', className => {
    return cy.get(`[class*=${className}]`)
})

Cypress.Commands.add('assertPath', path => {
    return cy.url().should('eq', Cypress.config().baseUrl + path);
})