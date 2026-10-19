import { createContext, useContext, useState } from 'react';
import {
  autenticarUsuario,
  crearUsuario,
} from '../../data/usuarios';

const AuthContext = createContext(null);
const SESION = 'sesion';

// La sesión nunca guarda la contraseña.
const sinPassword = ({ password, ...resto }) => { // eslint-disable-line no-unused-vars
  return resto;
};

const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem(SESION)) ?? null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  const abrirSesion = (usuario) => {
    const sesion = sinPassword(usuario);
    localStorage.setItem(SESION, JSON.stringify(sesion));
    setUser(sesion);
  };

  const register = ({ nombre, apellidos, correo, password }) => {
    const usuario = crearUsuario({ nombre, apellidos, correo, password });
    abrirSesion(usuario);
  };

  const login = ({ correo, password }) => {
    const usuario = autenticarUsuario(correo, password);
    if (!usuario) throw new Error('Correo o contraseña incorrectos');
    abrirSesion(usuario);
  };

  const logout = () => {
    localStorage.removeItem(SESION);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
