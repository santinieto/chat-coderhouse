import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from "express-handlebars"

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Endpoints
import viewsRouter from './routes/views.router.js';
app.use('/', viewsRouter);

// Lista de mensajes
const messages = []

// Websockets
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado! >>>', socket.id);
    
    socket.on('new user', (username) => {
        console.log(`Nuevo usuario en el chat: ${username}`);
        
        // Le mando la historia de mensajes al nuevo cliente
        socket.emit('chat history', messages)
        
        // Le avisamos a los otros usuarios que un nuevo usuario se conecto
        socket.broadcast.emit('new user notification', username);
    });

    socket.on('chat message', (data) => {
        // console.log(`Mensaje de ${data.username}: ${data.message}`);
        messages.push({id: data.username, text: data.message});
        
        // Le mando el mensaje a todos los clientes
        io.emit('broadcast message', {username: data.username, message: data.message});
    });
});

// Levantamos el servidor
server.listen(PORT, () => { // Ojo aca que habia puesto app.listen()
    console.log(`Servicio iniciado en el puerto ${PORT}... http://localhost:${PORT}`);
});
