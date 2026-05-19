const config = require('./config');
const app = require('./app');

app.listen(config.PORT, () => console.log(`Servidor en http://localhost:${config.PORT}`));

