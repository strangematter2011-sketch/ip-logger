const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Store IPs in an array
let collectedIPs = [];

// Save IP
app.post("/save-ip", (req, res) => {
    const ip = req.body.ip;
    collectedIPs.push(ip);
    console.log("Saved IP:", ip);
    res.send("IP logged");
});

// View all IPs
app.get("/ips", (req, res) => {
    res.json(collectedIPs);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});