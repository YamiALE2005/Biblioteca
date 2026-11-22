import { Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import Dashboard from "./pages/Dashboard"
import Perfil from "./pages/Perfil"
import NotFound from "./pages/NotFound"

function App() {


  return (
    <Routes>
      {/*path: ruta de la pagina que se va a mostrar*/}
      {/*element: componente que se va a mostrar*/}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="*" element={<NotFound />} />
      {/*crear 3 rutas nuevas:
      dashboard
      perfil
      pagina not found
      */}
    </Routes>
  )
}

export default App
