
import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const vacio = {
  isbn: '', titulo: '', autor: '', categoria: '', stockTotal: ''
};

export default function AdminLibros() {
  const [form, setForm] = useState(vacio);
  const [libros, setLibros] = useState([]);
  const [id, setId] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargarLibros = async () => {
    setLibros(await apiRequest('/api/books'));
  };

  useEffect(() => {
    cargarLibros().catch(e => setMensaje(e.message));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const seleccionarLibro = valor => {
    const libro = libros.find(l => String(l.id) === valor);
    setId(valor);
    setForm(libro ? {
      isbn: libro.isbn,
      titulo: libro.titulo,
      autor: libro.autor,
      categoria: libro.categoria,
      stockTotal: String(libro.stockTotal)
    } : vacio);
    setMensaje('');
  };

  const guardarLibro = async (editar = false) => {
    if (Object.values(form).some(v => String(v).trim() === '')) {
      setMensaje('Completa todos los campos.');
      return;
    }

    if (!Number.isInteger(Number(form.stockTotal)) ||
        Number(form.stockTotal) < 0) {
      setMensaje('Ingresa un stock válido.');
      return;
    }

    try {
      setGuardando(true);
      setMensaje('');

      const datos = editar
        ? {
            titulo: form.titulo,
            autor: form.autor,
            stockTotal: Number(form.stockTotal)
          }
        : { ...form, stockTotal: Number(form.stockTotal) };

      await apiRequest(
        editar ? `/api/books/${id}` : '/api/books',
        {
          method: editar ? 'PUT' : 'POST',
          body: JSON.stringify(datos)
        }
      );

      await cargarLibros();
      setMensaje(editar ? 'Libro actualizado correctamente.' : 'Libro registrado correctamente.');

      if (!editar) {
        setId('');
        setForm(vacio);
      }
    } catch (e) {
      setMensaje(e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="libros-admin">
      <div className="admin-panel">
        <h3>▣ Registrar / Editar Libro</h3>
        <p>Captura la información del libro en el formulario.</p>

        <div className="form-libros">
          {[
            ['isbn', 'ISBN'],
            ['titulo', 'Título'],
            ['autor', 'Autor'],
            ['categoria', 'Categoría'],
            ['stockTotal', 'Stock Total']
          ].map(([campo, nombre]) => (
            <label key={campo}>
              {nombre} *
              <input
                name={campo}
                type={campo === 'stockTotal' ? 'number' : 'text'}
                min={campo === 'stockTotal' ? 0 : undefined}
                value={form[campo]}
                onChange={handleChange}
                disabled={!!id && ['isbn', 'categoria'].includes(campo)}
                placeholder={`Ingresa ${nombre.toLowerCase()}`}
              />
            </label>
          ))}
        </div>

        <div className="botones-libros">
          <button disabled={guardando || !!id}
            onClick={() => guardarLibro(false)}>
            + Guardar libro
          </button>

          <button disabled={guardando || !id}
            onClick={() => guardarLibro(true)}>
            ✎ Editar libro
          </button>
        </div>

        {mensaje && <p>{mensaje}</p>}
      </div>

      <div className="admin-panel libro-seleccionado">
        <h3>▣ Libro seleccionado</h3>

        <select value={id} onChange={e => seleccionarLibro(e.target.value)}>
          <option value="">Selecciona un libro</option>
          {libros.map(libro => (
            <option key={libro.id} value={libro.id}>
              {libro.titulo}
            </option>
          ))}
        </select>

        <div className="libro-vista">
          <span>📚</span>
          <p>
            {id
              ? form.titulo
              : 'Selecciona un libro del catálogo para editar su información.'}
          </p>
        </div>

        <button onClick={() => seleccionarLibro('')}>
          Nuevo libro
        </button>
      </div>
    </div>
  );
}
