const express = require('express');
const rota = express.Router();
const { check, validationResult } = require('express-validator');

const Login = require('../model/Login');
const EncSHA = require('../components/EncSHA')

const validaLogin = [
    check('login', 'Login é obrigatório.').not().isEmpty(),
    check('senha', 'Senha é obrigatória.').not().isEmpty()
]

// registra nova conta
rota.post('/', validaLogin, async (req, res) => {
    let erros = validationResult(req);

    if (!erros.isEmpty())
        return res.status(400).json({ mensagem: erros.array() })

    const login = await Login.findOne({ login: req.body.login });
    if (login) {
        return res.status(400).json({
            //Poderíamos trocar 'Login' por 'Nome de usuário (username)'
            mensagem: 'Este Login está indisponível.'
        })
    }

    try {

        
        let dados = req.body
        dados.senha = EncSHA(dados.senha)
        

        let login = new Login(dados)
        //let login = new Login(req.body)
        await login.save();

        return res.status(200).json({
            mensagem: 'Login criado.',
        })
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar Login.',
            erro: `${error}`
        })
    }

})
// verifica se a senha esta correta / faz o login
rota.post('/:login', validaLogin, async (req, res) => {
    let erros = validationResult(req);

    if (!erros.isEmpty())
        return res.status(400).json({ mensagem: erros.array() })

    const login = await Login.findOne({ login: req.body.login });
    if (login) {

        let passw = EncSHA(req.body.senha)
        
        if(login.senha === passw){

            return res.status(200).json({
                mensagem: 'Login Valido.'
            })
        } else{
            return res.status(400).json({
                mensagem: 'Senha invalida.'
            })    
        }
    }else{
        return res.status(400).json({
            mensagem: 'Esta conta não existe.'
        })
    }

    try {
        let login = new Login(req.body)
        await login.save();

        return res.status(200).json({
            mensagem: 'Login criado.',
        })
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar Login.',
            erro: `${error}`
        })
    }

})

module.exports = rota