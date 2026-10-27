describe('E2E - Inicio de sesión', () => {
  it('permite a un administrador iniciar sesión y ver los eventos', () => {
    cy.visit('/');

    cy.env(['ADMIN_CORREO', 'ADMIN_CONTRASENA']).then(
      ({ ADMIN_CORREO, ADMIN_CONTRASENA }) => {
        cy.get('#correo').type(ADMIN_CORREO);

        cy.get('#contrasena').type(ADMIN_CONTRASENA, {
          log: false
        });

        cy.contains('button', 'Iniciar sesión').click();

        cy.url().should('include', '/inicio');
        cy.contains('h1', 'Eventos').should('be.visible');
        cy.contains('Lista de eventos').should('be.visible');
      }
    );
  });
});