const dynamo = require('../db/db');
const crypto = require('crypto');
const { GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE = 'Ventas';

const getVentas = async (req, res) => {
  try {
    const result = await dynamo.send(new ScanCommand({ TableName: TABLE }));
    const items = result.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

const getVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dynamo.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!result.Item) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.Item);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const postVentas = async (req, res) => {
  try {
    const { titulo, descripcion, precio, categoria, ubicacion, imagen } = req.body;

    if (!titulo || precio == null || !categoria) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const id = crypto.randomUUID();
    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id,
        titulo,
        descripcion: descripcion || '',
        precio: Number(precio),
        categoria,
        ubicacion: ubicacion || '',
        imagen,
        createdAt: new Date().toISOString(),
      },
    }));

    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear venta' });
  }
};

const updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, precio, categoria, ubicacion } = req.body;

    const current = await dynamo.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!current.Item) return res.status(404).json({ error: 'No encontrado' });

    const imagenActual = current.Item.imagen;
    const nuevaImagen = req.body.imagen || imagenActual;

    await dynamo.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: 'SET titulo = :t, descripcion = :d, precio = :p, categoria = :c, ubicacion = :u, imagen = :i',
      ExpressionAttributeValues: {
        ':t': titulo,
        ':d': descripcion,
        ':p': Number(precio),
        ':c': categoria,
        ':u': ubicacion,
        ':i': nuevaImagen,
      },
    }));

    res.json({ message: 'Actualizado correctamente', imagen: nuevaImagen });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

const deleteVenta = async (req, res) => {
  try {
    const { id } = req.params;
    await dynamo.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar venta' });
  }
};

module.exports = {
  getVentas,
  getVenta,
  postVentas,
  updateVenta,
  deleteVenta,
};
