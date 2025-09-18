// frontend/src/components/CreateChallenge.js
import React, { useState, useContext } from 'react';
import { createChallenge } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CreateChallenge = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration_days, setDurationDays] = useState(1);
    const [categoryId, setCategoryId] = useState(1);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createChallenge({ title, description, duration_days, category_id: categoryId });
            alert('Reto creado exitosamente!');
            setTitle('');
            setDescription('');
            setDurationDays(1);
            setCategoryId(1);
        } catch (err) {
            console.error('Error al crear el reto:', err.response.data);
            alert('Error al crear el reto. Debes iniciar sesión.');
        }
    };

    if (!user) {
        return <p>Por favor, inicia sesión para crear un reto.</p>;
    }

    return (
        <div>
            <h2>Crear un Nuevo Reto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Título:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="duration_days">Duración (días):</label>
                    <input
                        type="number"
                        id="duration_days"
                        value={duration_days}
                        onChange={(e) => setDurationDays(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category_id">Categoría:</label>
                    <select
                        id="category_id"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        {/* Asume que tienes categorías en tu base de datos y los IDs corresponden */}
                        <option value="1">Deporte</option>
                        <option value="2">Lectura</option>
                        <option value="3">Meditación</option>
                    </select>
                </div>
                <button type="submit">Crear Reto</button>
            </form>
        </div>
    );
};

export default CreateChallenge;