const crypto = require('crypto')
const KEY = process.env.KEY //a chave de criptografia
const algorit = 'aes-256-cbc'

function DecAES(valor) { //valor é um objeto que contem o cipher e o iv
                        //valor={dados:string,iv:string}
    try {
        const decipher = crypto.createDecipheriv(algorit, KEY,Buffer.from(valor.iv,'hex'))
        const decriptado = Buffer.concat([decipher.update(valor.dados, 'hex'), decipher.final()])

        return decriptado.toString()
    } catch (e) {
        console.log(e.message)
    }


}

module.exports = DecAES