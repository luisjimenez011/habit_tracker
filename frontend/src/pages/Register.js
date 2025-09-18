// src/pages/Register.js
import React, { useState } from 'react';
import { register } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { username, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const response = await register({ username, email, password });
            console.log('Registro exitoso:', response.data);
            alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        } catch (err) {
            console.error('Error de registro:', err.response.data);
            alert('Error al registrarse. Inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Nombre de usuario" name="username" value={username} onChange={onChange} required />
                <input type="email" placeholder="Correo electrónico" name="email" value={email} onChange={onChange} required />
                <input type="password" placeholder="Contraseña" name="password" value={password} onChange={onChange} required />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;