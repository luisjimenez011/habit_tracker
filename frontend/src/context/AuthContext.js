// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login, register, getUserProfile, getUserChallenges as apiGetUserChallenges } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userChallenges, setUserChallenges] = useState([]);

    const refreshUserChallenges = async () => {
        try {
            const challengesResponse = await apiGetUserChallenges();
            setUserChallenges(challengesResponse.data);
        } catch (error) {
            console.error('Error al recargar los retos del usuario:', error);
            setUserChallenges([]); // Limpiar la lista si falla la llamada
        }
    };

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

    useEffect(() => {
        loadUserFromToken();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            await loadUserFromToken(); // Cargar usuario y retos después del login
            return response;
        } catch (error) {
            throw error;
        }
    };

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