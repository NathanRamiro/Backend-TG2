const crypto = require('crypto')
const KEY = process.env.KEY //a chave de criptografia

function EncSHA(valor){

    const hash = crypto.createHash('sha256',KEY)
    .update(valor) //inclui o valor
    .digest('hex') //converte o valor pra hash, mostra o resultado em hexadecimal

    return hash

}

module.exports = EncSHA