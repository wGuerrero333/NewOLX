const {
  construirSuscripcionData,
  camposObligatoriosValidos
} = require('./validarForm');

describe('Pruebas unitarias – Formulario de Suscripción', () => {

  test('Construye correctamente el objeto de suscripción', () => {
    const data = construirSuscripcionData(
      ' Juan ',
      ' correo@mail.com ',
      ' Hola mundo ',
      'usuario'
    );

    expect(data).toEqual({
      nombre: 'Juan',
      email: 'correo@mail.com',
      mensaje: 'Hola mundo',
      role: 'usuario'
    });
  });

  test('Campos obligatorios válidos cuando todos están presentes', () => {
    const data = {
      nombre: 'Ana',
      email: 'ana@mail.com',
      role: 'miembro'
    };

    expect(camposObligatoriosValidos(data)).toBe(true);
  });

  test('Campos obligatorios inválidos cuando falta nombre', () => {
    const data = {
      nombre: '',
      email: 'ana@mail.com',
      role: 'usuario'
    };

    expect(camposObligatoriosValidos(data)).toBe(false);
  });

  test('Campos obligatorios inválidos cuando falta email', () => {
    const data = {
      nombre: 'Ana',
      email: '',
      role: 'usuario'
    };

    expect(camposObligatoriosValidos(data)).toBe(false);
  });

});