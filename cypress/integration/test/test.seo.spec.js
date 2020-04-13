describe('SEO', () => {
    let urlCdn;

    /*
    beforeEach( () => {
        cy.visit('/');
        cy.window().then( win => {
            urlCdn = win.browsingContext.Common.ImagesPath.Base.Cdn.replace('https:');
        });
    });
    */

    it('Acessa a página inicial', () => {
        let time = new Date();
        cy.visit('/');
        cy.window().then( win => {
            urlCdn = win.browsingContext.Common.ImagesPath.Base.Cdn.replace('https:');
            time = (new Date() - time) / 1000;
            expect(time).to.have.lessThan(10);
        });
    });

    it('Testar canonical', () => {
        cy.get('link[rel="canonical"]')
            .should( tag => {
                const canonical = tag.attr('href');
                //expect(canonical).to.equal( Cypress.config().baseUrl + '/' );
            });
    });

    it('Verifica H1', () => {
        cy.get('h1')
            .should('have.length', 1);
    });

    it('Caracteres do Title', () => {
        cy.get('title')
            .should( title => {
                expect('title').to.have.length.of.at.most(70);
            });
    });

    it('Meta Description', () => {
        cy.get('meta[name="description"]')
            .should( meta => {
                expect('meta').to.have.length.of.at.most(160);
            });
    });

    it('Verificando atributo alt nas imagens', () => {
        cy.get('img')
            .each($el => {
                cy.wrap($el).should('have.attr', 'alt');
            });
    });

    it('Assets não carregando de CDN', () => {
        let assetsNoCdn = 0;
        cy.get('[src^="/"]')
            .each( (asset) => {
                if (asset[0].src.indexOf(urlCdn) != -1 || asset[0].src.indexOf( Cypress.config().baseUrl ) != -1) {
                    assetsNoCdn++;
                    console.log(asset[0].src);
                }
                return assetsNoCdn;
            })
            .then( () => {
                expect(assetsNoCdn).to.equal(0);
            });

        // $('[src^="/"]')
    });

    it('Imagens sem lazyload', () => {
        //cy.get('.wd-marketing-banner img:not(.lazyload)')
        //    .should('have.length', 0);

        cy.get('.wd-product-line .thumb img:not(.lazyload)')
            .should('have.length', 0);
    });

    it('Acesso sem www', () => {
        cy.request( {
            failOnStatusCode: false,
            url: Cypress.config().baseUrl.replace('www.', '')
        }).as('load');

        cy.get('@load')
            .should( response => {
                expect(response.status).to.match(/30/);
            });
    });
});
