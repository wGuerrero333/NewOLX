const request = require('supertest');

jest.mock('../db/db', () => ({
  send: jest.fn(),
}));

const dynamo = require('../db/db');
const app = require('../app');

describe('Pruebas de integraci\u00f3n - Ventas Routes (con Multer)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/ventas → 200 y lista de ventas', async () => {
    dynamo.send.mockResolvedValue({
      Items: [{ id: '1', titulo: 'Producto A' }],
    });

    const res = await request(app).get('/api/ventas');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: '1', titulo: 'Producto A' }]);
  });

  test('GET /api/ventas/1 → 200 si existe', async () => {
    dynamo.send.mockResolvedValue({
      Item: { id: '1', titulo: 'Producto X' },
    });

    const res = await request(app).get('/api/ventas/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Producto X');
  });

  test('GET /api/ventas/99 → 404 si no existe', async () => {
    dynamo.send.mockResolvedValue({ Item: undefined });

    const res = await request(app).get('/api/ventas/99');

    expect(res.statusCode).toBe(404);
  });

  test('POST /api/ventas → 201 crea venta (con imagen)', async () => {
    dynamo.send.mockResolvedValue({});

    const res = await request(app)
      .post('/api/ventas')
      .send({
        titulo: 'Laptop',
        precio: 2500,
        categoria: 'Tecnolog\u00eda',
        ubicacion: 'Bogot\u00e1',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('POST /api/ventas → 400 si faltan campos', async () => {
    const res = await request(app).post('/api/ventas').send({ precio: 100 });

    expect(res.statusCode).toBe(400);
  });

  test('PUT /api/ventas/1 → 200 actualiza venta', async () => {
    dynamo.send
      .mockResolvedValueOnce({ Item: { imagen: 'https://s3-test-url.jpg' } })
      .mockResolvedValueOnce({});

    const res = await request(app)
      .put('/api/ventas/1')
      .send({
        titulo: 'Nuevo t\u00edtulo',
        descripcion: 'Actualizado',
        precio: 300,
        categoria: 'Hogar',
        ubicacion: 'Medell\u00edn',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Actualizado correctamente');
  });

  test('DELETE /api/ventas/1 → elimina venta', async () => {
    dynamo.send.mockResolvedValue({});

    const res = await request(app).delete('/api/ventas/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.deleted).toBe(true);
  });
});
