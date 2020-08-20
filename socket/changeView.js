const User = require("../models").User;
const fs = require("fs");

module.exports = function(io, socket, data){
    return function(data){
        console.log("View query");
        console.log(data);
        if(typeof(data.view) !== "number" || data.view > 8 || data.view < 0){
            socket.emit("view-change", {status: false, message: "Invalid data"});
        } else {
            let id = socket.user._id;
            User
            .findByIdAndUpdate(id, {view: data.view})
            .then((user) => {
                socket.emit("view-change", {status: true, view: data.view});
                console.log(io.sockets.adapter.rooms);
                io.to("default").emit("user-view", {view: data.view, id: socket.user.roomId});
                socket.user.view = data.view;
                console.log(socket.user);
            })
            .catch("view-change", (err) => {
                socket.emit("view-change", {status: false, message: "Server error"})
            });
        }
    }
}