const express = require('express');
const http = require('http' );
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app );
const io = new Server(server);

const CHAT_HISTORY_FILE = './chat.txt';

io.on('connection', (socket) => {
    console.log('Ein Benutzer hat sich verbunden.');

    // KORREKTUR: Prüfe ZUERST, ob die Datei überhaupt existiert
    if (fs.existsSync(CHAT_HISTORY_FILE)) {
        // Wenn ja, lies sie und sende den Inhalt
        fs.readFile(CHAT_HISTORY_FILE, 'utf8', (err, data) => {
            if (!err) {
                socket.emit('history', data);
            }
        });
    }

    socket.on('new message', (msg) => {
        console.log('Neue Nachricht:', msg);
        fs.appendFile(CHAT_HISTORY_FILE, msg + '\n', (err) => {
            if (err) {
                console.error('Fehler beim Speichern der Nachricht:', err);
            }
        });
        io.emit('new message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Ein Benutzer hat die Verbindung getrennt.');
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
