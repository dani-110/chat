const http = require('http');
const socket = require('socket.io')
const express = require('express')
const path = require('path')

const publicPath = path.join(__dirname, '/public')
const app = express()
let server = http.createServer(app);
let io = socket(server);

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('Connected.....')
    //   socket.on('event', data => { console.log(data) });

    socket.on('createMessage', (msg) => {
        console.log('createMessage', msg)
        io.emit('newMsg', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on('disconnect', () => {
        console.log("disconnected")
    });
});

server.listen(3000, () => {
    console.log("hello activated", publicPath)
});

