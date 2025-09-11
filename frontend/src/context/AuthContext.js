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
            const challenges = await apiGetUserChallenges();
            setUserChallenges(challenges.data);
        } catch (error) {
            console.error('Error al recargar los retos del usuario:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const profile = await getUserProfile();
                    setUser(profile.data);
                    await refreshUserChallenges();
                } catch (error) {
                    console.error('Error al obtener los datos del usuario:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleLogin = async (credentials) => {
        const response = await login(credentials);
        const profile = await getUserProfile();
        setUser(profile.data);
        await refreshUserChallenges();
        return response;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setUserChallenges([]);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout, userChallenges, refreshUserChallenges }}>
            {children}
        </AuthContext.Provider>
    );
};