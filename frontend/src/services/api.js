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


// Función para unirse a un reto (requiere autenticación)
export const joinChallenge = async (challengeId) => {
    const token = getToken();
    if (!token) {
        throw new Error('No hay token de autenticación.');
    }
    const response = await api.post(`/challenges/${challengeId}/join`, {}, {
        headers: {
            'x-auth-token': token,
        },
    });
    return response;
};

export const getUserChallenges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No hay token de autenticación.');
    }
    return api.get('/challenges/me', {
        headers: {
            'x-auth-token': token,
        },
    });
};