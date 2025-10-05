import React, { useState } from 'react';
import { login } from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const response = await login({ email, password });
            console.log('Inicio de sesión exitoso:', response);
            alert('¡Inicio de sesión exitoso!');
            
        } catch (err) {
            console.error('Error de inicio de sesión:', err.response.data);
            alert('Credenciales incorrectas. Inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <h2>Inicio de Sesión</h2>
            <form onSubmit={onSubmit}>
                <input type="email" placeholder="Correo electrónico" name="email" value={email} onChange={onChange} required />
                <input type="password" placeholder="Contraseña" name="password" value={password} onChange={onChange} required />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;