jest.mock('../db/db', () => ({
  send: jest.fn(),
}));

const dynamo = require('../db/db');
const {
  getSuscripciones,
  getSuscripcion,
  postSuscripcion,
  updateSuscripcion,
  deleteSuscripcion,
} = require('../controllers/suscripciones.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('Controlador Suscripciones', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getSuscripciones → devuelve lista de suscripciones', async () => {
    const req = {};
    const res = mockResponse();

    dynamo.send.mockResolvedValue({
      Items: [{ id: '1', nombre: 'Juan' }],
    });

    await getSuscripciones(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: '1', nombre: 'Juan' }]);
  });

  test('getSuscripciones → error 500', async () => {
    const req = {};
    const res = mockResponse();

    dynamo.send.mockRejectedValue(new Error('DB error'));

    await getSuscripciones(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al obtener suscripciones',
    });
  });

  test('getSuscripcion → devuelve una suscripci\u00f3n', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({
      Item: { id: '1', nombre: 'Ana' },
    });

    await getSuscripcion(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: '1', nombre: 'Ana' });
  });

  test('getSuscripcion → 404 si no existe', async () => {
    const req = { params: { id: '99' } };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({ Item: undefined });

    await getSuscripcion(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No encontrado' });
  });

  test('postSuscripcion → crea suscripci\u00f3n con rol v\u00e1lido', async () => {
    const req = {
      body: {
        nombre: 'Luis',
        email: 'luis@test.com',
        mensaje: 'Hola',
        role: 'administrador',
      },
    };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({});

    await postSuscripcion(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: expect.any(String) });
  });

  test('postSuscripcion → asigna rol "usuario" si rol inv\u00e1lido', async () => {
    const req = {
      body: {
        nombre: 'Pedro',
        email: 'pedro@test.com',
        mensaje: 'Test',
        role: 'hacker',
      },
    };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({});

    await postSuscripcion(req, res);

    const putCall = dynamo.send.mock.calls[0][0];
    expect(putCall.input.Item.role).toBe('usuario');
  });

  test('updateSuscripcion → actualiza suscripci\u00f3n', async () => {
    const req = {
      params: { id: '1' },
      body: {
        nombre: 'Carlos',
        email: 'c@test.com',
        mensaje: 'Actualizado',
        role: 'miembro',
      },
    };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({});

    await updateSuscripcion(req, res);

    expect(res.json).toHaveBeenCalledWith({ updated: true });
  });

  test('deleteSuscripcion → elimina suscripci\u00f3n', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    dynamo.send.mockResolvedValue({});

    await deleteSuscripcion(req, res);

    expect(res.json).toHaveBeenCalledWith({ deleted: true });
  });
});
