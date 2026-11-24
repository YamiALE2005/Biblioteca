
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '', matricula: '', email: '',
    password: '', confirmarPassword: ''
  });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      setCargando(true);

      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          matricula: formData.matricula.trim(),
          email: formData.email.trim(),
          password: formData.password,
          rol: 'USER'
        })
      });

      alert('¡Usuario registrado correctamente!');
      navigate('/login');

    } catch (error) {
      alert(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="biblioteca-registro">
      <section className="biblioteca-registro__tarjeta">

        <div className="biblioteca-registro__encabezado">
          <img className="biblioteca-registro__logo"
            src="/images/logo-libro.png" alt="Logo Biblioteca" />
          <h1>Biblioteca Universitaria</h1>
          <p>Crear una cuenta</p>
        </div>

        <form className="biblioteca-registro__formulario" onSubmit={handleSubmit}>
          <label className="biblioteca-registro__campo">
            <img src="/images/icono-usuario.svg" alt="" />
            <input name="nombre" placeholder="Nombre completo"
              value={formData.nombre} onChange={handleChange}
              aria-label="Nombre completo" required />
          </label>

          <label className="biblioteca-registro__campo">
            <img src="/images/icono-matricula.svg" alt="" />
            <input name="matricula" placeholder="Matrícula"
              value={formData.matricula} onChange={handleChange}
              aria-label="Matrícula" required />
          </label>

          <label className="biblioteca-registro__campo">
            <img src="/images/icono-correo.svg" alt="" />
            <input type="email" name="email" placeholder="Correo electrónico"
              value={formData.email} onChange={handleChange}
              aria-label="Correo electrónico" required />
          </label>

          <label className="biblioteca-registro__campo">
            <img src="/images/icono-candado.svg" alt="" />
            <input type="password" name="password" placeholder="Contraseña"
              value={formData.password} onChange={handleChange}
              aria-label="Contraseña" autoComplete="new-password" required />
          </label>

          <label className="biblioteca-registro__campo">
            <img src="/images/icono-candado.svg" alt="" />
            <input type="password" name="confirmarPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmarPassword} onChange={handleChange}
              aria-label="Confirmar contraseña" autoComplete="new-password" required />
          </label>

          <button className="biblioteca-registro__enviar"
            type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="biblioteca-registro__volver">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
};

export default Registro;
