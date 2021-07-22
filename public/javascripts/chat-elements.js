console.log("Required chat.js");

function setView(el, url){
    $(el).css("background", `url("${url}")`);
    $(el).css("background-size", "cover");
    $(el).css("background-position", "center center");

}


function getPopup(content){
    
    return `<div class="popup view-change">
                <div class="wrapper">
                    <div class="content">${content}</div>
                    <div class="options">
                        <div class="btm" id="cancel-button">Cancel</div>
                        <div class="btm" id="apply-button">Apply</div>
                    </div>
                </div>
            </div>`
}

function getInput(message){
    return `<div class="value">
                <label for="#" class="name">${message}</label>
                <input class="text" id="input" type="text">
            </div>`
}

function getSlider(cnt){
    return `<div class="row">
                <div class="left-arrow arrow" id="left-arrow"></div>
                <div class="slider">
                    ${'<div  class="item"></div>'.repeat(cnt)}
                </div>
                <div class="right-arrow arrow" id="right-arrow"></div>
            </div>`
}

function getAlert(message, status){
    let title = status ? "sucsessful" : "warning";
    return `<div class="alert ${title}">
                <div class="wrapper">
                    <div class="message sucsessful" id="message">${message}</div>
                    <div class="btm" id="apply-button">Ok</div>
                </div>
            </div>`
}

function getAsk(message){
    return `<div class="ask">
                <div class="wrapper">
                    <div class="message">${message}</div>
                    <div class="options">
                        <div class="btm" id="cancel-button">Reject</div>
                        <div class="btm" id="apply-button">Allow</div>
                    </div>
                </div>
            </div>`
}

function getUserItem(login, view, nickname){
    console.log("New UserItem: " + nickname + ", " + view);
    return `<div id="${login}" class=\"item\">
                <div class=\"view\"style="background: url('${view}'); background-size: cover; background-position: center center"></div>
                <div class=\"name\">${nickname}</div>
            </div>`
}

function getMessage(login, nickname, view, time, message){
    console.log("New message: " + nickname + ", " + view);
    return `<div id="${login}" class=\"message\">
                <div class=\"head\">
                    <div class=\"user\" style="background: url('${view}'); background-size: cover; background-position: center center"></div>
                </div>
                <div class=\"body\">
                    <div class=\"title\">From ${nickname} at ${time}</div>
                    <div class=\"text\">${message}</div>
                </div>
            </div>`
}

function getSysMessage(message){
    return `<div class="sys-message">${message}</div>`
};

function getRoomMaster(){
    return `<div class="value">
                <label for="#" class="name">Room name</label>
                <input class="text" id="input" type="text">
            </div>

            <label class="chk name">
                <input type="checkbox"/ checked>
                <span class="style"></span>
                Encrypted
            </label>`
}

function getImageLoader(){
    return `<form class="value imgloader" method="POST" enctype="multipart/form-data" id="imgform">
                <input name="userpic" type="file" id="file-input">
                <div class="btm" id="load-button">Load File</div>
                <div class="warning"></div>
            </form>`
}

function getText(message){
    return `<div class="value">
                <div class="name">${message}</div>
            </div>`
}