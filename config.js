require('dotenv').config()

const PORT = process.env.PORT || 5500;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

module.exports = {PORT, AWS_REGION}
