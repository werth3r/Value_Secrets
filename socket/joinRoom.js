const Room = require("../models").Room;
const leaveRoom = require("./leaveRoom");

function inRoom(userlist, user){
    let id = user.roomId;
    for(let item of userlist){
        if(item.roomId == id) return true;
    }
    return false;
}

module.exports =  function(io, socket, notLeave){
    return function(data){
        if(!data.room){
            socket.emit("room-join", {status: false, message: "No room"});
        }else{
            Room.findOne({name: data.room})
            .then((room) => {
                if(!room){
                    socket.emit("room-join", {status: false, message: "No such room"});
                } else {
                    let lastroom = socket.user.room;
                    let userlist = room.users;
                    let roomname = room.name;
                    let newUser = {name: socket.user.nickname, view: socket.user.view,  roomId: socket.user.roomId};
                    if(inRoom(userlist, newUser)){
                        socket.emit("room-join", {status: true, room: roomname, users: userlist});
                    } else {
                        userlist.push(newUser);

                        Room.findOneAndUpdate({name: roomname}, {users: userlist})
                        .then((room) => {
                            console.log("<" + socket.user.nickname + "> join room <" + roomname + ">");
                            socket.emit("room-join", {status: true, room: roomname, users: userlist, isPublic: room.isPublic});
                            if(!room.isPublic){
                                io.sockets.socket(room.admin).emit("key-req", {key: data.key});
                                io.sockets.socket(room.admin).emit("key-res", (key_res) => {
                                    socket.user.room = roomname;
                                    socket.join(room.name);
                                    socket.emit("key-send", key_res)
                                    socket.broadcast.to(room.name).emit("user-join", {id: socket.user.roomId, nickname: socket.user.nickname, view: socket.user.view});
                                    if(!notLeave) leaveRoom(io, socket)(null, lastroom);
                                });
                            } else {
                                socket.user.room = roomname;
                                socket.join(room.name);
                                socket.broadcast.to(room.name).emit("user-join", {id: socket.user.roomId, nickname: socket.user.nickname, view: socket.user.view});
                                if(!notLeave) leaveRoom(io, socket)(null, lastroom);
                            }
                            
                            
                        })
                        .catch((err) => {
                            console.log(err);
                            socket.emit("room-join", {staus: false, message: "Server error"});
                        })
                    }
                };
            })
            .catch((err) => {
                console.log(err);
                socket.emit("room-join", {staus: false, message: "Server error"})
            })
        }
    };
};