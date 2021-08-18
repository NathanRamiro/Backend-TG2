const express = require("express")
require('dotenv').config()

const InicializaMongoServer = require('./config/DB')

const rotasLogin = require('./routes/Login')
//const rotasSites = require('./routes/Sites')
//const rotasContas = require('./routes/Contas')

InicializaMongoServer()

const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT || 4000

app.use((req, res, next) => {
    // '*' deve ser trocado pelo dominio do app em produção
    res.setHeader('Access-Control-Allow-Origin', '*')
    // '*' deve ser trocado pelos cabeçalhos que serão utilizados
    res.setHeader('Access-Control-Allow-Headers', '*')
    // '*' deve ser trocado pelo dominio do app em produção
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTION,PATCH')
    next()
})

app.use(express.json())

app.get('/', (req, res) => {
    const idiomas = req.headers['accept-language']
    res.json({
        mensagem: 'API utilizada no desenvolvimento do Trabalho de Graduação II - Fatec Itu',
        autores: 'José Caíque Leite da Silva, Nathan Ramiro do Nascimento.',
        titulo: 'Gerenciador de Senhas para a plataforma mobile.',
        versao: '1.0.0',
        idiomas: idiomas
    });
});

app.use('/login', rotasLogin)
//app.use('/sites',rotasSites)
//app.use('/contas',rotasContas)

app.use((req, res) => {
    res.status(404).json({ mensagem: `${req.originalUrl} não existe.` })
})

app.listen(PORT, (req, res) => {
    console.log(`Servidor iniciado na porta ${PORT}.`)
})