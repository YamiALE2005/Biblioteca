
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Catalogo from './pages/Catalogo';
import MisPrestamos from './pages/MisPrestamos';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';

function RutaAdmin({ children }) {
  const token = localStorage.getItem('token');
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    usuario = null;
  }

  if (!token) return <Navigate to="/login" replace />;
  if (usuario?.rol !== 'ADMIN')
    return <Navigate to="/catalogo" replace />;

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/mis-prestamos" element={<MisPrestamos />} />
      <Route path="/perfil" element={<Perfil />} />

      <Route path="/dashboard" element={
        <RutaAdmin>
          <Dashboard />
        </RutaAdmin>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
