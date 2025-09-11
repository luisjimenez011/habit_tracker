// api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configuración inicial de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para registrar un nuevo usuario
export const register = async (userData) => {
  return api.post('/users/register', userData);
};

// Función para iniciar sesión
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  const { token } = response.data;
  // Almacena el token en localStorage para futuras peticiones
  localStorage.setItem('token', token);
  return response.data;
};

// Función para obtener el token del almacenamiento local
const getToken = () => {
  return localStorage.getItem('token');
};

// Función para obtener todos los retos
export const getChallenges = async () => {
  return api.get('/challenges');
};

// Función para crear un nuevo reto (requiere autenticación)
export const createChallenge = async (challengeData) => {
  const token = getToken();
  return api.post('/challenges', challengeData, {
    headers: {
      'x-auth-token': token,
    },
  });
};

// Puedes añadir aquí más funciones para el resto de tus rutas...
// Por ejemplo:
// export const getUserProfile = async () => { ... }
// export const getChallengeComments = async (challengeId) => { ... }