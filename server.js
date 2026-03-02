const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const filePath = path.join(__dirname, "ips.json");

// ✅ Ensure ips.json exists
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

// Helper function to safely read IPs
function readIPs() {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading ips.json. Resetting file.", err);
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        return [];
    }
}

// Save IP + Name
app.post("/save-ip", (req, res) => {
    try {
        const { name, ip } = req.body;

        if (!name || !ip) {
            return res.status(400).send("Missing name or IP");
        }

        const ips = readIPs();

        ips.push({
            name: name,
            ip: ip,
            time: new Date().toISOString()
        });

        fs.writeFileSync(filePath, JSON.stringify(ips, null, 2));

        console.log("Saved:", name, ip);
        res.send("Saved successfully");

    } catch (err) {
        console.error("Error saving IP:", err);
        res.status(500).send("Server error");
    }
});

// View all IPs
app.get("/ips", (req, res) => {
    try {
        const ips = readIPs();
        res.json(ips);
    } catch (err) {
        console.error("Error fetching IPs:", err);
        res.status(500).send("Server error");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
