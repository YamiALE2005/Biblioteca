
import { Link } from 'react-router-dom';
import {
  UserRound,
  Mail,
  GraduationCap,
  ShieldCheck,
  LayoutDashboard,
  ArrowLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import './Perfil.css';

export default function Perfil() {
  const usuario = JSON.parse(
    localStorage.getItem('usuario') || 'null'
  );

  const esAdmin = usuario?.rol === 'ADMIN';

  return (
    <div className="perfil-pagina">
      <div className="perfil-contenedor">

        <div className="perfil-navegacion">
          <Link to="/catalogo" className="perfil-volver">
            <ArrowLeft size={18} />
            Volver al catálogo
          </Link>

          <div className="perfil-marca">
            <BookOpen size={20} />
            Biblioteca Universitaria
          </div>
        </div>

        <div className="perfil-encabezado">
          <h1>Mi Perfil</h1>
          <p>Consulta la información de tu cuenta.</p>
        </div>

        <div className="perfil-tarjeta">
          <div className="perfil-portada" />

          <div className="perfil-identidad">
            <div className="perfil-avatar">
              <UserRound size={36} />
            </div>

            <div className="perfil-nombre">
              <h2>{usuario?.nombre || 'Usuario'}</h2>

              <span className={
                esAdmin ? 'perfil-rol admin' : 'perfil-rol'
              }>
                <ShieldCheck size={15} />
                {esAdmin ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>

          <div className="perfil-informacion">
            <h3>Información personal</h3>

            <div className="perfil-campos">

              <div className="perfil-campo">
                <div className="perfil-icono">
                  <UserRound size={21} />
                </div>
                <div>
                  <span>Nombre completo</span>
                  <strong>
                    {usuario?.nombre || 'No disponible'}
                  </strong>
                </div>
              </div>

              <div className="perfil-campo">
                <div className="perfil-icono">
                  <Mail size={21} />
                </div>
                <div>
                  <span>Correo electrónico</span>
                  <strong>
                    {usuario?.email || 'No disponible'}
                  </strong>
                </div>
              </div>

              <div className="perfil-campo">
                <div className="perfil-icono">
                  <GraduationCap size={21} />
                </div>
                <div>
                  <span>Matrícula</span>
                  <strong>
                    {usuario?.matricula || 'No disponible'}
                  </strong>
                </div>
              </div>

              <div className="perfil-campo">
                <div className="perfil-icono">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <span>Rol de la cuenta</span>
                  <strong>
                    {esAdmin ? 'Administrador' : 'Usuario'}
                  </strong>
                </div>
              </div>

            </div>
          </div>

          {esAdmin && (
            <div className="perfil-administracion">
              <div className="perfil-admin-texto">
                <div className="perfil-admin-icono">
                  <LayoutDashboard size={25} />
                </div>

                <div>
                  <h3>Panel de Administrador</h3>
                  <p>
                    Administra libros, préstamos y usuarios
                    de la biblioteca.
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="perfil-admin-boton"
              >
                Entrar al Panel
                <ChevronRight size={20} />
              </Link>
            </div>
          )}

        </div>

        <p className="perfil-pie">
          Biblioteca Universitaria · Sistema de gestión
        </p>

      </div>
    </div>
  );
}
