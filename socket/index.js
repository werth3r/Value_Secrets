const config = require("../config");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const sessionStore = require("../lib/sessionStore");

const User = require("../models").User;
const Room = require("../models").Room;

const joinRoom = require("./joinRoom");
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

module.exports = function(server){
    const io = require("socket.io")(server);
    io.count = 0;
    
    Room.create({name: "default", isPublic: true});
    
    io.on("connection", (socket) => {
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
                socket.user.roomId = io.count++;
                socket.user.room = "default";
                socket.emit("init", 
                {view: socket.user.view, nickname: socket.user.nickname, id: socket.user.roomId});
                joinRoom(io, socket, true)({room: "default"});
                
                socket.on("message", (data) => {
                    let text = data.message;
                    io.to(socket.user.room).emit("message-send", {time: getTime(), author: socket.user.roomId, message: text})
                });
                
                socket.on("join", joinRoom(io, socket));
                socket.on("create", createRoom(io, socket));
                socket.on("nickname", changeNickname(io, socket));
                socket.on("view", changeView(io, socket));
                socket.on("disconnect", leaveRoom(io, socket));
            })
            .catch(err => {
                throw err;
                
            });
        })
        
    });
    return io;
}