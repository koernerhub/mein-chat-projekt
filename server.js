// Finale, bereinigte Version der server.js

const express = require('express');
const http = require('http' );
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path'); // Wichtig für einen robusten Dateipfad

const app = express();
const server = http.createServer(app );
const io = new Server(server);

const CHAT_HISTORY_FILE = path.join(__dirname, 'chat.txt');

// --- ROUTE 1: Die Webseite ausliefern ---
// Diese Anweisung fängt alle Anfragen ab, die an die Haupt-URL gehen.
app.get('/', (req, res) => {
    console.log('HTTP-Anfrage für / empfangen. Sende index.html...');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ROUTE 2: Die Echtzeit-Kommunikation ---
// Dieser Teil wird NUR aktiv, wenn ein Client eine WebSocket-Verbindung aufbaut.
io.on('connection', (socket) => {
    console.log('Ein Benutzer hat sich per WebSocket verbunden.');

    // Sende den Chatverlauf, falls die chat.txt existiert
    if (fs.existsSync(CHAT_HISTORY_FILE)) {
        fs.readFile(CHAT_HISTORY_FILE, 'utf8', (err, data) => {
            if (!err) {
                socket.emit('history', data);
            }
        });
    }

    // Lausche auf neue Nachrichten
    socket.on('new message', (msg) => {
        console.log('Neue Nachricht empfangen:', msg);
        fs.appendFile(CHAT_HISTORY_FILE, msg + '\n', (err) => {
            if (err) console.error('Fehler beim Speichern:', err);
        });
        io.emit('new message', msg);
    });

    // Handle den Verbindungsabbruch
    socket.on('disconnect', () => {
        console.log('Ein Benutzer hat die Verbindung getrennt.');
    });
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT} und wartet auf Anfragen...`);
});
