import axios from "axios";
import db from "../datab.js";

export const getPrediction = async (req, res) => {
    try {
        const houseData = req.body;
        const userId = req.user.id; 
        const fastapiRes = await axios.post(`${process.env.ML_API_URL}/predict`, houseData, { timeout: 90000 });
        const predictedPrice = fastapiRes.data.predicted_price;
        await db.query(
            `INSERT INTO predictions 
            (user_id, bedrooms, bathrooms, sqft_living, sqft_lot, floors, predicted_price) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                userId, 
                houseData.bedrooms, 
                houseData.bathrooms, 
                houseData.sqft_living, 
                houseData.sqft_lot, 
                houseData.floors, 
                predictedPrice
            ]
        );
        return res.json({ predicted_price: predictedPrice });

    } catch (error) {
        console.error("Prediction/Saving error:", error.message);
        return res.status(500).json({ error: "Failed to process prediction request." });
    }
};