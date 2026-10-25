import { describe, expect, it } from 'vitest';
import {
  compararContrasena,
  encriptarContrasena
} from '../../helpers/bcryptHelper.js';

describe('Bcrypt Helper - Pruebas Unitarias', () => {
  it('debe encriptar una contraseña y generar un hash distinto', async () => {
    const contrasena = 'Password123!';
    const hash = await encriptarContrasena(contrasena);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(contrasena);
  });

  it('debe retornar true si la contraseña coincide con el hash', async () => {
    const contrasena = 'Password123!';
    const hash = await encriptarContrasena(contrasena);

    const esValida = await compararContrasena(contrasena, hash);

    expect(esValida).toBe(true);
  });

  it('debe retornar false si la contraseña no coincide con el hash', async () => {
    const hash = await encriptarContrasena('Password123!');

    const esValida = await compararContrasena('ClaveIncorrecta', hash);

    expect(esValida).toBe(false);
  });
});