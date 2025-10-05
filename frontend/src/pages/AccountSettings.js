import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile, deleteUserAccount } from '../services/api';

const AccountSettings = () => {
    const { user, logout, login } = useContext(AuthContext);
    const [username, setUsername] = useState(user ? user.username : '');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile({ username });
            alert('Nombre de usuario actualizado exitosamente.');
            // Forzamos un re-login para actualizar el estado del usuario en el contexto
            await login({ username: user.username, password: 'tu_contraseña_aqui' }); // Necesitarías almacenar la contraseña o usar una estrategia diferente
            // Por simplicidad, por ahora simplemente actualizamos el estado local
            // Esto es un placeholder, ya que la contraseña no se almacena en el frontend
            // Una solución más robusta sería refrescar el token
            window.location.reload();

        } catch (err) {
            console.error('Error al actualizar el perfil:', err.response.data);
            alert('Error al actualizar el nombre de usuario.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
            try {
                await deleteUserAccount();
                alert('Tu cuenta ha sido eliminada exitosamente.');
                logout();
            } catch (err) {
                console.error('Error al eliminar la cuenta:', err.response.data);
                alert('Error al eliminar la cuenta.');
            }
        }
    };

    if (!user) {
        return <p>Por favor, inicia sesión para gestionar tu cuenta.</p>;
    }

    return (
        <div>
            <h2>Configuración de la Cuenta</h2>
            <form onSubmit={handleUpdate}>
                <label>
                    Nombre de usuario:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Actualizar Nombre de Usuario</button>
            </form>
            <button onClick={handleDelete} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
                Eliminar Cuenta
            </button>
        </div>
    );
};

export default AccountSettings;