const Crypto = window.crypto.subtle;
const enc = new TextEncoder();
const dec = new TextDecoder();
const User = new Object();

//AES
async function aes_generateKey(){
    const data = await Crypto.generateKey({name: "AES-CBC", length: 256}, true, ["encrypt", "decrypt"]);
    return data; 
}

async function aes_encrypt(message, key, iv){
    let encData = enc.encode(message);
    const data = await Crypto.encrypt({name: "AES-CBC", iv: iv}, key, encData);
    return data;
}

async function aes_decrypt(message, key, iv){
    const data = await Crypto.decrypt({name: "AES-CBC", iv: iv}, key, message);
    const decData = dec.decode(data);
    return decData;
}

async function aes_importKey(jwk){
    const key = await Crypto.importKey("jwk", jwk, {name: "AES-CBC"}, true, ["encrypt", "decrypt"]);
    return key;
}

async function aes_exportKey(key, iv){
    const jwk = await Crypto.exportKey("jwk", key);
    jwk.iv = iv;
    return jwk;
}

//RSA
async function rsa_generateKey(){
    const data = await Crypto.generateKey(
        {name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([0x01, 0x00, 0x01]), hash: {name: "SHA-256"}},
        true,
        ["encrypt", "decrypt"])
    return data;
}

async function rsa_exportPublicKey(key){
    const jwk = Crypto.exportKey("jwk", key);
    return jwk;
}

async function rsa_importPublicKey(jwk){
    const key = Crypto.importKey("jwk", jwk, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, false, ["ecrypt"]);
    return key;
}

async function rsa_encrypt(message, publicKey){
    let encData = enc.encode(message);
    const data = await Crypto.encrypt({name: "RSA-OAEP"}, publicKey, encData);
    return data;
}

async function rsa_decrypt(message, privateKey){
    const data = await Crypto.decrypt({name: "RSA-OAEP"}, privateKey, message);
    const decData = dec.decode(data);
    return decData;
}