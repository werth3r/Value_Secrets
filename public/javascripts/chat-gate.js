const socket = io();

function setView(el, ind){
    let url = "url(images/profile_pictures/view" + ind + ".jpg)"
    $(el).css("background", url);
    $(el).css("background-size", "cover");
}

const user = {};
let clients = {};

socket.on("init", (data) => {
    user.nickname = data.nickname;
    user.id = data.id;
    user.view = data.view;
    setView("#user-view", data.view);
    $("#user-nickname").text(data.nickname);
});

$("#send-button").click(() => {
    let text = $("#input").val();
    socket.emit("message", {message: text});
    $("#input").val("");
});

$("#field").submit(async (e) => {
    console.log("Button Submitted");
    e.preventDefault();
    const text = $("#input").val();
    let enc_text = text;
    if(!User.enc){
        enc_text = await aes_encrypt(text, User.aesKey, User.iv);
    }
    socket.emit("message", {message: enc_text});
    $("#input").val("");
});

socket.on("message-send", async (data) => {
    console.log(data);
    let message = data.message;
    if(!User.enc){
        message = await aes_decrypt(data.message, User.aesKey, User.iv);
    }
    let nickname = clients[data.author].nickname;
    let view = clients[data.author].view;
    $("#message-list").append(getMessage(data.author, nickname, view, data.time, message));
});

socket.on("key-send", async (data) => {
    let openData = await rsa_decrypt(data.key, User.rsaKey.privateKey);
    openData = JSON.stringify(openData);
    User.iv = openData.iv;
    User.aesKey = await aes_importKey(openData);
});

socket.on("view-change", (data) => {
    console.log(data);
    if(data.status){
        setView("#user-view", data.view);
        user.view = data.view
    } else {
        $("body").prepend(getAlert(data.message, data.status));
        $(".alert #apply-button").click(() => {
            $(".alert").remove();
        });
    }
});

socket.on("nickname-change", (data) => {
    console.log(data);
    if(data.status){
        $("#user-nickname").text(data.nickname);
        user.nickname = data.nickname;
    } else {
        $("body").prepend(getAlert(data.message, data.status));
        $(".alert #apply-button").click(() => {
            $(".alert").remove();
        });
    }
});

socket.on("room-create", (data) => {
    console.log(data);
});

socket.on("room-join", (data) => {
    console.log(data);
    if(data.status){
        User.enc = data.isPublic;
        $("#message-list .message").remove();
        $("#message-list .sys-message").remove();
        $("#room-name").html("#" + data.room);
        $("#user-list .item").remove();
        for(let item of data.users){
            $("#user-list").append(getUserItem(item.roomId, item.view, item.name));
            clients[item.roomId] = {view: item.view, nickname: item.name};
            console.log("Clients[" + item.roomId + "] = " + item.view + ", " + item.name);
        }
    }
});

socket.on("user-join", (data) => {
    console.log(data);
    $("#user-list").append(getUserItem(data.id, data.view, data.nickname));
    console.log("Clients[" + data.id + "] = " + data.view + ", " + data.nickname);
    clients[data.id] = {view: data.view, nickname: data.nickname};
});

socket.on("user-leave", (data) => {
    console.log(data);
    $("#user-list .item[id=\"" + data.id + "\"]").remove();
    delete clients[data.id];
});

socket.on("user-nickname", (data) => {
    console.log(data);
    clients[data.id].nickname = data.nickname;
    $("#user-list .item[id=\"" + data.id + "\"] .name").text(data.nickname);
    
    
    let message = clients[data.id].nickname + " change nick name on " + data.nickname;
    $("#message-list").append(getSysMessage(message));
});

socket.on("user-view", (data) => {
    console.log(data);
    let message = clients[data.id].nickname + " change avatar";
    clients[data.id].view = data.view;
    $("#message-list").append(getSysMessage(message));
    setView("#message-list .message[id=" + data.id + "] .user", data.view);
    setView("#user-list .item[id=" + data.id + "] .view", data.view);
})

socket.on("key-req", async (data) => {
    const publicKey = rsa_importPublicKey(data.key);
    const keySend = aes_exportKey(User.aesKey, User.iv);
    const enc_data = rsa_encrypt(JSON.parse(keySend), publicKey);
    socket.emit("key-res", enc_data);
})





