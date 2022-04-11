var cryptoJs = require("crypto-js");
var key = ".*/No/Let!@#Sublet%^&+";
module.exports = {
    // Encrypt password
    encrypt(text){
        var chiperText = cryptoJs.AES.encrypt(text,key).toString();
        return chiperText
    },
    // Decrypt password
    decrypt(text){
        var bytes = cryptoJs.AES.decrypt(text,key);
        var originalText = bytes.toString(cryptoJs.enc.Utf8);
        return originalText;
    }
}