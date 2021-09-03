const crypto = require('crypto')
const KEY = process.env.KEY //a chave de criptografia
const iv = crypto.randomBytes(16) // cada iv tem que ser unico para cada chave
                                  // eventualmente isso vai duplicar o iv
                                  // tem jeitos melhores de fazer isso                                  
const algorit = 'aes-256-cbc'

function EncAES(valor){// valor é o texto a ser criptografado

    const cipher = crypto.createCipheriv(algorit,KEY,iv)
    const criptado = Buffer.concat([cipher.update(valor),cipher.final()])

    const dados = {
        iv:iv.toString('hex'),
        dados:criptado.toString('hex')
    }
    
    return dados

}

module.exports = EncAES