describe('E2E - Eliminar evento', () => {
  it('permite a un administrador eliminar un evento', () => {
    const nombreEvento = `TEST E2E Eliminar ${Date.now()}`;
    const descripcionEvento = 'Evento creado para probar eliminacion';

    cy.visit('/');

    cy.env(['ADMIN_CORREO', 'ADMIN_CONTRASENA']).then(
      ({ ADMIN_CORREO, ADMIN_CONTRASENA }) => {
        cy.get('#correo').type(ADMIN_CORREO);

        cy.get('#contrasena').type(ADMIN_CONTRASENA, {
          log: false
        });

        cy.contains('button', 'Iniciar sesion').click();

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

        cy.get('button.modal-eliminar').click();

        cy.contains('.tarjeta-evento', nombreEvento)
          .should('not.exist');
      }
    );
  });
});