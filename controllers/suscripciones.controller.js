const dynamo = require('../db/db');
const crypto = require('crypto');
const { GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE = 'Suscripciones';

const getSuscripciones = async (req, res) => {
  try {
    const result = await dynamo.send(new ScanCommand({ TableName: TABLE }));
    const items = result.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener suscripciones' });
  }
};

const getSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dynamo.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!result.Item) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.Item);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const postSuscripcion = async (req, res) => {
  try {
    const { nombre, email, mensaje, role } = req.body;

    const rolesValidos = ['administrador', 'miembro', 'usuario'];
    const rolFinal = rolesValidos.includes(role) ? role : 'usuario';

    const id = crypto.randomUUID();
    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id,
        nombre,
        email,
        mensaje,
        role: rolFinal,
        createdAt: new Date().toISOString(),
      },
    }));

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar suscripci\u00f3n' });
  }
};

const updateSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, mensaje, role } = req.body;

    await dynamo.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: 'SET nombre = :n, email = :e, mensaje = :m, #r = :r',
      ExpressionAttributeNames: { '#r': 'role' },
      ExpressionAttributeValues: {
        ':n': nombre,
        ':e': email,
        ':m': mensaje,
        ':r': role,
      },
    }));

    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar suscripci\u00f3n' });
  }
};

const deleteSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    await dynamo.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar suscripci\u00f3n' });
  }
};

module.exports = {
  getSuscripciones,
  getSuscripcion,
  postSuscripcion,
  updateSuscripcion,
  deleteSuscripcion,
};
