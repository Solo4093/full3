import { obtenerConsolas, actualizarConsola } from "./consolas";

const CLAVE = "categorias";
const categoriasIniciales = ["Sony", "Microsoft", "Nintendo"];

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function obtenerCategorias() {
  const guardado = localStorage.getItem(CLAVE);
  if (guardado) {
    return JSON.parse(guardado);
  }
  guardar(categoriasIniciales);
  return categoriasIniciales;
}

function validarNombre(nombre, lista, ignorar) {
  const limpio = nombre.trim();
  if (limpio.length < 2) throw new Error("El nombre debe tener al menos 2 caracteres");
  if (lista.some((c) => c !== ignorar && c.toLowerCase() === limpio.toLowerCase())) {
    throw new Error("Esa categoría ya existe");
  }
  return limpio;
}

export function crearCategoria(nombre) {
  const lista = obtenerCategorias();
  const limpio = validarNombre(nombre, lista);
  guardar([...lista, limpio]);
}

export function renombrarCategoria(anterior, nuevo) {
  const lista = obtenerCategorias();
  const limpio = validarNombre(nuevo, lista, anterior);
  guardar(lista.map((c) => (c === anterior ? limpio : c)));
  // Los productos de esa categoría se actualizan para no quedar huérfanos
  obtenerConsolas()
    .filter((p) => p.categoria === anterior)
    .forEach((p) => actualizarConsola(p.id, { categoria: limpio }));
}

export function eliminarCategoria(nombre) {
  if (obtenerConsolas().some((p) => p.categoria === nombre)) {
    throw new Error("No se puede eliminar: hay productos en esta categoría");
  }
  guardar(obtenerCategorias().filter((c) => c !== nombre));
}