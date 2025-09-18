// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login, register, getUserProfile, getUserChallenges as apiGetUserChallenges } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userChallenges, setUserChallenges] = useState([]);

    // Función para recargar la lista de retos del usuario desde la API
    const refreshUserChallenges = async () => {
        try {
            const challengesResponse = await apiGetUserChallenges();
            setUserChallenges(challengesResponse.data);
        } catch (error) {
            console.error('Error al recargar los retos del usuario:', error);
            setUserChallenges([]);
        }
    };

    // Función para cargar los datos del usuario y sus retos al inicio
    const loadUserFromToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const profileResponse = await getUserProfile();
                setUser(profileResponse.data);
                await refreshUserChallenges();
            } catch (error) {
                console.error('Error al cargar el usuario o retos:', error);
                localStorage.removeItem('token');
                setUser(null);
                setUserChallenges([]);
            }
        }
        setLoading(false);
    };

    // Este efecto se ejecuta una vez al cargar el componente
    useEffect(() => {
        loadUserFromToken();
    }, []);

    // Función para manejar el inicio de sesión
    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            // Después del login exitoso, cargamos el perfil del nuevo usuario.
            const profileResponse = await getUserProfile();
            setUser(profileResponse.data);
            // Y luego, recargamos sus retos.
            await refreshUserChallenges();
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Función para cerrar la sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setUserChallenges([]);
    };

    const value = {
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        userChallenges,
        refreshUserChallenges,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};