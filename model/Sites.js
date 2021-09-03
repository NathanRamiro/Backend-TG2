const mongoose = require('mongoose');

const SchemaSites = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    iv: {
        type: String,
        required: true
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

module.exports = mongoose.model('Sites', SchemaSites);