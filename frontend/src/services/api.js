// frontend/src/services/api.js
import axios from 'axios';

// Configuración de la URL base de la API
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Interceptor para añadir el token de autenticación automáticamente
// Esto elimina la necesidad de añadir 'x-auth-token' manualmente en cada petición.
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// --- Funciones de usuario y autenticación ---

// Función para registrar un nuevo usuario
export const register = (userData) => {
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

// Función para obtener el perfil del usuario autenticado (requiere autenticación)
export const getUserProfile = () => {
    return api.get('/users/me');
};

// Función para actualizar el perfil del usuario (requiere autenticación)
export const updateUserProfile = (userData) => {
    return api.put('/users/me', userData);
};

// Función para eliminar la cuenta del usuario (requiere autenticación)
export const deleteUserAccount = () => {
    return api.delete('/users/me');
};

// Función para obtener el perfil de cualquier usuario por su ID
export const getUserProfileById = (userId) => {
    return api.get(`/users/${userId}`);
};

// --- Funciones de retos ---

// Función para obtener todos los retos disponibles
export const getChallenges = ({ search = '', category_id = '' } = {}) => {
    return api.get('/challenges', {
        params: { search, category_id }
    });
};

// Función para crear un nuevo reto (requiere autenticación)
export const createChallenge = (challengeData) => {
    return api.post('/challenges', challengeData);
};

// Función para unirse a un reto (requiere autenticación)
export const joinChallenge = (challengeId) => {
    return api.post(`/challenges/${challengeId}/join`, {});
};

// Función para obtener los retos a los que se ha unido el usuario autenticado (requiere autenticación)
export const getUserChallenges = () => {
    return api.get('/challenges/me');
};

// Función para obtener los retos creados
export const getCreatedChallenges = () => {
    return api.get('/challenges/created');
};

// Función para marcar el progreso de un reto (requiere autenticación)
export const markChallengeProgress = (challengeId) => {
    return api.put(`/challenges/${challengeId}/progress`, {});
};

// Función para obtener a los participantes de un reto
export const getChallengeParticipants = (challengeId) => {
    return api.get(`/challenges/${challengeId}/participants`);
};

// Función para obtener todas las categorías de retos
export const getCategories = () => {
    return api.get('/challenges/categories');
};

//función para obtener los detalles de un solo reto.
export const getChallengeDetails = (challengeId) => {
    return api.get(`/challenges/${challengeId}`);
};

// --- Funciones de comentarios ---

// Función para obtener los comentarios de un reto específico
export const getComments = (challengeId) => {
    return api.get(`/comments/${challengeId}`);
};

// Función para añadir un nuevo comentario a un reto (requiere autenticación)
export const addComment = (challengeId, commentData) => {
    return api.post(`/comments/${challengeId}`, commentData);
};