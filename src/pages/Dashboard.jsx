
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, House, Layers, ShieldCheck, Users,
  CalendarDays, BookPlus, LogOut, Bell, CircleUserRound
} from 'lucide-react';

import AdminLibros from '../components/AdminLibros';
import AdminPrestamos from '../components/AdminPrestamos';
import AdminUsuarios from '../components/AdminUsuarios';
import './Dashboard.css';

const secciones = [
  { nombre: 'Registrar / Editar Libro', icono: BookPlus },
  { nombre: 'Préstamos Activos', icono: CalendarDays },
  { nombre: 'Gestión de Usuarios', icono: Users }
];

const menu = [
  { nombre: 'Inicio', ruta: '/catalogo', icono: House },
  { nombre: 'Catálogo de Libros', ruta: '/catalogo', icono: BookOpen },
  { nombre: 'Mis Préstamos', ruta: '/mis-prestamos', icono: Layers },
  { nombre: 'Administrador', ruta: '/dashboard', icono: ShieldCheck }
];

export default function Dashboard() {
  const [seccion, setSeccion] = useState(0);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-menu">
        <h3 className="admin-brand">
          <BookOpen size={27} />
          Biblioteca Universitaria
        </h3>

        {menu.map(({ nombre, ruta, icono: Icono }) => (
          <Link
            key={nombre}
            to={ruta}
            className={nombre === 'Administrador' ? 'activo' : ''}
          >
            <Icono size={19} /> {nombre}
          </Link>
        ))}

        <button onClick={cerrarSesion}>
          <LogOut size={19} /> Cerrar sesión
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>
            <ShieldCheck size={26} /> Panel de Administrador
          </h2>

          <div className="admin-user">
            <Bell size={21} />
            <CircleUserRound size={25} />
            <span>Administrador · ADMIN</span>
          </div>
        </header>

        <nav className="admin-tabs">
          {secciones.map(({ nombre, icono: Icono }, i) => (
            <button
              key={nombre}
              className={seccion === i ? 'activo' : ''}
              onClick={() => setSeccion(i)}
            >
              <Icono size={18} /> {nombre}
            </button>
          ))}
        </nav>

        {seccion === 0 ? (
          <AdminLibros />
        ) : seccion === 1 ? (
          <AdminPrestamos />
        ) : (
          <AdminUsuarios />
        )}
      </main>
    </div>
  );
}
