import {
  usuariosIniciales,
  obtenerUsuarios,
  obtenerUsuarioPorCorreo,
  crearUsuario,
  autenticarUsuario,
} from '../../data/usuarios';

const [admin, cliente] = usuariosIniciales;

describe('data/usuarios', () => {
  it('con el almacenamiento vacio carga el administrador y un cliente de ejemplo', () => {
    expect(obtenerUsuarios().map((u) => u.rol)).toEqual(['admin', 'cliente']);
  });

  it('autenticarUsuario acepta credenciales correctas sin distinguir mayusculas del correo', () => {
    expect(autenticarUsuario(admin.correo.toUpperCase(), admin.password).rol).toBe('admin');
  });

  it('autenticarUsuario devuelve null con contraseña errónea o correo inexistente', () => {
    expect(autenticarUsuario(admin.correo, 'mala')).toBeNull();
    expect(autenticarUsuario('nadie@correo.cl', admin.password)).toBeNull();
  });

  it('crearUsuario asigna rol cliente, siguiente id y normaliza los datos', () => {
    const u = crearUsuario({ nombre: '  Ana ', apellidos: ' Pérez ', correo: 'ANA@Mail.cl', password: '123456' });
    expect(u.rol).toBe('cliente');
    expect(u.id).toBe(usuariosIniciales.length + 1);
    expect(u.nombre).toBe('Ana');
    expect(u.correo).toBe('ana@mail.cl');
    expect(obtenerUsuarioPorCorreo('ana@mail.cl')).not.toBeNull();
  });

  it('crearUsuario lanza error si el correo ya existe (sin importar mayusculas)', () => {
    expect(() =>
      crearUsuario({ nombre: 'Otro', apellidos: 'Usuario', correo: cliente.correo.toUpperCase(), password: '123456' })
    ).toThrowError('Ya existe una cuenta con ese correo');
  });

  it('persiste el usuario nuevo en localStorage', () => {
    const setItem = spyOn(Storage.prototype, 'setItem').and.callThrough();
    crearUsuario({ nombre: 'Luis', apellidos: 'Soto', correo: 'luis@mail.cl', password: '123456' });
    expect(setItem).toHaveBeenCalledWith('usuarios', jasmine.any(String));
  });
});
