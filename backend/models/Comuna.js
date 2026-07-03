const mongoose = require('mongoose');

const comunaSchema = new mongoose.Schema({
    codigo: String,
    nombre: String,
    region: String
});

const Comuna = mongoose.model('Comuna', comunaSchema, 'comunas');

module.exports = Comuna;
