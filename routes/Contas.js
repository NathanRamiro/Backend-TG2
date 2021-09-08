const express = require('express');
const rota = express.Router();
const { check, validationResult } = require('express-validator');
const EncAES = require('../components/EncAES')//ENCripta com AES
const DecAES = require('../components/DecAES')//DECripta com AES

const Conta = require('../model/Contas');

const validaConta = [
    check('dono', 'O Dono das contas não foi especificado').not().isEmpty(),
    check('url', 'O Site não foi especificado').not().isEmpty()
]

const validaNovaConta = [
    check('login', 'O Login é obrigatório.').not().isEmpty(),
    check('senha', 'A Senha é obrigatória.').not().isEmpty(),
    check('dono', 'O Dono das contas não foi especificado').not().isEmpty(), //o _id da conta do app
    check('url', 'O Site não foi especificado').not().isEmpty()              //o _id do site
]

rota.get('/',validaConta, async (req, res) => {
    let erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({ message: erros.array() })
    }

    try {
        let filter = {
            "status":true,
            "dono":req.body.dono,
            "url":req.body.url
        }
        const contas = await Conta.find(filter).sort({ login: 1 })
        contas.forEach((val,index,arr)=>{
            let {login,ivlogin,senha,ivsenha,dono,url,_id,status} = val
            let decLogin = DecAES({dados:login,iv:ivlogin})
            let decSenha = DecAES({dados:senha,iv:ivsenha})
            arr[index]={
                _id:_id,
                status:status,
                login:decLogin,
                ivsenha:ivsenha,
                senha:decSenha,
                ivsenha:ivsenha,
                dono:dono,
                url:url
            }
        })

        res.json(contas)
    } catch (err) {
        res.status(500).send({
            message: 'Não foi possivel obter a lista de contas disponiveis'
        })
    }
})

rota.post('/', validaNovaConta, async (req, res) => {
    let erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({ message: erros.array() })
    }

    try {
        let filter = {
            "status":true,
            "dono":req.body.dono,
            "url":req.body.url
        }
        const contas = await Conta.find(filter).sort({ login: 1 })
        contas.forEach((val,index,arr)=>{
            let {login,ivlogin,senha,ivsenha,dono,url,_id,status} = val
            let decLogin = DecAES({dados:login,iv:ivlogin})
            let decSenha = DecAES({dados:senha,iv:ivsenha})
            arr[index]={
                _id:_id,
                status:status,
                login:decLogin,
                ivsenha:ivsenha,
                senha:decSenha,
                ivsenha:ivsenha,
                dono:dono,
                url:url
            }
        })
        let result = contas.find((val,index,arr)=>{
            return val.login === req.body.login
        })
        if(result){
            return res.status(400).json({message:'Uma conta com o mesmo nome ja existe'})
        }

        let login = EncAES(req.body.login)
        let senha = EncAES(req.body.senha)
        let data ={
            login:login.dados,
            ivlogin:login.iv,
            senha:senha.dados,
            ivsenha:senha.iv,
            dono:req.body.dono,
            url:req.body.url
        }
        let conta = new Conta(data)
        await conta.save()

        res.send(conta)
        
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao cadastrar Conta.',
            erro: `${error}`
        })
    }

})

module.exports = rota