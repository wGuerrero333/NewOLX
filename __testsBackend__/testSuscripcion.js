jest.mock('../db/db', () => ({
  query: jest.fn()
}));

const pool = require('../db/db');
const {
  getSuscripciones,
  getSuscripcion,
  postSuscripcion,
  updateSuscripcion,
  deleteSuscripcion
} = require('../controllers/suscripciones.controller');

// Helpers para mock de req y res
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

  // ============================
  // GET ALL
  // ============================
  test('getSuscripciones → devuelve lista de suscripciones', async () => {
    const req = {};
    const res = mockResponse();

    pool.query.mockResolvedValue([[{ id: 1, nombre: 'Juan' }]]);

    await getSuscripciones(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM suscripciones ORDER BY id DESC"
    );
    expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Juan' }]);
  });

  test('getSuscripciones → error 500', async () => {
    const req = {};
    const res = mockResponse();

    pool.query.mockRejectedValue(new Error('DB error'));

    await getSuscripciones(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener suscripciones"
    });
  });

  // ============================
  // GET BY ID
  // ============================
  test('getSuscripcion → devuelve una suscripción', async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    pool.query.mockResolvedValue([[{ id: 1, nombre: 'Ana' }]]);

    await getSuscripcion(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Ana' });
  });

  test('getSuscripcion → 404 si no existe', async () => {
    const req = { params: { id: 99 } };
    const res = mockResponse();

    pool.query.mockResolvedValue([[]]);

    await getSuscripcion(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No encontrado' });
  });

  // ============================
  // POST
  // ============================
  test('postSuscripcion → crea suscripción con rol válido', async () => {
    const req = {
      body: {
        nombre: 'Luis',
        email: 'luis@test.com',
        mensaje: 'Hola',
        role: 'administrador'
      }
    };
    const res = mockResponse();

    pool.query.mockResolvedValue([{ insertId: 10 }]);

    await postSuscripcion(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 10 });
  });

  test('postSuscripcion → asigna rol "usuario" si rol inválido', async () => {
    const req = {
      body: {
        nombre: 'Pedro',
        email: 'pedro@test.com',
        mensaje: 'Test',
        role: 'hacker'
      }
    };
    const res = mockResponse();

    pool.query.mockResolvedValue([{ insertId: 5 }]);

    await postSuscripcion(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      ['Pedro', 'pedro@test.com', 'Test', 'usuario']
    );
  });

  // ============================
  // UPDATE
  // ============================
  test('updateSuscripcion → actualiza suscripción', async () => {
    const req = {
      params: { id: 1 },
      body: {
        nombre: 'Carlos',
        email: 'c@test.com',
        mensaje: 'Actualizado',
        role: 'miembro'
      }
    };
    const res = mockResponse();

    pool.query.mockResolvedValue([{}]);

    await updateSuscripcion(req, res);

    expect(res.json).toHaveBeenCalledWith({ updated: true });
  });

  // ============================
  // DELETE
  // ============================
  test('deleteSuscripcion → elimina suscripción', async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    pool.query.mockResolvedValue([{}]);

    await deleteSuscripcion(req, res);

    expect(res.json).toHaveBeenCalledWith({ deleted: true });
  });

});
