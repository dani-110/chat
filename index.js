const http = require('http');
const socket = require('socket.io')
const express = require('express')
const path = require('path')

const publicPath = path.join(__dirname, '/public')
const app = express()
let server = http.createServer(app);
let io = socket(server);

const {Users} = require('./utils/user')
let users = new Users();

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log(socket.id, 'socket.id');
    console.log('Connected.....')
    
    socket.on('joinRoom',(params)=>{
        console.log(params,'params')
        socket.join(params.room)
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
    })
    
    socket.on('createMessage', (msg) => {
        let user = users.getUser(socket.id)
            io.to(user.room).emit('newMsg', {
                from: msg.from,
                text: msg.text,
                createdAt: new Date().getTime()
            })
        
      })

    socket.on('disconnect', () => {
        let user = users.getUser(socket.id)
        users.removeUser(socket.id);
        socket.leave(user.room)
        console.log("disconnected")
    });
});

server.listen(3000, () => {
    console.log("hello activated", publicPath)
});

