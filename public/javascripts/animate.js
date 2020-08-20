var text = document.getElementById("title");
var count = 0;
setInterval(()=>{
    var mes = text.innerHTML;
    if(count == 3){
        mes = mes.slice(0, mes.length - 3);
        count = 0;
    } else {
        mes += ".";
        count += 1;
    }
    text.innerHTML = mes;
}, 500);