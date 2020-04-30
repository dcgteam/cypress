describe('Fluxo de compra', () => {
    let productUrl;

    before( () => {
        //cy.login();
    });
    // it.only
    // it.skip

    it.skip('Painel do cliente - Pedidos', () => {
        cy.setCookie('tkt', app_cookie);
        cy.visit('/painel-do-cliente/pedidos');
        cy.get('.wd-profile-orders .wd-title').should('contain', 'Histórico de pedidos');
        cy.url()
            .should('contain', '/pedidos');
    });

    it('Página inicial', () => {
        // acessa a home
        cy.visit('/');
        cy.get('body')
            .should( body => {
                expect(body[0].className).to.match(/HomeRoute/);
            });
    });

    it('Pesquisa', () => {
        // acessa a home
        cy.visit('/');

        // preenche o campo de busca
        cy.get('#top-search .wd-search form [name="t"]')
            .type('teste');

        // submete a pesquisa
        cy.get('#top-search .wd-search form')
            .submit();
        
        // verifica se o total de registros encontrados é mais do zero
        cy.get('.wd-browsing-grid header .product-count > span')
            .should( value => {
                expect(value.text()).to.be.greaterThan(0);
            });

        // clica no primeiro produto que não seja um kit
        cy.get('.wd-product-line[data-name]:not(:contains("Kit")):first h3 a')
            .then( product => {
                // window.productUrl = Cypress.$(product).attr('href');
                productUrl = Cypress.$(product).attr('href');
            })
            //.click();

        /**
         * forma usando route para add to cart
         */
        /*
        cy.get('.buy-box .wd-buy-button form:visible')
            .within( (form) => {
                const body = {
                'Products[0].ProductID': Cypress.$(form).find('[name="Products[0].ProductID"]').val(),
                'Products[0].SkuID': Cypress.$(form).find('[name="Products[0].SkuID"]').val(),
                'Products[0].Quantity': Cypress.$(form).find('[name="Products[0].Quantity"]').val()
                };
                cy.server();
                cy.route({
                    method: 'POST', 
                    headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url: '/carrinho/adicionar-produto', 
                    body: body,
                    failOnStatusCode: false,
                    followRedirect: false
                }).then( response => {
                    expect(response.status).to.eq(200);
                });
            }).as('addToCart');
        */
    });

    it('Detalhe do produto', () => {
        // acessa o produto
        cy.visit(productUrl);
        
        // verifica se a página é de um produto válido
        cy.get('body')
            .should( body => {
                expect(body[0].className).to.match(/context-product/);
            });

        // clica no botão comprar
        // cy.get('.buy-box .wd-buy-button form:visible .btn-buy').click();

        cy.get('.buy-box .wd-buy-button form:visible')
            .within( (form) => {
                const body = {
                    'Products[0].ProductID': Cypress.$(form).find('[name="Products[0].ProductID"]').val(),
                    'Products[0].SkuID': Cypress.$(form).find('[name="Products[0].SkuID"]').val(),
                    'Products[0].Quantity': Cypress.$(form).find('[name="Products[0].Quantity"]').val()
                };

                cy.request({
                    method: 'POST', 
                    headers: {
                        //'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url: '/carrinho/adicionar-produto', 
                    body: body,
                    failOnStatusCode: false,
                    followRedirect: false
                }).then( response => {
                    expect(response.status).to.eq(200);

                    cy.getCookie('tkt').then($cookie => {
                        window.app_cookie = $cookie.value;
                    });
                });
            });
    });
    
    it('Carrinho', () => {
        cy.setCookie('tkt', app_cookie);
        cy.visit('/carrinho');
        cy.url()
            .should('contain', '/carrinho');

        cy.get('.botoes-topo .wd-checkout-basket-buttons > .bt-checkout')
            .should( button => {
                expect(button).to.have.length(1);
            })
            .click();        
    });

    it('Checkout', () => {
        cy.setCookie('tkt', app_cookie);
        console.log('productUrl', window.productUrl);
        cy.visit('/checkout/easy');
        cy.url()
            .should('contain', '/checkout/easy');

        cy.get('.signin-form > :nth-child(1) > .inline-input > .validation > input').type('atendimento@linx.com.br');
        cy.get('.sigin-password > .inline-input > .validation > input').type('123');
        cy.get('.signin-form > .btn-big').click();
        cy.url()
            .should('contain', '#delivery');

        cy.get('#summary .go-payment').click();
        cy.url()
            .should('contain', '#payment');

        cy.get('.method-options .paymentslip').click();
        cy.url()
            .should('contain', '#payment/paymentslip');

        //cy.get('#form-checkout-submit').click();
        cy.url()
            .should('contain', '#confirmation');

        cy.get('.checkout-step.confirmation .badge > strong')
            .should( order => {
                expect(order.text()).to.be.greaterThan(1);
            });
    })
});
