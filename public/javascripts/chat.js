console.log("Required chat.js");

function getPopup(type){
    let content;
    if(type == "slider"){
        content = `<div class="row">
                <div class="left-arrow arrow" id="left-arrow"></div>
                <div class="slider">
                    <div  class="item"></div>
                    <div  class="item"></div>
                    <div  class="item"></div>
                    <div  class="item"></div>
                    <div  class="item"></div>
                    <div  class="item"></div>
                    <div  class="item"></div>
                    <div  class="item"></div>
                </div>
                <div class="right-arrow arrow" id="right-arrow"></div>
            </div>`
    } else {
        content = `<div class="value">
                <label for="#" class="name">${type}</label>
                <input class="text" id="input" type="text">
            </div>`
    }
    
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

function getUserItem(id, view, nickname){
    console.log("New UserItem: " + nickname + ", " + view);
    return `<div id="${id}" class=\"item\">
            <div class=\"view\"style="background: url(images/profile_pictures/view${view}.jpg); background-size: cover"></div>
            <div class=\"name\">${nickname}</div>
        </div>`
}

function getMessage(id, nickname, view, time, message){
    console.log("New message: " + nickname + ", " + view);
    return `<div id="${id}" class=\"message\">
            <div class=\"head\">
                <div class=\"user\" style="background: url(images/profile_pictures/view${view}.jpg); background-size: cover"></div>
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