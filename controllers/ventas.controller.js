const pool = require('../db/db');

const getVentas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ventas ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

const getVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM ventas WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const postVentas = async (req, res) => {
  try {
    const { titulo, descripcion, precio, categoria, ubicacion } = req.body;
    // Carpeta "uploads" donde se alojaran las imagenes de los productos
    // operador ternario para verificar si se subio una imagen
    const imagen = req.file ? '/uploads/' + req.file.filename : null;
    
// campos requeridos verificacion
    if (!titulo || precio == null || !categoria) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const [result] = await pool.query(
      "INSERT INTO ventas (titulo, descripcion, precio, categoria, ubicacion, imagen) VALUES (?, ?, ?, ?, ?, ?)",
      [titulo, descripcion || '', precio, categoria, ubicacion, imagen]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Error al crear venta" });
  }
};

const updateVenta  = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, precio, categoria, ubicacion } = req.body;

    // obtener la imagen actual si no se sube nueva
    const [rows] = await pool.query("SELECT imagen FROM ventas WHERE id = ?", [id]);
    const imagenActual = rows[0].imagen;

    const nuevaImagen = req.file ? `/uploads/${req.file.filename}` : imagenActual;

    await pool.query(
      "UPDATE ventas SET titulo=?, descripcion=?, precio=?, categoria=?, ubicacion=?, imagen=? WHERE id=?",
      [titulo, descripcion, precio, categoria, ubicacion, nuevaImagen, id]
    );

    res.json({ message: "Actualizado correctamente", imagen: nuevaImagen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar" });
  }
};

const deleteVenta = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM ventas WHERE id=?", [id]);
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar venta" });
  }
};
module.exports = {
  getVentas,
  getVenta,
  postVentas,
  updateVenta,
  deleteVenta
};
