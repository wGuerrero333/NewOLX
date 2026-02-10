// MOCK DE LA BASE DE DATOS (DEBE IR PRIMERO)
jest.mock('../db/db', () => ({
  query: jest.fn()
}));

const pool = require('../db/db');

const {
  getVentas,
  getVenta,
  postVentas,
  updateVenta,
  deleteVenta
} = require('../controllers/ventas.controller');

// Helper para mock de res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('Controlador Ventas', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================
  // GET ALL
  // ============================
  test('getVentas → devuelve lista de ventas', async () => {
    const req = {};
    const res = mockResponse();

    pool.query.mockResolvedValue([[{ id: 1, titulo: 'Producto 1' }]]);

    await getVentas(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM ventas ORDER BY id DESC"
    );
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, titulo: 'Producto 1' }
    ]);
  });

  test('getVentas → error 500', async () => {
    const req = {};
    const res = mockResponse();

    pool.query.mockRejectedValue(new Error('DB error'));

    await getVentas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener ventas"
    });
  });

  // ============================
  // GET BY ID
  // ============================
  test('getVenta → devuelve una venta', async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    pool.query.mockResolvedValue([[{ id: 1, titulo: 'Producto X' }]]);

    await getVenta(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      titulo: 'Producto X'
    });
  });

  test('getVenta → 404 si no existe', async () => {
    const req = { params: { id: 99 } };
    const res = mockResponse();

    pool.query.mockResolvedValue([[]]);

    await getVenta(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No encontrado' });
  });

  // ============================
  // POST
  // ============================
  test('postVentas → crea venta correctamente', async () => {
    const req = {
      body: {
        titulo: 'Laptop',
        descripcion: 'Buena',
        precio: 2000,
        categoria: 'Tecnología',
        ubicacion: 'Bogotá'
      },
      file: { filename: 'img.jpg' }
    };
    const res = mockResponse();

    pool.query.mockResolvedValue([{ insertId: 5 }]);

    await postVentas(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 5 });
  });

  test('postVentas → 400 si faltan campos requeridos', async () => {
    const req = {
      body: {
        descripcion: 'Sin título',
        precio: 100
      }
    };
    const res = mockResponse();

    await postVentas(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Faltan campos requeridos'
    });
  });

  // ============================
  // PUT
  // ============================
  test('updateVenta → actualiza venta sin nueva imagen', async () => {
    const req = {
      params: { id: 1 },
      body: {
        titulo: 'Nuevo título',
        descripcion: 'Actualizado',
        precio: 300,
        categoria: 'Hogar',
        ubicacion: 'Medellín'
      }
    };
    const res = mockResponse();

    pool.query
      .mockResolvedValueOnce([[{ imagen: '/uploads/old.jpg' }]]) // SELECT
      .mockResolvedValueOnce([{}]); // UPDATE

    await updateVenta(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Actualizado correctamente",
      imagen: '/uploads/old.jpg'
    });
  });

  // ============================
  // DELETE
  // ============================
  test('deleteVenta → elimina venta', async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    pool.query.mockResolvedValue([{}]);

    await deleteVenta(req, res);

    expect(res.json).toHaveBeenCalledWith({ deleted: true });
  });

});