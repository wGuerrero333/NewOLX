const dynamo = require('../db/db');
const crypto = require('crypto');
const { PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE = 'Correo';

const getCorreo = async (req, res) => {
  try {
    const result = await dynamo.send(new ScanCommand({ TableName: TABLE }));
    const items = result.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener correos' });
  }
};

const postCorreo = async (req, res) => {
  try {
    const { correo } = req.body;

    const id = crypto.randomUUID();
    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id,
        correo,
        createdAt: new Date().toISOString(),
      },
    }));

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar correo' });
  }
};

module.exports = { getCorreo, postCorreo };
