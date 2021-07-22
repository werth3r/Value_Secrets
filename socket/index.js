const config = require("../config");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const sessionStore = require("../lib/sessionStore");

const User = require("../models").User;
const Room = require("../models").Room;

const {joinRoom, connectRoom} = require("./joinRoom");
const createRoom = require("./createRoom");
const changeNickname = require("./changeNickname");
const changeView = require("./changeView");
const leaveRoom = require("./leaveRoom");

function getTime(){
    let time = new Date();
    let h = time.getHours();
    let m = time.getMinutes();
    if(h < 10) h = "0" + h;
    if(m < 10) m = "0" + m;
    return h + ":" + m;
    
}

module.exports = async function(server){
    const io = require("socket.io")(server);
    
    const res = await Room.updateMany({}, {users: []});
   
    Room.findOne({name: "default"}, (err, data) => {
        if(!data){
            Room.create({name: "default", isPublic: true});
            console.log("Created default room")
        }
        if(err)
            console.error(err)
    })
    
    
    io.on("connection", (socket) => {
        //console.log(io.of('/').sockets)
        console.log("New Socket");
        
        //Authorization
        const handshake = socket.handshake;
        handshake.cookie = cookie.parse(handshake.headers.cookie);
        var sid = cookieParser.signedCookie(handshake.cookie["connect.sid"], config.SECRET_SESSION);
        
        sessionStore.load(sid, (err, data) => {
            User
            .findById(data.userId)
            .then(user => {
                
                //Initialization
                socket.user = user;
                socket.emit(
                    "init", 
                    {
                        view: socket.user.view, 
                        nickname: socket.user.nickname
                    }
                )

                joinRoom(io, socket, true)({room: socket.user.room});
                
                socket.on("message", (data) => {
                    let text = data.message;
                    io.to(socket.user.room).emit(
                        "message-send", 
                        {
                            time: getTime(), 
                            login: socket.user.login, 
                            nickname: socket.user.nickname, 
                            view: socket.user.view, 
                            message: text,
                            iv: data.iv
                        }
                    )
                });
                
                socket.on("join", joinRoom(io, socket));
                socket.on("create", createRoom(io, socket));
                socket.on("nickname", changeNickname(io, socket));
                socket.on("view", changeView(io, socket));
                socket.on("disconnect", leaveRoom(io, socket));

                socket.on("key-res", data => {
                    const socketId = data.id
                    io.to(socketId).emit('key-res', {wrapedKey: data.wrapedKey})
                    console.log(typeof io.of('/').sockets)
                    connectRoom(io, io.of('/').sockets[socketId], socket.user.room)
                    
                })
            })
            .catch(err => {
                throw err;
                
            });
        })
        
    });
    return io;
}