const express = require("express");
const path = require('path');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const staticRoute = require('./routes/staticrouter.js')
const app = express();
const PORT = 8007;

connectToMongoDB('')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/url", urlRoute);
app.use("/",staticRoute);

app.get("/test", async (req, res) => {
    try {
        const allUrls = await URL.find({});
        return res.render("home", { urls:allUrls }); 
    } catch (err) {
        console.error("Error fetching URLs:", err);
        return res.status(500).send("Internal Server Error");
    }
});

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId: shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // Return the updated document
        );

        if (!entry) {
            return res.status(404).send("URL not found");
        }

        res.redirect(entry.redirectURL);
    } catch (err) {
        console.error("Error redirecting:", err);
        return res.status(500
        ).send("Internal Server Error");
    }
});

app.listen(PORT, () => console.log(`Server started at port : ${PORT}`));