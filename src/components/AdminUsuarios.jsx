
import { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const usuarioActual = JSON.parse(
    localStorage.getItem('usuario') || '{}'
  );

  useEffect(() => {
    apiRequest('/api/users')
      .then(setUsuarios)
      .catch(e => setMensaje(e.message))
      .finally(() => setCargando(false));
  }, []);

  const cambiarRol = async (usuario, rol) => {
    if (rol === usuario.rol) return;

    if (!window.confirm(`¿Cambiar el rol de ${usuario.nombre} a ${rol}?`))
      return;

    try {
      setProcesando(usuario.id);
      setMensaje('');

      await apiRequest(`/api/users/${usuario.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ rol })
      });

      setUsuarios(usuarios.map(u =>
        u.id === usuario.id ? { ...u, rol } : u
      ));

      setMensaje('Rol actualizado correctamente.');
    } catch (e) {
      setMensaje(e.message);
    } finally {
      setProcesando(null);
    }
  };

  const filtrados = usuarios.filter(u =>
    `${u.nombre} ${u.matricula}`.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <section className="admin-panel">
      <div className="usuarios-encabezado">
        <div>
          <h3><Users size={22} /> Gestión de Usuarios</h3>
          <p>Administra los usuarios del sistema y sus permisos.</p>
        </div>

        <div className="usuarios-buscador">
          <Search size={18} />
          <input
            placeholder="Buscar por nombre o matrícula..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {mensaje && <p>{mensaje}</p>}

      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="usuarios-tabla">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Matrícula</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map(u => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.matricula}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.rol}
                      disabled={
                        procesando !== null ||
                        String(u.id) === String(usuarioActual.id)
                      }
                      onChange={e => cambiarRol(u, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <span className={u.activo ? 'usuario-activo' : 'usuario-inactivo'}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtrados.length === 0 && <p>No se encontraron usuarios.</p>}
        </div>
      )}
    </section>
  );
}
