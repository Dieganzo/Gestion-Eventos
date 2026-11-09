describe('E2E - Editar evento', () => {
  it('permite a un administrador editar un evento', () => {
    const nombreOriginal = `TEST E2E Editar ${Date.now()}`;
    const nombreEditado = `TEST E2E Editado ${Date.now()}`;
    const descripcionOriginal = 'Evento creado para probar edicion';
    const descripcionEditada = 'Descripcion modificada por Cypress';

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

        cy.get('#nombreEvento').type(nombreOriginal);
        cy.get('#descripcionEvento').type(descripcionOriginal);
        cy.contains('button', 'Crear').click();

        cy.contains('.tarjeta-evento', nombreOriginal)
          .should('be.visible')
          .within(() => {
            cy.get('button[title="Editar evento"]').click();
          });

        cy.contains('h2', 'Editar evento').should('be.visible');

        cy.get('#editarNombre').clear().type(nombreEditado);
        cy.get('#editarDescripcion').clear().type(descripcionEditada);

        cy.contains('button', 'Guardar cambios').click();

        cy.contains('.tarjeta-evento', nombreEditado)
          .should('be.visible')
          .within(() => {
            cy.contains('p', descripcionEditada).should('be.visible');
          });
      }
    );
  });
});