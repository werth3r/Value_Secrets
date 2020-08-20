//Slider
$("#user-view").click(() => {
    $("body").prepend(getPopup("slider"));
    
    $(".slider .item").each((ind, el) => {
        let url = "url(images/profile_pictures/view" + ind + ".jpg)";
        $(el).attr("ind", ind)
        $(el).css("background", url);
        $(el).css("background-size", "cover");
    });
    
    let flag = true;
    
    $("#left-arrow").click(() => {
        if(!flag){
            $(".slider .item").animate({left: "+=150px"}, {duration: 300});
            flag = !flag;
        }
    });

    $("#right-arrow").click(() => {
        if(flag){
            $(".slider .item").animate({left: "-=150px"}, {duration: 300});
            flag = !flag;
        }
    });

    $(".slider .item").click((e) => {
        console.log("Click");
        $(".slider .active").removeClass("active");
        $(e.target).addClass("active");
    });


    $(".popup #apply-button").click(() => {
        let index = $(".slider .active").attr("ind");
        socket.emit("view", {view: Number(index)});
        $(".popup").remove();
    })

    $(".popup #cancel-button").click(() => {
        $(".popup").remove();
    })
});




//Nickname
$("#change-nickname").click(() => {
    $("body").prepend(getPopup("nickname"));
    
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
    $("body").prepend(getPopup("Create room"));
    
    $(".popup #apply-button").click(async () => {
        User.iv = window.crypto.getRandomValues(new Uint8Array(16));
        User.aesKey = await aes_generateKey();
        
        let roomname = $(".popup #input").val();
        socket.emit("create", {room: roomname});
        $(".popup").remove();
    })

    $(".popup #cancel-button").click(() => {
        $(".popup").remove();
    })
});

$("#join-button").click(() => {
    $("body").prepend(getPopup("Join room"));
    
    $(".popup #apply-button").click(async () => {
        User.rsaKey = await rsa_generateKey()
        let jsonPublicKey = await rsa_exportPublicKey(User.rsaKey.publicKey);
        
        console.log(jsonPublicKey);
        let roomname = $(".popup #input").val();
        socket.emit("join", {room: roomname, key: jsonPublicKey});
        $(".popup").remove();
    })

    $(".popup #cancel-button").click(() => {
        $(".popup").remove();
    })
});
