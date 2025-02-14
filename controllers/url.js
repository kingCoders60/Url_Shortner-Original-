const nanoid = require("nanoid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const shortID = nanoid(8);
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: []
        });
        return res.json({ id: shortID });
    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    try {
        const result = await URL.findOne({ shortId: shortId });
        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Error retrieving analytics:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
};