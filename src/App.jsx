
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Catalogo from './pages/Catalogo';
import MisPrestamos from './pages/MisPrestamos';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/mis-prestamos" element={<MisPrestamos />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
