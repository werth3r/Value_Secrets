//Slider
$("#user-view").click(() => {
    $("body").prepend(getPopup(getImageLoader()));

    $(".popup #file-input").change((e) => {
        $(".popup .avatar").remove()
        $(".popup .warning").text('')

        if(!e.target.files.length){
            return;
        }

        const file = e.target.files[0];
        if(!file.type.match('image')){
            return;
        }

        const reader = new FileReader()
        
        reader.onload = e => {
            const src = e.target.result
            $(".popup .imgloader").append(`<div class="avatar"><div>`)
            setView(".popup .avatar", src);
        }

        reader.readAsDataURL(file)
    });
    
    $(".popup #load-button").click(() => $(".popup #file-input").click())

    function submitHandler(e){
        e.preventDefault()
        console.log(e)
        const data = new FormData($('#imgform')[0])

        for (let key of data.keys()) {
            console.log(`${key}: ${data.get(key)}`);
        }

        $.ajax({
            type: 'POST',
            url: '/api/upload/image',
            data,
            processData: false,
            contentType: false,
            success: (r) => {
                console.log(r)
                if(!r.status)
                    $(".popup .warning").text(r.message)
                socket.emit("view", {view: r.link})
            },
            error: (e) => {
                console.log(e)
                $(".popup .warning").text("Error: " + e.code)
            }
        })
    }

    $(".popup #imgform").submit(submitHandler)

    $(".popup #apply-button").click(() => $(".popup #imgform").submit())

    $(".popup #cancel-button").click(() => {
        $(".popup").remove();
    })
});




//Nickname
$("#change-nickname").click(() => {
    $("body").prepend(getPopup(getInput("nickname")));
    
    $(".popup #apply-button").click(() => {
        let nickname = $(".popup #input").val();
        socket.emit("nickname", {nickname: nickname});
        $(".popup").remove();
    })

    $(".popup #cancel-button").click(() => {
        $(".popup").remove();
    })
});


$("#create-button").click(() => {
    $("body").prepend(getPopup(getRoomMaster()));
    
    $(".popup #apply-button").click(async () => {
        
        
        let room = $(".popup #input").val();
        let isPublic = !$(".popup .chk input").prop("checked");

        if(!isPublic){
            if(!key.rsa){
                const keyPair = await Crypto.generateKey(
                    {
                        name: "RSA-OAEP",
                        modulusLength: 2048, 
                        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                        hash: {name: "SHA-256"}
                    }, 
                    true, 
                    ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
                )

                key.rsa = keyPair
            }

            key.aes = await Crypto.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256
                },
                true,
                ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
            )

            const wrapedKey = await Crypto.wrapKey(
                "raw", 
                key.aes,
                key.rsa.publicKey, //the public key with "wrapKey" usage flag
                {   //these are the wrapping key's algorithm options
                    name: "RSA-OAEP",
                    hash: {name: "SHA-256"},
                }
            )
            
            socket.emit("create", {room, isPublic, key: pack(wrapedKey)})
        } else {
            socket.emit("create", {room, isPublic})
        }
        $(".popup").remove();
    })

    $(".popup #cancel-button").click(() => {
        $(".popup").remove();
    })
});

$("#join-button").click(() => {
    $("body").prepend(getPopup(getInput("Join room")));
    
    $(".popup #apply-button").click(async () => {
        let room = $(".popup #input").val();

        if(!key.rsa){
            const keyPair = await Crypto.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048, 
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {name: "SHA-256"}
                }, 
                true, 
                ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
            )

            key.rsa = keyPair
        }

        const publicKey = await Crypto.exportKey('jwk', key.rsa.publicKey)

        socket.emit("join", {room, publicKey});
        $(".popup").remove();
    })

    $(".popup #cancel-button").click(() => {
        $(".popup").remove();
    })
});


