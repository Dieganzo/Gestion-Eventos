describe('E2E - Marcar asistencia', () => {
  it('crea cuatro asistentes y marca dos como presentes', () => {
    const identificador = Date.now();

    const nombreEvento = `TEST E2E Asistencia ${identificador}`;

    const asistentes = [
      {
        nombre: `Asistente Uno ${identificador}`,
        rut: '11.111.111-1'
      },
      {
        nombre: `Asistente Dos ${identificador}`,
        rut: '22.222.222-2'
      },
      {
        nombre: `Asistente Tres ${identificador}`,
        rut: '33.333.333-3'
      },
      {
        nombre: `Asistente Cuatro ${identificador}`,
        rut: '44.444.444-4'
      }
    ];

    cy.visit('/');

    cy.env(['ADMIN_CORREO', 'ADMIN_CONTRASENA']).then(
      ({ ADMIN_CORREO, ADMIN_CONTRASENA }) => {
        cy.get('#correo').type(ADMIN_CORREO);
        cy.get('#contrasena').type(ADMIN_CONTRASENA, { log: false });

        cy.contains('button', 'Iniciar sesion').click();

        cy.url().should('include', '/inicio');

        cy.contains('button', '+ Crear evento').click();
        cy.get('#nombreEvento').type(nombreEvento);
        cy.get('#descripcionEvento').type(
          'Evento creado para probar control de asistencia'
        );
        cy.contains('button', 'Crear').click();

        cy.contains('.tarjeta-evento', nombreEvento)
          .should('be.visible')
          .within(() => {
            cy.contains('a', 'Ver evento').click();
          });

        cy.url().should('include', '/eventos/');

        asistentes.forEach((asistente) => {
          cy.contains('button', '+ Agregar asistente').click({ force: true });

          cy.get('#nombreAsistente').type(asistente.nombre);
          cy.get('#rutAsistente').type(asistente.rut);

          cy.get('#staffAsistente option')
            .should('have.length.greaterThan', 1)
            .eq(1)
            .invoke('val')
            .then((staffId) => {
              cy.get('#staffAsistente').select(staffId);
            });

          cy.get('button.modal-guardar').click();

          cy.contains('h3', asistente.nombre).should('be.visible');
        });

        cy.contains('h3', asistentes[0].nombre)
          .closest('article')
          .contains('button', 'Presente')
          .click();

        cy.contains('h3', asistentes[1].nombre)
          .closest('article')
          .contains('button', 'Presente')
          .click();

        cy.contains('h3', asistentes[0].nombre)
          .closest('article')
          .contains('span', 'Presente')
          .should('be.visible');

        cy.contains('h3', asistentes[1].nombre)
          .closest('article')
          .contains('span', 'Presente')
          .should('be.visible');

        cy.contains('span', 'Total de asistentes')
          .parent()
          .find('strong')
          .should('have.text', '4');

        cy.contains('span', 'Presentes')
          .parent()
          .find('strong')
          .should('have.text', '2');

        cy.contains('span', 'Ausentes')
          .parent()
          .find('strong')
          .should('have.text', '2');
      }
    );
  });
});