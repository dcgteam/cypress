const newLocal = 'https://www.bemol.com.br/'
describe('teste inicial', () => {
    it('Testando acesso ao site', () => {
        cy.visit(newLocal)
    })
	it('Verificando canonical', () => {
		cy.get('link[rel="canonical"]').should( el => {
			const canonical = el.attr('href')
			expect(canonical).to.match( new RegExp(newLocal, 'g') )
		})
    })
    it('Verificando quantidade de Tags H1', () => {
		cy.get('h1').should('have.length', 1)
    })
    it('Verificando qtd Caracteres do Title', () => {
		cy.get('title').should( title => {
            expect('title').to.have.length.of.at.most(70)
        })
    })
    it('Verificando Meta Description', () => {
		cy.get('meta[name="description"]').should( meta => {
            expect('meta').to.have.length.of.at.most(160)
        })
    })
    it('Verificando atributo alt nas imagens', () => {
		cy.get('img').each($el => {
            cy.wrap($el).should('have.attr', 'alt')
        })
	})
	
	it('Verifica o console', () => {
		cy.get('@consoleLog').should('be.calledWith', 'Hello World!')
	})
})