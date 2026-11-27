
import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const formatoFecha = fecha =>
  fecha ? fecha.slice(0, 10).split('-').reverse().join('/') : '-';

export default function AdminPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [observaciones, setObservaciones] = useState({});
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const cargarPrestamos = async () => {
    try {
      setPrestamos(await apiRequest('/api/loans/books'));
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const registrarDevolucion = async (prestamo) => {
    if (!window.confirm(`¿Registrar devolución de "${prestamo.libro}"?`)) return;

    try {
      setProcesando(prestamo.loanId);
      setMensaje('');

      await apiRequest(`/api/loans/books/${prestamo.loanId}/return`, {
        method: 'PATCH',
        body: JSON.stringify({
          observaciones: observaciones[prestamo.loanId] || 'Sin observaciones'
        })
      });

      setMensaje('Devolución registrada correctamente.');
      await cargarPrestamos();
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setProcesando(null);
    }
  };

  const activos = prestamos.filter(p =>
    p.estatus === 'PRESTADO' &&
    `${p.usuario} ${p.libro}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="admin-panel">
      <div className="prestamos-encabezado">
        <div>
          <h3>Préstamos Activos</h3>
          <p>Listado de préstamos en curso registrados en la biblioteca.</p>
        </div>

        <input
          placeholder="Buscar por usuario o libro..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {mensaje && <p>{mensaje}</p>}

      {cargando ? <p>Cargando préstamos...</p> : (
        <div className="prestamos-tabla">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Libro</th>
                <th>Fecha de préstamo</th>
                <th>Fecha de devolución</th>
                <th>Estado</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {activos.map(p => (
                <tr key={p.loanId}>
                  <td>{p.usuario}</td>
                  <td>{p.libro}</td>
                  <td>{formatoFecha(p.fechaPrestamo)}</td>
                  <td>{formatoFecha(p.fechaDevolucionEstimada)}</td>
                  <td><span className="estado-prestamo">{p.estatus}</span></td>
                  <td>
                    <input
                      placeholder="Sin observaciones"
                      value={observaciones[p.loanId] || ''}
                      onChange={e => setObservaciones({
                        ...observaciones,
                        [p.loanId]: e.target.value
                      })}
                    />
                  </td>
                  <td>
                    <button
                      disabled={procesando !== null}
                      onClick={() => registrarDevolucion(p)}
                    >
                      Registrar devolución
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activos.length === 0 && <p>No hay préstamos activos.</p>}
        </div>
      )}
    </section>
  );
}
