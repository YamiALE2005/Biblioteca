
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './Catalogo.css';

const imagenLibro = (libro) => {
  if (libro.titulo === 'Robótica Industrial') return '/images/robotica-industrial.png';
  if (libro.titulo === 'Control Automático') return '/images/control-automatico.png';
  return '/images/logo-libro.png';
};

const fechaHoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const Catalogo = () => {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [seleccionado, setSeleccionado] = useState(null);
  const [fecha, setFecha] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/books')
      .then(setLibros)
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const categorias = [...new Set(libros.map(libro => libro.categoria))];

  const librosFiltrados = libros.filter(libro =>
    (libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
     libro.autor.toLowerCase().includes(busqueda.toLowerCase())) &&
    (categoria === 'Todas' || libro.categoria === categoria)
  );

  const handleSolicitar = (libro) => {
    setSeleccionado(libro);
    setFecha('');
  };

  const handleCancelar = () => {
    setSeleccionado(null);
    setFecha('');
  };

  // Registrar préstamo real en la API
  const handleConfirmar = async (e) => {
    e.preventDefault();

    if (!seleccionado || !fecha || fecha < fechaHoy()) {
      alert('Selecciona una fecha válida.');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    if (!usuario?.id) {
      alert('Inicia sesión nuevamente.');
      return;
    }

    try {
      setEnviando(true);

      await apiRequest('/api/loans/books', {
        method: 'POST',
        body: JSON.stringify({
          bookId: seleccionado.id,
          userId: usuario.id,
          fechaDevolucionEstimada: fecha
        })
      });

      alert('¡Préstamo registrado correctamente!');
      handleCancelar();

      // Actualizar la disponibilidad de libros.
      apiRequest('/api/books')
        .then(setLibros)
        .catch(err => setError(err.message));

    } catch (err) {
      alert(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="biblioteca-catalogo">

      <header className="biblioteca-catalogo__barra">
        <Link to="/catalogo" className="biblioteca-catalogo__marca">
          Biblioteca<br />Universitaria
        </Link>

        <nav className="biblioteca-catalogo__menu">
          <Link to="/catalogo" className="biblioteca-catalogo__activo">Catálogo</Link>
          <Link to="/mis-prestamos">Mis préstamos</Link>
          <Link to="/perfil">Usuario</Link>
        </nav>
      </header>

      <section className="biblioteca-catalogo__contenido">
        <div className="biblioteca-catalogo__titulo">
          <img src="/images/logo-libro.png" alt="" />
          <h1>Catálogo de Libros</h1>
        </div>

        <div className="biblioteca-catalogo__filtros">
          <label className="biblioteca-catalogo__buscador">
            <img className="biblioteca-catalogo__icono-buscar" src="/images/icono-buscar.svg" alt="" />
            <input
              type="search"
              placeholder="Buscar por título o autor..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </label>

          <label className="biblioteca-catalogo__categoria">
            <span>Categoría:</span>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="Todas">Todas</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </label>
        </div>

        <div className="biblioteca-catalogo__libros">
          {cargando ? (
            <p className="biblioteca-catalogo__vacio">Cargando libros...</p>
          ) : error ? (
            <p className="biblioteca-catalogo__vacio">Error: {error}</p>
          ) : librosFiltrados.length === 0 ? (
            <p className="biblioteca-catalogo__vacio">No se encontraron libros.</p>
          ) : (
            librosFiltrados.map(libro => (
              <article className="biblioteca-catalogo__libro" key={libro.id}>
                <div className="biblioteca-catalogo__datos">
                  <img className="biblioteca-catalogo__portada"
                    src={imagenLibro(libro)} alt={libro.titulo} />

                  <div className="biblioteca-catalogo__detalles">
                    <h2>{libro.titulo}</h2>
                    <p><strong>ISBN:</strong> {libro.isbn}</p>
                    <p><strong>Autor:</strong> {libro.autor}</p>
                    <p><strong>Categoría:</strong> {libro.categoria}</p>
                    <span className="biblioteca-catalogo__disponibles">
                      Disponibles: {libro.stockDisponible}
                    </span>
                  </div>
                </div>

                <button className="biblioteca-catalogo__solicitar"
                  onClick={() => handleSolicitar(libro)}
                  disabled={libro.stockDisponible <= 0}>
                  Solicitar préstamo
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      {seleccionado && (
        <div className="biblioteca-prestamo__fondo">
          <section className="biblioteca-prestamo__ventana"
            role="dialog" aria-modal="true" aria-labelledby="prestamo-titulo">

            <div className="biblioteca-prestamo__encabezado">
              <h2 id="prestamo-titulo">Solicitud de Préstamo</h2>
              <button type="button" className="biblioteca-prestamo__cerrar"
                onClick={handleCancelar}>×</button>
            </div>

            <div className="biblioteca-prestamo__informacion">
              <img src={imagenLibro(seleccionado)} alt={seleccionado.titulo} />

              <div className="biblioteca-prestamo__detalles">
                <h3>{seleccionado.titulo}</h3>
                <p><strong>ISBN:</strong> {seleccionado.isbn}</p>
                <p><strong>Autor:</strong> {seleccionado.autor}</p>
                <p><strong>Categoría:</strong> {seleccionado.categoria}</p>
                <span className="biblioteca-prestamo__disponibles">
                  Disponibles: {seleccionado.stockDisponible}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmar}>
              <div className="biblioteca-prestamo__fecha">
                <label htmlFor="fechaDevolucion">Fecha estimada de devolución</label>
                <input
                  id="fechaDevolucion"
                  type="date"
                  min={fechaHoy()}
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  required
                />
              </div>

              <div className="biblioteca-prestamo__botones">
                <button type="button" className="biblioteca-prestamo__cancelar"
                  onClick={handleCancelar} disabled={enviando}>
                  Cancelar
                </button>
                <button type="submit" className="biblioteca-prestamo__confirmar"
                  disabled={enviando}>
                  {enviando ? 'Registrando...' : 'Confirmar préstamo'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

    </main>
  );
};

export default Catalogo;
