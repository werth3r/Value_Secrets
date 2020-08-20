const User = require("../models").User;

function getTime(){
    let time = new Date();
    let h = time.getHours();
    let m = time.getMinutes();
    if(h < 10) h = "0" + h;
    if(m < 10) m = "0" + m;
    return h + ":" + m;
    
}

module.exports = function(io, socket, data){
    return function(data){
        let nickname = socket.user.nickname;
        if(!data.nickname){
            socket.emit("nickname-change", {status: false, message: "No enougth data"});
        } else {
            User.findByIdAndUpdate(socket.user._id, {nickname: data.nickname})
            .then((user) => {
                socket.emit("nickname-change", {status: true, nickname: data.nickname})
                io.to(socket.user.room).emit("user-nickname", {id: socket.user.roomId, nickname: data.nickname});
                socket.user.nickname = data.nickname;
            })
            .catch((err) => {
                console.log(err);
                socket.emit("nickname-change", {status: false, message: "Server error"});
            })
            
        }
    }
}

