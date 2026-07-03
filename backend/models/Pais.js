const mongoose = require('mongoose');

const paisSchema = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

const Pais = mongoose.model('Pais', paisSchema, 'paises');

module.exports = Pais;
