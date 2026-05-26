// se aislan las funciones del fronted para poder probarlas 

function validarEmail(email) {
  const regex = /\S+@\S+/;
  return regex.test(email);
}

function filtrarVentas(ventas, query) {
  return ventas.filter(v =>
    v.titulo.toLowerCase().includes(query) ||
    v.descripcion.toLowerCase().includes(query) ||
    v.categoria.toLowerCase().includes(query) ||
    (v.ubicacion && v.ubicacion.toLowerCase().includes(query))
  );
}

function hayVentas(ventas) {
  return ventas && ventas.length > 0;
}

module.exports = {
  validarEmail,
  filtrarVentas,
  hayVentas
};