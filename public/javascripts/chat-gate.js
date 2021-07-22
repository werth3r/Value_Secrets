const socket = io();

const user = {};
let clients = {};

socket.on("init", (data) => {
    user.nickname = data.nickname;
    user.login = data.login;
    user.view = data.view;
    setView("#user-view", data.view);
    $("#user-nickname").text(data.nickname);
});
/*
$("#send-button").click(() => {
    let text = $("#input").val();
    socket.emit("message", {message: text});
    $("#input").val("");
});*/

async function sendMessage(e){
    e.preventDefault()

    const text = encode($("#input").val())
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    if(text){
        let message = pack(text)

        if(ENCRYPTION){
            const chiper = await Crypto.encrypt(
                {
                  name: "AES-GCM",
                  iv
                },
                key.aes,
                text
            )
            message = pack(chiper)
        }

        console.log('Message sended: ', message)
        socket.emit("message", {message, iv: pack(iv)})
        $("#input").val("");
    }
}

$("#field").submit(sendMessage)
$("#field .btm").click(sendMessage)

socket.on("message-send", async (data) => {
    console.log('Message received: ', data.message);
    data.message = unpack(data.message)
    data.iv = unpack(data.iv)

    if(ENCRYPTION){
        data.message = await Crypto.decrypt(
            {
                name: "AES-GCM",
                iv: data.iv
            },
            key.aes,
            data.message
        )
    }
    
    $("#message-list").append(getMessage(data.login, data.nickname, data.view, data.time, decode(data.message)));
    $("#message-list").scrollTop(document.getElementById("message-list").scrollHeight);
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
        ENCRYPTION = !data.isPublic
        $("#message-list .message").remove();
        $("#message-list .sys-message").remove();
        $("#room-name").html("#" + data.room);
        $("#user-list .item").remove();
        for(let item of data.users){
            $("#user-list").append(getUserItem(item.login, item.view, item.nickname));
            console.log(data.users);
            //clients[item.roomId] = {view: item.view, nickname: item.name};
            //console.log("Clients[" + item.roomId + "] = " + item.view + ", " + item.name);
        }
    }
});

socket.on("user-join", (data) => {
    console.log("User joined!")
    console.log(data);
    $("#user-list").append(getUserItem(data.login, data.view, data.nickname));
});

socket.on("user-leave", (data) => {
    console.log("User left!")
    console.log(data);
    $("#user-list .item[id=\"" + data.login + "\"]").remove();
});

socket.on("user-nickname", (data) => {
    console.log(data);

    $("#user-list .item[id=\"" + data.login + "\"] .name").text(data.nickname);
    
    
    let message = data.lastNickname + " change nick name on " + data.nickname;
    $("#message-list").append(getSysMessage(message));
});

socket.on("user-view", (data) => {
    console.log("One of users changed avatar!")
    console.log(data);
    let message = data.nickname + " change avatar";
    $("#message-list").append(getSysMessage(message));
    setView("#message-list .message[id=" + data.login + "] .user", data.view);
    setView("#user-list .item[id=" + data.login + "] .view", data.view);
})

socket.on("key-res", async (data) => {
    console.log(data)
    const aesKey = unpack(data.wrapedKey)
    key.aes = await Crypto.unwrapKey(
        "raw", 
        aesKey, 
        key.rsa.privateKey, 
        {   
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"},
        },
        {   
            name: "AES-GCM",
            length: 256
        },
        true, 
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"] 
    )
})

socket.on('join-req', (data) => {
    console.log(data)
    let req = false

    $('body').prepend(getPopup(getText(`[${data.login}] wont to joined`)))

    $(".popup #apply-button").click(async () => {
        req = true
        const publicKey = await Crypto.importKey(
            "jwk", 
            data.publicKey,
            {   
                name: "RSA-OAEP",
                hash: {name: "SHA-256"}, 
            },
            false, 
            ["wrapKey"]
        )
        const wrapedKey = await Crypto.wrapKey(
            "raw", 
            key.aes, 
            publicKey, 
            {   
                name: "RSA-OAEP",
                hash: {name: "SHA-256"},
            }
        )
        socket.emit('key-res', {id: data.id, wrapedKey: pack(wrapedKey)})
    })

    $(".popup #cancel-button").click(() => {
        //if(!req)
            $(".popup").remove()
    })

    setTimeout(() => {
        $(".popup").remove()
    }, 20 * 1000)
})







