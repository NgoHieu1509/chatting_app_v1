const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words')
const { createTimeMessages } = require('./utils/create-time-messages');
const { getUserList, addUser, removeUser, findUser } = require('./utils/user.utils');
const app = express();
const PORT = 5000;


const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))

const server = http.createServer(app)
const io = socketio(server)


const messges = 'hello world'
//lang nghe su kien ket noi tu phia client
io.on('connection',(socket) =>{
    //truyen su kien cos chua duw lieuj tu server ve phia client
    // socket.emit('send messges from server to client',messges)
    //nhan yeu cau tu phia client
    // socket.on("send increment from client to server", () => {
    //      count++
    //     socket.emit('send count from client to server',count)
    // })
    socket.on("join room from client to server",({room,username}) =>{
        socket.join(room)

    //gửi cho client vừa kết nối vào
   socket.emit('send messges form server to client',createTimeMessages(`User đã kết nối vào phòng ${room}`,"Admin"))


   //gửi thông báo cho các client còn lại
   socket.broadcast.to(room).emit('send messges form server to client',createTimeMessages(`Có người dùng mới vừa tham gia trò chuyện phòng ${room}`,"Admin"))
   
   
   socket.on("send messges form client to server",(messgesText,callback) =>{
    const filter = new Filter()
    if(filter.isProfane(messgesText)){
        return callback("Messges có chưa từ ngữ không hợp lệ")
    }
   

    const id = socket.id
    const user = findUser(id)

    const messages = createTimeMessages(messgesText,user.username)
    io.to(room).emit("send messges form server to client",messages)
    callback()
})


    socket.on("send position from client to server",({latitude, longitude}) =>{
        const id = socket.id
        const user = findUser(id)
    const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`
    io.to(room).emit("send position from server to client",createTimeMessages(linkLocation,user.username))
})


    //xử lý userList
    const newUser ={
        id: socket.id,
        username,
        room
    }
    addUser(newUser)
    io.to(room).emit("send userList from server to client",getUserList(room))
    //ngat ket noi
    socket.on('disconnect',() =>{
        removeUser(socket.id)
        io.to(room).emit("send userList from server to client",getUserList(room))
        io.to(room).emit("send client disconnected from server to client",`nguoi dung ${username} vua thoa khoi phong`)
        console.log("client disconnected")
    })
})   
})

server.listen(PORT, () =>{
    console.log(`running on http://localhost:${PORT}`);
})