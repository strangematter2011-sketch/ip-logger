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

app.post("/save-ip", (req, res) => {
    try {
        const { name, ip } = req.body;

        if (!name || !ip) {
            return res.status(400).send("Missing name or IP");
        }

        const ips = readIPs();

        // 🔎 Check for duplicate IP
        const existing = ips.find(entry => entry.ip === ip);

        if (existing) {
            console.log("Duplicate IP skipped:", ip);
            return res.send("IP already logged");
        }

        ips.push({
            name,
            ip,
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
app.get("/ips", (req, res) => {
    const ips = readIPs();

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
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
