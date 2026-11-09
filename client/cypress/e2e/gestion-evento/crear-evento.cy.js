describe('E2E - Crear evento', () => {
  it('permite a un administrador crear un evento', () => {
    const nombreEvento = `TEST E2E Crear ${Date.now()}`;
    const descripcionEvento = 'Evento creado automaticamente por Cypress';

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
          .should('be.visible');
      }
    );
  });
});