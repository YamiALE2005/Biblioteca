
const API_URL = import.meta.env.VITE_API_BASE_URL;
const APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-token": APP_TOKEN,
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "/login";
    throw new Error("Sesión no autorizada");
  }

  if (response.status === 403) {
    throw new Error("Acceso restringido");
  }

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return response.json();
};
