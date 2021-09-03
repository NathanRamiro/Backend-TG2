const express = require('express');
const rota = express.Router();
const { check, validationResult } = require('express-validator');
const EncAES = require('../components/EncAES')//ENCripta com AES
const DecAES = require('../components/DecAES')//DECripta com AES

const Site = require('../model/Sites');

const validaSite = [
    check('url', 'A URL é obrigatória.').not().isEmpty(),
]

rota.get('/', async (req, res) => {
    try {
        const sites = await Site.find({ "status": true }).sort({ url: 1 })
        sites.forEach((val, index, arr) => {//prepara o objeto para a função de AES
            let { url, _id, status, iv } = val
            arr[index] = {
                _id: _id,
                dados: url,
                status: status,
                iv: iv
            }
        })
        sites.forEach((val, index, arr) => {//remonta o objeto original descriptado
            let url = DecAES(val)
            let { _id, status, iv } = val
            arr[index] = {
                _id: _id,
                url: url,
                status: status,
                iv: iv
            }
        })

        res.json(sites)
    } catch (err) {
        res.status(500).send({
            message: 'Não foi possivel obter a lista de sites disponiveis'
        })
    }
})

rota.post('/', validaSite, async (req, res) => {
    let erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({ message: erros.array() })
    }

    const sites = await Site.find({ "status": true }).sort({ url: 1 })
    sites.forEach((val, index, arr) => {
        let { url, _id, status, iv } = val
        arr[index] = {
            _id: _id,
            dados: url,
            status: status,
            iv: iv
        }
    })
    sites.forEach((val, index, arr) => {
        let url = DecAES(val)
        let { _id, status, iv } = val
        arr[index] = {
            _id: _id,
            url: url,
            status: status,
            iv: iv
        }
    })
    let result = sites.find((val, index, arr) => {
        return val.url === req.body.url
    })
    if (result) {
        return res.status(400).json({ message: "o site ja existe" })
        // não necessariamente ruim
    }

    try {
        let data = EncAES(req.body.url)
        let { dados, iv } = data
        data = {
            iv: iv,
            url: dados
        }

        let site = new Site(data)
        await site.save();

        res.send(site)

    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao cadastrar Site.',
            erro: `${error}`
        })
    }

})

module.exports = rota