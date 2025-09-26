// Super-einfache server.js für den Test

const express = require('express');
const path = require('path');

const app = express();
const server = require('http' ).createServer(app);

// Die einzige Aufgabe: Wenn jemand die Haupt-URL aufruft, sende die index.html
app.get('/', (req, res) => {
    console.log('Anfrage erhalten. Sende die Test-index.html...');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server starten
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Minimal-Server läuft auf Port ${PORT}`);
});
