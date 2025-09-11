// frontend/src/components/CreateChallenge.js
import React, { useState } from 'react';
import { createChallenge } from '../services/api';

const CreateChallenge = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration_days: '',
        category_id: ''
    });

    const { title, description, duration_days, category_id } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await createChallenge(formData);
            alert('¡Reto creado exitosamente!');
            setFormData({ title: '', description: '', duration_days: '', category_id: '' }); // Limpia el formulario
        } catch (err) {
            console.error('Error al crear el reto:', err.response.data);
            alert('Error al crear el reto. Asegúrate de estar logueado y de llenar todos los campos.');
        }
    };

    return (
        <div>
            <h2>Crear un Nuevo Reto</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Título del reto" name="title" value={title} onChange={onChange} required />
                <textarea placeholder="Descripción" name="description" value={description} onChange={onChange} required></textarea>
                <input type="number" placeholder="Duración (días)" name="duration_days" value={duration_days} onChange={onChange} required />
                <input type="number" placeholder="ID de la categoría" name="category_id" value={category_id} onChange={onChange} required />
                <button type="submit">Crear Reto</button>
            </form>
        </div>
    );
};

export default CreateChallenge;