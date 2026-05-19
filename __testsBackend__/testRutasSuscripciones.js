const request = require('supertest');

// 🔴 MOCK DE LA BD
jest.mock('../db/db', () => ({
  query: jest.fn()
}));

const pool = require('../db/db');
const app = require('../app');

describe('Pruebas de integración - Rutas Suscripciones', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================
  // GET /
  // ============================
  test('GET /api/suscripciones → 200 y lista de suscripciones', async () => {
    pool.query.mockResolvedValue([[{ id: 1, nombre: 'Juan', email: 'juan@test.com' }]]);

    const res = await request(app).get('/api/suscripciones');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 1, nombre: 'Juan', email: 'juan@test.com' }
    ]);
  });

  // ============================
  // GET /:id
  // ============================
  test('GET /api/suscripciones/1 → 200 si existe', async () => {
    pool.query.mockResolvedValue([[{ id: 1, nombre: 'Ana' }]]);

    const res = await request(app).get('/api/suscripciones/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Ana');
  });

  test('GET /api/suscripciones/99 → 404 si no existe', async () => {
    pool.query.mockResolvedValue([[]]);

    const res = await request(app).get('/api/suscripciones/99');

    expect(res.statusCode).toBe(404);
  });

  // ============================
  // POST /
  // ============================
  test('POST /api/suscripciones → 201 crea suscripción', async () => {
    pool.query.mockResolvedValue([{ insertId: 10 }]);

    const res = await request(app)
      .post('/api/suscripciones')
      .send({
        nombre: 'Carlos',
        email: 'carlos@test.com',
        mensaje: 'Hola',
        role: 'usuario'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(10);
  });

  // ============================
  // PUT /:id
  // ============================
  test('PUT /api/suscripciones/1 → 200 actualiza suscripción', async () => {
    pool.query.mockResolvedValue([{}]);

    const res = await request(app)
      .put('/api/suscripciones/1')
      .send({
        nombre: 'Carlos Editado',
        email: 'edit@test.com',
        mensaje: 'Actualizado',
        role: 'miembro'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.updated).toBe(true);
  });

  // ============================
  // DELETE /:id
  // ============================
  test('DELETE /api/suscripciones/1 → elimina suscripción', async () => {
    pool.query.mockResolvedValue([{}]);

    const res = await request(app).delete('/api/suscripciones/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.deleted).toBe(true);
  });

});
