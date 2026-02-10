const request = require('supertest');

// 🔴 MOCK DB
jest.mock('../db/db', () => ({
  query: jest.fn()
}));

// 🔴 MOCK MULTER
jest.mock('../middleware/multer', () => ({
  single: () => (req, res, next) => {
    req.file = { filename: 'test.jpg' }; // simula archivo subido
    next();
  }
}));

const pool = require('../db/db');
const app = require('../app');

describe('Pruebas de integración - Ventas Routes (con Multer)', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================
  // GET /
  // ============================
  test('GET /api/ventas → 200 y lista de ventas', async () => {
    pool.query.mockResolvedValue([[{ id: 1, titulo: 'Producto A' }]]);

    const res = await request(app).get('/api/ventas');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, titulo: 'Producto A' }]);
  });

  // ============================
  // GET /:id
  // ============================
  test('GET /api/ventas/1 → 200 si existe', async () => {
    pool.query.mockResolvedValue([[{ id: 1, titulo: 'Producto X' }]]);

    const res = await request(app).get('/api/ventas/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Producto X');
  });

  test('GET /api/ventas/99 → 404 si no existe', async () => {
    pool.query.mockResolvedValue([[]]);

    const res = await request(app).get('/api/ventas/99');

    expect(res.statusCode).toBe(404);
  });

  // ============================
  // POST /
  // ============================
  test('POST /api/ventas → 201 crea venta (con imagen)', async () => {
    pool.query.mockResolvedValue([{ insertId: 5 }]);

    const res = await request(app)
      .post('/api/ventas')
      .send({
        titulo: 'Laptop',
        precio: 2500,
        categoria: 'Tecnología',
        ubicacion: 'Bogotá'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(5);
  });

  test('POST /api/ventas → 400 si faltan campos', async () => {
    const res = await request(app)
      .post('/api/ventas')
      .send({ precio: 100 });

    expect(res.statusCode).toBe(400);
  });

  // ============================
  // PUT /:id
  // ============================
  test('PUT /api/ventas/1 → 200 actualiza venta', async () => {
    pool.query
      .mockResolvedValueOnce([[{ imagen: '/uploads/old.jpg' }]]) // SELECT
      .mockResolvedValueOnce([{}]); // UPDATE

    const res = await request(app)
      .put('/api/ventas/1')
      .send({
        titulo: 'Nuevo título',
        descripcion: 'Actualizado',
        precio: 300,
        categoria: 'Hogar',
        ubicacion: 'Medellín'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Actualizado correctamente');
  });

  // ============================
  // DELETE /:id
  // ============================
  test('DELETE /api/ventas/1 → elimina venta', async () => {
    pool.query.mockResolvedValue([{}]);

    const res = await request(app).delete('/api/ventas/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.deleted).toBe(true);
  });

});