import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Add to .env.local
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export default async function handler(req, res) {
    const { city } = req.query;
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: "metric", // Celsius
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}