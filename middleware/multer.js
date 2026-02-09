const multer = require('multer');
const path = require('path');

// crea la carpeta 'uploads' si no existe para guardar la imgen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // le da un nombre único al archivo subido de la imagen
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
// configura multer con el almacenamiento definido
const upload = multer({ storage });

module.exports = upload;
