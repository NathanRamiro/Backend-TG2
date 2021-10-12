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
    return res.status(400).json({ message: erros.array(), status: 400 })

  const login = await Login.findOne({ login: req.body.login });
  if (login) {
    return res.status(400).json({
      message: 'Este Login está indisponível.',
      status: 400
    })
  }

  try {
    let dados = req.body
    dados.senha = EncSHA(dados.senha)

    let login = new Login(dados)
    await login.save();

    return res.status(200).json({
      message: 'Login criado.',
      status: 200
    })
  }
  catch (error) {
    return res.status(500).json({
      message: 'Erro ao cadastrar Login.',
      erro: `${error}`,
      status: 500
    })
  }

})

// verifica se a senha esta correta / faz o login
rota.post('/:login', validaLogin, async (req, res) => {
  let erros = validationResult(req);

  if (!erros.isEmpty())
    return res.status(400).json({ message: erros.array() });

  const login = await Login.findOne({ login: req.body.login });

  if (login) {

    let passw = EncSHA(req.body.senha)

    if (login.senha === passw) {

      let { _id } = login
      return res.status(200).json({
        message: 'Login Válido.',
        status: 200,
        _id: _id
      })
    }
    else {
      return res.status(400).json({
        message: 'Senha invalida.',
        status: 400
      })
    }
  }
  else {
    return res.status(400).json({
      message: 'Esta conta não existe.',
      status: 400
    })
  }
})

module.exports = rota