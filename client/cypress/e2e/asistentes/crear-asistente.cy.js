describe('E2E - Crear asistente', () => {
  it('permite a un administrador crear un asistente en un evento', () => {
    const nombreEvento = `TEST E2E Asistente ${Date.now()}`;
    const nombreAsistente = `Asistente E2E ${Date.now()}`;
    const rutAsistente = '12.345.678-9';

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
        cy.get('#descripcionEvento').type(
          'Evento creado para probar asistentes'
        );

        cy.contains('button', 'Crear').click();

        cy.contains('.tarjeta-evento', nombreEvento)
          .should('be.visible')
          .within(() => {
            cy.contains('a', 'Ver evento').click();
          });

        cy.url().should('include', '/eventos/');

        cy.contains('button', '+ Agregar asistente', {
          timeout: 10000
        }).click({ force: true });

        cy.get('#nombreAsistente').type(nombreAsistente);
        cy.get('#rutAsistente').type(rutAsistente);

        cy.get('#staffAsistente option')
          .should('have.length.greaterThan', 1)
          .eq(1)
          .invoke('val')
          .then((staffId) => {
            cy.get('#staffAsistente').select(staffId);
          });

        cy.get('button.modal-guardar').click();

        cy.contains('h3', nombreAsistente).should('be.visible');
        cy.contains('p', `RUT: ${rutAsistente}`).should('be.visible');
      }
    );
  });
});