const express = require('express');
const rota = express.Router();
const { check, validationResult } = require('express-validator');

const Site = require('../model/Sites');

const validaSite = [
    check('uri', 'A URL é obrigatória.').not().isEmpty(),
    check('iv', 'O iv não foi inserido.').not().isEmpty()
]

rota.get('/',async (req,res) => {
    try {
        const sites = await Site.find({ "status": true }).sort({ uri: 1 })
        res.json(sites)
    } catch (err) {
        res.status(500).send({
            message: 'Não foi possivel obter a lista de sites disponiveis'
        })
    }
})

rota.post('/', validaSite, async (req, res) => {
    let erros = validationResult(req);

    if (!erros.isEmpty())
        return res.status(400).json({ mensagem: erros.array() })

    const site = await Site.findOne({ uri: req.body.uri });
    if (site) {
        res.json(site)
    }

    try {
        let site = new Site(req.body)
        await site.save();

        res.send(site)

    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar Site.',
            erro: `${error}`
        })
    }

})

module.exports = rota