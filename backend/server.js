const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

function extractJSON(text) {
    try {
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        if (start === -1 || end === -1) return null;
        return JSON.parse(text.substring(start, end + 1));
    } catch (err) { return null; }
}

app.post("/search", async (req, res) => {
    const { q, history = [] } = req.body;

    try {
        const messages = [
            {
                role: "system",
                content: `You are NomadPulse AI. 
1. For places: Return a JSON array of objects. Ensure all places are geographically clustered (same city as user query).
2. NEVER suggest places from another country unless explicitly asked.
3. For chat: Return plain text.
4. ALWAYS include a 'THEME:' field at the start.`
            },
            ...history,
            { role: "user", content: q }
        ];

        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_KEY.trim()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages
            })
        });

        const aiData = await aiRes.json();

        if (!aiData.choices) {
            throw new Error("Invalid AI response");
        }

        const content = aiData.choices[0].message.content;

        const themeMatch = content.match(/THEME:\s*(\w+)/i);
        const theme = themeMatch ? themeMatch[1].toLowerCase() : "default";
        const cleanContent = content.replace(/THEME:\s*\w+/i, "").trim();

        const placesArray = extractJSON(cleanContent);

        if (placesArray) {
            const results = await Promise.all(placesArray.map(async (p) => {
                const gUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(p.name + " Chennai")}&key=${GOOGLE_KEY}`;

                const gRes = await fetch(gUrl);
                const gData = await gRes.json();
                const place = gData.results?.[0];

                return {
                    name: p.name,
                    description: p.description,
                    rating: place?.rating || "N/A",
                    address: place?.formatted_address || "Address unknown",
                    image: place?.photos
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_KEY}`
                        : "https://via.placeholder.com/400x200?text=No+Image"
                };
            }));

            res.json({ type: "places", data: results, theme });
        } else {
            res.json({ type: "chat", data: cleanContent, theme });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post("/plan", async (req, res) => {
    const { places, query } = req.body;
    try {
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${OPENROUTER_KEY.trim()}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: [{ 
                    role: "system", 
                    content: `Create a comprehensive 24-hour "One Day Exploration Plan". 
                    STRICT RULES:
                    1. DO NOT use clock timings (e.g., No "9:00 AM" or "14:00").
                    2. Organize the itinerary into three clear sections: **Morning**, **Afternoon**, and **Evening**.
                    3. Provide a logical flow between the locations provided.
                    4. Use bold headers and relevant emojis for each spot.` 
                }, { 
                    role: "user", 
                    content: `Plan for: ${query}. Places: ${JSON.stringify(places)}` 
                }]
            })
        });
        const data = await aiRes.json();
        res.json({ plan: data.choices[0].message.content });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(3000, () => console.log("NomadPulse Server Running"));