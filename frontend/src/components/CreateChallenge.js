import React, { useState, useEffect, useContext } from 'react';
import { createChallenge, getCategories } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CreateChallenge = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration_days, setDurationDays] = useState(1);
    const [categoryId, setCategoryId] = useState(''); // Inicializado a cadena vacía
    const [categories, setCategories] = useState([]); // Nuevo estado para guardar las categorías
    const { user } = useContext(AuthContext);

    // Usa useEffect para cargar las categorías al inicio
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (err) {
                console.error('Error al obtener las categorías:', err);
            }
        };
        fetchCategories();
    }, []); // El array vacío asegura que se ejecute solo una vez

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createChallenge({
                title,
                description,
                duration_days,
                category_id: categoryId
            });
            alert('Reto creado exitosamente!');
            setTitle('');
            setDescription('');
            setDurationDays(1);
            setCategoryId(''); // Limpiar el estado de categoría después de crear
        } catch (err) {
            console.error('Error al crear el reto:', err.response.data);
            alert('Error al crear el reto. Por favor, asegúrate de haber seleccionado una categoría válida.');
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
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Crear Reto</button>
            </form>
        </div>
    );
};

export default CreateChallenge;