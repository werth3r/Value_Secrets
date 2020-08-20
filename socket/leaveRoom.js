const Room = require("../models").Room;

module.exports = function(io, socket){
    return function(reason, room){
        let roomname = room || socket.user.room;
        Room.findOne({name: roomname})
        .then((room) => {
            let userlist = room.users;
            for(let i = 0; i < userlist.length; i++){
                let user = userlist[i];
                if(user.roomId === socket.user.roomId){
                    userlist.splice(i, 1);
                    break;
                }
            }
            Room.findOneAndUpdate({name: roomname}, {users: userlist})
            .then((room) => {
                console.log("<" + socket.user.nickname + "> left from  room <" + roomname + ">");
                socket.leave(roomname);
                socket.broadcast.to(roomname).emit("user-leave", {id: socket.user.roomId})
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