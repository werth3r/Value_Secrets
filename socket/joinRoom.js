const Room = require("../models").Room;
const User = require("../models").User;
const leaveRoom = require("./leaveRoom");

function inRoom(userlist, user){
    const login = user.login;
    for(let item of userlist){
        if(item.login == login) return true;
    }
    return false;
}

function connectRoom(io, socket, roomName, notLeave){
    Room
    .findOne({name: roomName})
    .then(room => {
        const lastRoom = socket.user.room, users = room.users
        const newUser = {
            login: socket.user.login,
            view: socket.user.view,
            nickname: socket.user.nickname
        }
        users.push(newUser)

        Room
        .findOneAndUpdate({name: roomName}, {users})
        .then(() => {
            console.log(`<${socket.user.nickname}> join room <${roomName}>`)
            socket.user.room = roomName
            socket.emit(
                'room-join', 
                {
                    status: true,
                    room: roomName,
                    users,
                    isPublic: room.isPublic
                }
            )
            io.to(roomName).emit(
                "user-join", 
                {
                    login: socket.user.login, 
                    nickname: socket.user.nickname, 
                    view: socket.user.view
                }
            )
            socket.join(room.name)
            if(!notLeave)
                leaveRoom(io, socket)(null, lastRoom)
            User
            .findOneAndUpdate({login: socket.user.login}, {room: roomName})
            .catch(err => {
                console.log('Error while updating user')
                console.log(err)
            })
        })
        .catch(err => {
            console.log('Error while updating room')
            console.log(err);
            socket.emit('room-join', {staus: false, message: 'Server error'});
        })
    })
    .catch(err => {
        console.log('Error while searching room')
        console.log(err);
        socket.emit('room-join', {staus: false, message: 'Server error'})
    })
}

function joinRoom(io, socket, notLeave=false){
    return function(data){
        if(!data.room){
            socket.emit('room-join', {status: false, message: 'No room'})
        } else {
            Room
            .findOne({name: data.room})
            .then(room => {
                if(!room){
                    socket.emit("room-join", {status: false, message: "No such room"})

                } else if(!room.isPublic){
                    socket.join(room.name + '_' + socket.user.login)
                    io.to(room.name).emit(
                        'join-req', 
                        {
                            login: socket.user.login,
                            id: socket.id,
                            publicKey: data.publicKey
                        }
                    )
                    
                    setTimeout(() => {
                        socket.emit('room-join', {status: false, message: 'No one connected you to this room'})
                    }, 20 * 1000)

                } else {
                    connectRoom(io, socket, data.room, notLeave)
                }
            })
        }
    }
}



module.exports = {
    joinRoom,
    connectRoom
}