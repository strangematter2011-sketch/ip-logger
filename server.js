const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ==========================
// MongoDB Connection
// ==========================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// ==========================
// Schema + Model
// ==========================
const ipSchema = new mongoose.Schema({
    name: String,
    ip: String,
    time: {
        type: Date,
        default: Date.now
    }
});

const IP = mongoose.model("IP", ipSchema);

// ==========================
// Save IP Route
// ==========================
app.post("/save-ip", async (req, res) => {
    try {
        const { name, ip } = req.body;

        if (!name || !ip) {
            return res.status(400).send("Missing name or IP");
        }

        // 🔎 Check for duplicate IP
        const existing = await IP.findOne({ ip });

        if (existing) {
            console.log("Duplicate IP skipped:", ip);
            return res.send("IP already logged");
        }

        const newEntry = new IP({ name, ip });
        await newEntry.save();

        console.log("Saved:", name, ip);
        res.send("Saved successfully");

    } catch (err) {
        console.error("Error saving IP:", err);
        res.status(500).send("Server error");
    }
});

// ==========================
// View IPs (Password Protected)
// ==========================
app.get("/ips", async (req, res) => {

    if (req.query.password !== "mypassword") {
        return res.send("Access denied");
    }

    try {
        const ips = await IP.find().sort({ time: -1 });

        let rows = ips.map(entry => `
            <tr>
                <td>${entry.name}</td>
                <td>${entry.ip}</td>
                <td>${new Date(entry.time).toLocaleString()}</td>
            </tr>
        `).join("");

        res.send(`
            <html>
            <head>
                <title>IP Dashboard</title>
                <style>
                    body {
                        font-family: Arial;
                        background: #111;
                        color: white;
                        padding: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 10px;
                        border: 1px solid #444;
                    }
                    th {
                        background: #222;
                    }
                    tr:nth-child(even) {
                        background: #1a1a1a;
                    }
                </style>
            </head>
            <body>
                <h1>IP Dashboard</h1>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>IP</th>
                        <th>Time</th>
                    </tr>
                    ${rows}
                </table>
            </body>
            </html>
        `);

    } catch (err) {
        console.error("Error fetching IPs:", err);
        res.status(500).send("Server error");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});