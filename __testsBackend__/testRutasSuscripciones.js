const request = require('supertest');

jest.mock('../db/db', () => ({
  send: jest.fn(),
}));

const dynamo = require('../db/db');
const app = require('../app');

describe('Pruebas de integraci\u00f3n - Rutas Suscripciones', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/suscripciones → 200 y lista de suscripciones', async () => {
    dynamo.send.mockResolvedValue({
      Items: [{ id: '1', nombre: 'Juan', email: 'juan@test.com' }],
    });

    const res = await request(app).get('/api/suscripciones');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: '1', nombre: 'Juan', email: 'juan@test.com' },
    ]);
  });

  test('GET /api/suscripciones/1 → 200 si existe', async () => {
    dynamo.send.mockResolvedValue({
      Item: { id: '1', nombre: 'Ana' },
    });

    const res = await request(app).get('/api/suscripciones/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Ana');
  });

  test('GET /api/suscripciones/99 → 404 si no existe', async () => {
    dynamo.send.mockResolvedValue({ Item: undefined });

    const res = await request(app).get('/api/suscripciones/99');

    expect(res.statusCode).toBe(404);
  });

  test('POST /api/suscripciones → 201 crea suscripci\u00f3n', async () => {
    dynamo.send.mockResolvedValue({});

    const res = await request(app)
      .post('/api/suscripciones')
      .send({
        nombre: 'Carlos',
        email: 'carlos@test.com',
        mensaje: 'Hola',
        role: 'usuario',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('PUT /api/suscripciones/1 → 200 actualiza suscripci\u00f3n', async () => {
    dynamo.send.mockResolvedValue({});

    const res = await request(app)
      .put('/api/suscripciones/1')
      .send({
        nombre: 'Carlos Editado',
        email: 'edit@test.com',
        mensaje: 'Actualizado',
        role: 'miembro',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.updated).toBe(true);
  });

  test('DELETE /api/suscripciones/1 → elimina suscripci\u00f3n', async () => {
    dynamo.send.mockResolvedValue({});

    const res = await request(app).delete('/api/suscripciones/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.deleted).toBe(true);
  });
});
