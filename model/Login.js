const mongoose = require('mongoose');

const SchemaLogin = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

module.exports = mongoose.model('Login', SchemaLogin);