const Room = require("../models").Room;
const joinRoom = require("./joinRoom");

module.exports = function(io, socket){
    return function(data) {
        let roomname = data.room;

        Room
        .findOne({name: roomname})
        .then(room => {
            if(room){
                socket.emit("room-create", {status: false, message: "Such room is already created"});
            } else {
                Room
                .create({name: data.room, admin: socket.id, isPublic: data.isPublic})
                .then((data) => {
                    socket.emit("room-create", {status: true, room: roomname});
                    console.log("<" + socket.user.nickname + "> create room <" + roomname + ">");
                    joinRoom(io, socket)({room: roomname});
                })
                .catch(err => {
                    console.log(err);
                    socket.emit("room-create", {status: false, message: "Server error"});
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
}