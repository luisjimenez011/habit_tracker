const client = require("../database");

/**
 * Verifica si el usuario cumple con los requisitos de nuevas insignias y las otorga.
 * @param {number} userId - ID del usuario.
 * @param {object} stats - Objeto con las estadísticas del usuario (debe incluir: points, completed_count, created_count, days_since_signup, comments_written, streak_days, is_early_bird, is_night_owl).
 * @returns {Promise<string[]>} - Lista de nombres de las nuevas insignias otorgadas.
 */
const checkAndAwardBadges = async (userId, stats) => {
    try {
        // 1. Buscar todas las insignias disponibles
        const badgesResult = await client.query("SELECT id, name, required_value, type FROM badges");
        const availableBadges = badgesResult.rows;

        // 2. Buscar las insignias que el usuario ya tiene
        const userBadgesResult = await client.query("SELECT badge_id FROM user_badges WHERE user_id = $1", [userId]);
        const awardedBadgeIds = new Set(userBadgesResult.rows.map(row => row.badge_id));
        
        const newlyAwardedBadges = [];

        for (const badge of availableBadges) {
            if (awardedBadgeIds.has(badge.id)) {
                continue;
            }

            let meetsRequirement = false;
            let userValue = 0;

            // 3. Obtener el valor de la estadística para comparar
            if (badge.type === 'points') {
                userValue = stats.points;
            } else if (badge.type === 'challenges_completed') {
                userValue = stats.completed_count;
            } else if (badge.type === 'challenges_created') {
                userValue = stats.created_count;
            } else if (badge.type === 'days_since_signup') {
                userValue = stats.days_since_signup;
            } else if (badge.type === 'comments_written') { 
                userValue = stats.comments_written || 0; 
            } else if (badge.type === 'streak_days') { 
                userValue = stats.streak_days || 0;
            } else if (badge.type === 'special_time') {
                // Lógica especial para Noctámbulo/Madrugador 
                if (badge.name === 'Madrugador' && stats.is_early_bird) {
                    meetsRequirement = true;
                } else if (badge.name === 'Noctámbulo' && stats.is_night_owl) {
                    meetsRequirement = true;
                }
            }
            
            // 4. Comparar requisito (Solo para tipos basados en required_value)
            if (badge.type !== 'special_time' && userValue >= badge.required_value) {
                meetsRequirement = true;
            }
            
            // 5. Otorgar la insignia si cumple el requisito
            if (meetsRequirement) {
                await client.query(
                    "INSERT INTO user_badges (user_id, badge_id, awarded_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id, badge_id) DO NOTHING",
                    [userId, badge.id]
                );
                newlyAwardedBadges.push(badge.name);
            }
        }

        return newlyAwardedBadges;
    } catch (err) {
        console.error("Error al verificar y otorgar insignias:", err.message);
        return [];
    }
};

module.exports = { checkAndAwardBadges };
