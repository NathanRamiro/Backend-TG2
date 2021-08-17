const mongoose = require('mongoose');

const SchemaContas = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    ivlogin: {
        type: String,
        required: true
    },
    senha:{
        type:String,
        required:true
    },
    ivsenha:{
        type:String,
        required:true
    },
    dono:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model('Contas', SchemaContas);