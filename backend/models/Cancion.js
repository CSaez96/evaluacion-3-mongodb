const mongoose = require('mongoose');

// Representa una canción favorita. Mantiene una relación 1:N con Usuario:
// un usuario puede tener cero o muchas canciones, y cada canción pertenece
// a un único usuario (referenciado mediante su ObjectId).
const cancionSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'La canción debe estar asociada a un usuario.']
    },
    titulo: {
        type: String,
        required: [true, 'El título de la canción es obligatorio.'],
        trim: true
    },
    artista: {
        type: String,
        required: [true, 'El artista es obligatorio.'],
        trim: true
    },
    album: {
        type: String,
        trim: true
    },
    genero: {
        type: String,
        trim: true
    },
    duracion: {
        type: Number // duración expresada en segundos
    },
    anio: {
        type: Number
    },
    idioma: {
        type: String,
        trim: true
    },
    plataforma: {
        type: String,
        trim: true
    },
    favorita: {
        type: Boolean,
        default: true
    }
});

const Cancion = mongoose.model('Cancion', cancionSchema, 'canciones');

module.exports = Cancion;
