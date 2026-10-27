describe('E2E - Gestión de eventos', () => {
  it('permite a un administrador crear y eliminar un evento', () => {
    const nombreEvento = `Evento E2E ${Date.now()}`;
    const descripcionEvento = 'Evento creado automáticamente por Cypress';

    cy.visit('/');

    cy.env(['ADMIN_CORREO', 'ADMIN_CONTRASENA']).then(
      ({ ADMIN_CORREO, ADMIN_CONTRASENA }) => {
        cy.get('#correo').type(ADMIN_CORREO);

        cy.get('#contrasena').type(ADMIN_CONTRASENA, {
          log: false
        });

        cy.contains('button', 'Iniciar sesión').click();

        cy.url().should('include', '/inicio');

        cy.contains('button', '+ Crear evento').click();

        cy.get('#nombreEvento').type(nombreEvento);
        cy.get('#descripcionEvento').type(descripcionEvento);

        cy.contains('button', 'Crear').click();

        cy.contains('.tarjeta-evento', nombreEvento)
          .should('be.visible')
          .within(() => {
            cy.get('button[title="Eliminar evento"]').click();
          });

        cy.contains('h2', 'Eliminar evento').should('be.visible');

        cy.contains('button', 'Sí, eliminar').click();

        cy.contains('.tarjeta-evento', nombreEvento).should('not.exist');
      }
    );
  });
});