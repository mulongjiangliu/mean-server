const crypto = require('crypto');

const sha = 'RSA-SHA256';
const salt = 'mean';

 function shaEncrypt(password) {
    let sha256 = crypto.createHash(sha);
    sha256.update(password + salt);
    return sha256.digest('hex');
}

function aesEncrypt(data, key = salt) {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted, key = salt) {
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    shaEncrypt: shaEncrypt,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt
}
