const shortid = require("shortid");
const URL = require("../model/url")

async function handleGenerateNewURL (req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({error: "URL is required"})
    const shortID = shortid(8);

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    return res.render("home", {
        id: shortID,
    });
   
}

async function handleGetAnalytics(res, req) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json ({ 
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewURL,
    handleGetAnalytics,
}