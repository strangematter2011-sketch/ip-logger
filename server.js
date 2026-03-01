const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const filePath = path.join(__dirname, "ips.json");

// Save IP
app.post("/save-ip", (req, res) => {
    const ip = req.body.ip;

    // Read existing IPs
    let ips = JSON.parse(fs.readFileSync(filePath));

    // Add new IP
    ips.push(ip);

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(ips, null, 2));

    console.log("Saved IP:", ip);
    res.send("IP saved");
});

// View all IPs
app.get("/ips", (req, res) => {
    const ips = JSON.parse(fs.readFileSync(filePath));
    res.json(ips);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});