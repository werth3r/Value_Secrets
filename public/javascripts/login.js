$(function(){
    //Slider
    $("#sign-in-title").click(() => {
        $(".item").animate({left: "0%"}, 
        {duration: 300,
        done: () => {
            $("#sign-up-title").removeClass("active");
            $("#sign-in-title").addClass("active");
        }});
    });

    $("#sign-up-title").click(() => {
        $(".item").animate({left: "-100%"},
        {duration: 300,
        done: () => {
            $("#sign-up-title").addClass("active");
            $("#sign-in-title").removeClass("active");
        }});
    });
    
    
    //Clear
    $("input, .switch .title").click(() => {
        $(".warning").text("");
    })
    
    //Sign Up
    $("#sign-up-btm").click(() =>{
        let data ={
            login: $("#sign-up-login").val(),
            nickname: $("#sign-up-nickname").val(),
            password: $("#sign-up-psw").val(),
            confirmPassword: $("#sign-up-confpsw").val()
        };
        console.log(data);
        
        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "api/auth/register"
        }).done((data) => {
            if(data.status){
                $(location).attr("href", "/start");
            } else {
                $(".warning").text("Error: " + data.message);
            }
        })
    });
    
    //Sign In
    $("#sign-in-btm").click(() => {
        let data = {
            login: $("#sign-in-login").val(),
            password: $("#sign-in-psw").val()
        }
        console.log(data);
        
        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "api/auth/login"
        }).done(data => {
            if(data.status){
                $(location).attr("href", "/start");
            } else {
                $(".warning").text("Error: " + data.message);
            }
        })
    })
    
    console.log($(location));
})