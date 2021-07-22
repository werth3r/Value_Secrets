const Room = require("../models").Room;

module.exports = function(io, socket){
    return function(reason, room){
        let roomname = room || socket.user.room;
        
        Room
        .findOne({name: roomname})
        .then((room) => {
            let userlist = room.users.filter((item) => item.login != socket.user.login);
            
            Room
            .findOneAndUpdate({name: roomname}, {users: userlist})
            .then((room) => {
                console.log("<" + socket.user.nickname + "> left from  room <" + roomname + ">");
                socket.leave(roomname);
                socket.broadcast.to(roomname).emit("user-leave", {login: socket.user.login})
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
    
}