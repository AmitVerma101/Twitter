require('dotenv').config()
const socket = require("socket.io")
const express = require('express')
const cors = require('cors')
const app = express()
// const server = require('http').createServer(app);
app.use(express.json());
app.use(cors())
app.use(express.static('uploads/tweets'))
app.use(express.static('uploads/profile'))
const Authenticate = require('./Routes/Authenticate')
app.use('/',Authenticate);

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });
// io.emit('event', 'Sending the data to the client');
app.get('/',(req,res)=>{
    
    console.log("On the / endpoint")
    res.end("hello")
})
const server = app.listen(process.env.PORT,()=>{
    console.log("Server Running at port http://localhost:4000")
})
const io = require('socket.io')(server,{
    cors:{
        origin:'*'
    }
});
global.onlineUsers = new Map();
io.on("connection",( socket )=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id)
        console.log("Consoling the u_id in the socket part")
        console.log(userId);
    })
    socket.on("send_msg",(data)=>{
        console.log("consoling the data in send_msg")
        console.log(data)
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("recieve-message",data.msg);
        }
    })
})



