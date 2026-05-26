const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-2' });
const BUCKET = 'newolx-uploads-681432799230';

const getPresignedUrl = async (req, res) => {
  try {
    const extension = req.query.extension || '.jpg';
    const key = `${crypto.randomUUID()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    res.json({ url, key });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar URL de subida' });
  }
};

module.exports = { getPresignedUrl };
