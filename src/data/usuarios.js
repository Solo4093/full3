const CLAVE = "usuarios";
export const usuariosIniciales = [
  {
    id: 1,
    rol: "admin",
    nombre: "admin",
    apellidos: "admin",
    correo: "admin@gmail.com",
    password: "admin123",
  },
  {
    id: 2,
    rol: "cliente",
    nombre: "vicente",
    apellidos: "vasquez",
    correo: "vicente6@gmail.com",
    password: "vicente6",
  },
];
const normalizar = (correo) => correo.trim().toLowerCase();

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function obtenerUsuarios() {
  const guardado = localStorage.getItem(CLAVE);
  if (guardado) {
    return JSON.parse(guardado);
  }
  guardar(usuariosIniciales);
  return usuariosIniciales;
}

export function obtenerUsuarioPorCorreo(correo) {
  return obtenerUsuarios().find((u) => u.correo === normalizar(correo)) ?? null;
}

export function crearUsuario(nuevo) {
  if (obtenerUsuarioPorCorreo(nuevo.correo)) {
    throw new Error("Ya existe una cuenta con ese correo");
  }
  const lista = obtenerUsuarios();
  const nuevoId = lista.length > 0 ? Math.max(...lista.map((u) => u.id)) + 1 : 1;
  const usuario = {rol: "cliente",...nuevo,nombre: nuevo.nombre.trim(),apellidos: nuevo.apellidos.trim(),correo: normalizar(nuevo.correo),id: nuevoId,};
  guardar([...lista, usuario]);
  return usuario;
}

export function autenticarUsuario(correo, password) {
  const usuario = obtenerUsuarioPorCorreo(correo);
  return usuario && usuario.password === password ? usuario : null;
}

export function actualizarUsuario(id, cambios) {
  const lista = obtenerUsuarios();
  let datos = cambios;
  if (cambios.correo) {
    const correo = normalizar(cambios.correo);
    if (lista.some((u) => u.correo === correo && u.id !== id)) {
      throw new Error("Ya existe una cuenta con ese correo");
    }
    datos = { ...cambios, correo };
  }
  guardar(lista.map((u) => (u.id === id ? { ...u, ...datos } : u)));
}

export function eliminarUsuario(id) {
  guardar(obtenerUsuarios().filter((u) => u.id !== id));
}