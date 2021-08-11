const express = require('express');
const rota = express.Router();
const { check, validationResult } = require('express-validator');

const Login = require('../model/Login');

const validaLogin = [
    check('login', 'Login é obrigatório.').not().isEmpty(),
    check('senha', 'Senha é obrigatória.')
]

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