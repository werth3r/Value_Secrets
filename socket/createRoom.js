const Room = require("../models").Room;
const {connectRoom} = require("./joinRoom");

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
                .create({name: data.room, admin: socket.user.login, isPublic: data.isPublic, key: data.key})
                .then((data) => {
                    socket.emit("room-create", {status: true, room: roomname});
                    console.log("<" + socket.user.nickname + "> create room <" + roomname + ">");
                    connectRoom(io, socket, roomname);
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