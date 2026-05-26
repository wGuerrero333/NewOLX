const express = require('express');
const router = express.Router();
const { getPresignedUrl } = require('../controllers/uploads.controller');

router.get('/presigned', getPresignedUrl);

module.exports = router;
