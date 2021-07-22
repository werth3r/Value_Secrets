const Crypto = window.crypto.subtle
const key = {}
let ENCRYPTION = false

function encode(data){
    const encoder = new TextEncoder()
    return encoder.encode(data)
}

function decode(data){
    const decoder = new TextDecoder()
    return decoder.decode(data)
}

function pack(buffer){
    return String.fromCharCode.apply(null, new Uint8Array(buffer))
}

function unpack(str) {
    var buf = new ArrayBuffer(str.length)
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

