import db from "../datab.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const userResult = await db.query(
            "SELECT id, username, role, created_at FROM users WHERE id = $1", 
            [userId]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User profile not found." });
        }
        const historyResult = await db.query(
            `SELECT id, bedrooms, bathrooms, sqft_living, sqft_lot, floors, predicted_price, created_at 
             FROM predictions 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [userId]
        );
        return res.json({
            user: userResult.rows[0],
            prediction_history: historyResult.rows 
        });

    } catch (e) {
        console.error("Profile fetch failure:", e);
        return res.status(500).json({ error: "Internal Server Error loading profile dashboard" });
    }
};