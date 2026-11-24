const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_APP_TOKEN;

export const apiRequest = async (ruta, opciones = {}) => {
  const token = localStorage.getItem('token');

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      'x-api-token': API_TOKEN,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opciones.headers
    }
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || 'Error al conectar con la API');
  }

  return datos;
};
