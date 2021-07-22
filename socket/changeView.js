const User = require("../models").User
const fs = require("fs")
const path = require('path')

module.exports = function(io, socket, data){
    return async function(data){
        console.log("View query");
        console.log(path.join(__dirname, '../public', data.view));
        fs.exists(path.join(__dirname, '../public', data.view), (res) => {
            if(!res){
                socket.emit("view-change", {status: false, message: "Invalid data"});
            } else {
                let id = socket.user._id;
                User
                .findByIdAndUpdate(id, {view: data.view})
                .then((user) => {
                    socket.emit("view-change", {status: true, view: data.view});
                    io.to(socket.user.room).emit("user-view", {view: data.view, nickname: socket.user.nickname, login: socket.user.login});
                    socket.user.view = data.view;
                })
                .catch("view-change", (err) => {
                    socket.emit("view-change", {status: false, message: "Server error"})
                });
            }
        })
        
    }
}