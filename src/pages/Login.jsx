import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCargando(true);

      const datos = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.user));

      navigate('/catalogo');

    } catch (error) {
      alert(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="biblioteca-login">
      <section className="biblioteca-login__tarjeta">

        <img
          className="biblioteca-login__logo"
          src="/images/logo-libro.png"
          alt="Logo Biblioteca Universitaria"
        />

        <h1>Biblioteca Universitaria</h1>

        <p className="biblioteca-login__subtitulo">
          Inicia sesión en tu cuenta
        </p>

        <form
          className="biblioteca-login__formulario"
          onSubmit={handleSubmit}
        >
          <label className="biblioteca-login__campo">
            <img src="/images/icono-correo.svg" alt="" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="biblioteca-login__campo">
            <img src="/images/icono-candado.svg" alt="" />

            <input
              type={mostrarPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="biblioteca-login__ojo"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              <img
                src={mostrarPassword
                  ? '/images/icono-ocultar.svg'
                  : '/images/icono-ojo.svg'}
                alt="Mostrar u ocultar contraseña"
              />
            </button>
          </label>

          <button
            type="submit"
            className="biblioteca-login__enviar"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="biblioteca-login__registro">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro">Regístrate</Link>
        </p>

      </section>
    </main>
  );
};

export default Login;
