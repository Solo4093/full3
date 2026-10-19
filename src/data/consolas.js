const CLAVE = "consolas";
const CLAVE_VERSION = "consolas_version";
const VERSION = "4";
import ps5 from "../assets/img/ps5ozi.webp";
import xbox from "../assets/img/xbox.webp";
import switch2 from "../assets/img/switch2.webp";
import xbox360 from "../assets/img/xbox360.webp";
import switch1 from "../assets/img/switch-1.webp";
import ps4 from "../assets/img/images.webp";
import psp from "../assets/img/images-_1_.webp";
import ds2 from "../assets/img/2ds.webp";


const consolasIniciales = [
  {
    id: 1,
    nombre: "Playstation 5",
    precio: 659990,
    categoria: "Sony",
    oferta: false,
    descuento: 10,
    stock: 10,
    imagen: ps5,
  },
  {
    id: 2,
    nombre: "Xbox series x",
    precio: 659990,
    categoria: "Microsoft",
    oferta: false,
    stock: 8,
    imagen: xbox,
  },
  {
    id: 3,
    nombre: "Nintendo switch 2",
    precio: 549990,
    categoria: "Nintendo",
    oferta: false,
    descuento: 20,
    stock: 15,
    imagen: switch2,
  },
  {
    id: 4,
    nombre: "Playstation 4",
    precio: 249990,
    categoria: "Sony",
    oferta: true,
    descuento: 25,
    stock: 12,
    imagen: ps4,
  },
  {
    id: 5,
    nombre: "Nintendo switch 1",
    precio: 299990,
    categoria: "Nintendo",
    oferta: true,
    descuento: 12,
    stock: 9,
    imagen: switch1,
  },
  {
    id: 6,
    nombre: "Xbox 360",
    precio: 89990,
    categoria: "Microsoft",
    oferta: true,
    descuento: 30,
    stock: 6,
    imagen: xbox360,
  },
  {
    id: 7,
    nombre: "PSP",
    precio: 79990,
    categoria: "Sony",
    oferta: true,
    descuento: 35,
    stock: 5,
    imagen: psp,
  },
  {
    id: 8,
    nombre: "Nintendo 2DS",
    precio: 99990,
    categoria: "Nintendo",
    oferta: true,
    descuento: 5,
    stock: 7,
    imagen: ds2,
  },
];

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
  localStorage.setItem(CLAVE_VERSION, VERSION);
}

export function obtenerConsolas() {
  const guardado = localStorage.getItem(CLAVE);
  if (guardado && localStorage.getItem(CLAVE_VERSION) === VERSION) {
    return JSON.parse(guardado);
  }
  guardar(consolasIniciales);
  return consolasIniciales;
}

export function crearConsola(nueva) {
  const lista = obtenerConsolas();
  const nuevoId = lista.length > 0 ? Math.max(...lista.map((c) => c.id)) + 1 : 1;
  const consola = { ...nueva, id: nuevoId };
  guardar([...lista, consola]);
  return consola;
}

export function actualizarConsola(id, cambios) {
  const lista = obtenerConsolas().map((c) =>
    c.id === id ? { ...c, ...cambios } : c
  );
  guardar(lista);
}

export function eliminarConsola(id) {
  const lista = obtenerConsolas().filter((c) => c.id !== id);
  guardar(lista);
}

export const DESCUENTO_OFERTA = 15;
export function descuentoDe(consola) {
  return consola.oferta ? (consola.descuento ?? DESCUENTO_OFERTA) : 0;
}

export function precioFinal(consola) {
  return Math.round((consola.precio * (100 - descuentoDe(consola))) / 100);
}