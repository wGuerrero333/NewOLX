function construirSuscripcionData(nombre, email, mensaje, role) {
  return {
    nombre: nombre.trim(),
    email: email.trim(),
    mensaje: mensaje.trim(),
    role
  };
}

function camposObligatoriosValidos(data) {
  return !!(data.nombre && data.email && data.role);
}

module.exports = {
  construirSuscripcionData,
  camposObligatoriosValidos
};
