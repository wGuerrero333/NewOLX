const {
  validarEmail,
  filtrarVentas,
  hayVentas
} = require('./validarVentas');

describe('Pruebas unitarias Frontend - GRUPO PS', () => {

  // ==========================
  // VALIDAR EMAIL
  // ==========================
  test('Correo válido devuelve true', () => {
    expect(validarEmail('usuario@mail.com')).toBe(true);
  });

  test('Correo inválido devuelve false', () => {
    expect(validarEmail('correo-invalido')).toBe(false);
  });

  // ==========================
  // VALIDAR VENTAS
  // ==========================
  test('Hay ventas cuando el arreglo tiene datos', () => {
    const ventas = [{ titulo: 'Laptop' }];
    expect(hayVentas(ventas)).toBe(true);
  });

  test('No hay ventas cuando el arreglo está vacío', () => {
    expect(hayVentas([])).toBe(false);
  });

  // ==========================
  // FILTRO DE VENTAS
  // ==========================
  test('Filtrar ventas por categoría', () => {
    const ventas = [
      { titulo: 'iPhone', categoria: 'electronica', descripcion: '', ubicacion: 'Bogotá' },
      { titulo: 'Silla', categoria: 'muebles', descripcion: '', ubicacion: 'Cali' }
    ];

    const resultado = filtrarVentas(ventas, 'electronica');
    expect(resultado.length).toBe(1);
    expect(resultado[0].titulo).toBe('iPhone');
  });

});