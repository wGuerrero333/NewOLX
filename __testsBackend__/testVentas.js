jest.mock('../db/db', () => ({
  send: jest.fn(),
}));

const dynamo = require('../db/db');

const {
  getVentas,
  getVenta,
  postVentas,
  updateVenta,
  deleteVenta,
} = require('../controllers/ventas.controller');

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

  test('getVentas → devuelve lista de ventas', async () => {
    const req = {};
    const res = mockResponse();

    dynamo.send.mockResolvedValue({
      Items: [{ id: '1', titulo: 'Producto 1' }],
    });

    await getVentas(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: '1', titulo: 'Producto 1' },
    ]);
  });

  test('getVentas → error 500', async () => {
    const req = {};
    const res = mockResponse();

    dynamo.send.mockRejectedValue(new Error('DB error'));

    await getVentas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al obtener ventas',
    });
  });

  test('getVenta → devuelve una venta', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({
      Item: { id: '1', titulo: 'Producto X' },
    });

    await getVenta(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: '1', titulo: 'Producto X' });
  });

  test('getVenta → 404 si no existe', async () => {
    const req = { params: { id: '99' } };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({ Item: undefined });

    await getVenta(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No encontrado' });
  });

  test('postVentas → crea venta correctamente', async () => {
    const req = {
      body: {
        titulo: 'Laptop',
        descripcion: 'Buena',
        precio: 2000,
        categoria: 'Tecnolog\u00eda',
        ubicacion: 'Bogot\u00e1',
        imagen: 'https://s3-test-img.jpg',
      },
    };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({});

    await postVentas(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: expect.any(String) });
  });

  test('postVentas → 400 si faltan campos requeridos', async () => {
    const req = {
      body: {
        descripcion: 'Sin t\u00edtulo',
        precio: 100,
      },
    };
    const res = mockResponse();

    await postVentas(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Faltan campos requeridos',
    });
  });

  test('updateVenta → actualiza venta sin nueva imagen', async () => {
    const req = {
      params: { id: '1' },
      body: {
        titulo: 'Nuevo t\u00edtulo',
        descripcion: 'Actualizado',
        precio: 300,
        categoria: 'Hogar',
        ubicacion: 'Medell\u00edn',
      },
    };
    const res = mockResponse();

    dynamo.send
      .mockResolvedValueOnce({ Item: { imagen: 'https://s3-test-url.jpg' } })
      .mockResolvedValueOnce({});

    await updateVenta(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Actualizado correctamente',
      imagen: 'https://s3-test-url.jpg',
    });
  });

  test('deleteVenta → elimina venta', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({});

    await deleteVenta(req, res);

    expect(res.json).toHaveBeenCalledWith({ deleted: true });
  });
});
