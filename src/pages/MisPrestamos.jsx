
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './MisPrestamos.css';

const fecha = (valor) => {
  if (!valor) return '—';
  return valor.slice(0, 10).split('-').reverse().join('/');
};

const MisPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/loans/books')
      .then(setPrestamos)
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <main className="biblioteca-prestamos">
      <header className="biblioteca-catalogo__barra">
        <Link to="/catalogo" className="biblioteca-catalogo__marca">
          Biblioteca<br />Universitaria
        </Link>
        <nav className="biblioteca-catalogo__menu">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/mis-prestamos" className="biblioteca-catalogo__activo">
            Mis préstamos
          </Link>
          <Link to="/perfil">Usuario</Link>
        </nav>
      </header>

      <section className="biblioteca-prestamos__contenido">
        <div className="biblioteca-prestamos__titulo">
          <img src="/images/logo-libro.png" alt="" />
          <div>
            <h1>Mis Préstamos</h1>
            <p>Consulta el estado de los libros que has solicitado</p>
          </div>
        </div>

        <div className="biblioteca-prestamos__tabla">
          <div className="biblioteca-prestamos__fila biblioteca-prestamos__cabecera">
            <span>Libro</span>
            <span>Fecha de préstamo</span>
            <span>Fecha límite</span>
            <span>Estado</span>
          </div>

          {cargando ? (
            <p className="biblioteca-prestamos__mensaje">Cargando préstamos...</p>
          ) : error ? (
            <p className="biblioteca-prestamos__mensaje">Error: {error}</p>
          ) : prestamos.length === 0 ? (
            <p className="biblioteca-prestamos__mensaje">Aún no tienes préstamos.</p>
          ) : (
            prestamos.map(prestamo => (
              <div className="biblioteca-prestamos__fila" key={prestamo.loanId}>
                <div className="biblioteca-prestamos__libro">
                  <img src="/images/logo-libro.png" alt="" />
                  <div>
                    <h2>{prestamo.libro}</h2>
                    <p>ISBN: {prestamo.isbn}</p>
                  </div>
                </div>
                <span>{fecha(prestamo.fechaPrestamo)}</span>
                <span>{fecha(prestamo.fechaDevolucionEstimada)}</span>
                <span className={
                  prestamo.estatus === 'PRESTADO'
                    ? 'biblioteca-prestamos__estado activo'
                    : 'biblioteca-prestamos__estado devuelto'
                }>
                  {prestamo.estatus === 'PRESTADO' ? 'Prestado' : 'Devuelto'}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default MisPrestamos;
