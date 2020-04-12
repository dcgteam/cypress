// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
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

Cypress.Commands.add('login', () => {
    cy.server();
    cy.route('POST', '/login').as('load');
    cy.visit('/login');
    cy.url().should('contain', '/login');

    cy.get('.painel-box [name="Login.Email"]').type('atendimento@linx.com.br');
    cy.get('.painel-box [name="Login.Password"]').type('123', {log:false});
    cy.get('.painel-box [name="Login.Submit"]').click();
    cy.wait('@load');
    cy.url()
        .should('not.contain', '/login')
        .then($url => {
            window.loggedInPage = $url;
        });
    cy.getCookie('tkt').then($cookie => {
        window.app_cookie = $cookie.value;
    });        
});