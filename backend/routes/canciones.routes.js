const express = require('express');
const router = express.Router();
const Cancion = require('../models/Cancion');

// Crear el método POST para persistir una Cancion en la colección correspondiente,
// relacionándola con el Usuario al que pertenece (campo "usuario" = ObjectId).
router.post('/guardarCancion', async (request, response) => {
    try {
        const {
            usuario, titulo, artista, album, genero,
            duracion, anio, idioma, plataforma, favorita
        } = request.body;

        const nuevaCancion = new Cancion({
            usuario,
            titulo,
            artista,
            album,
            genero,
            duracion: duracion !== undefined && duracion !== '' ? Number(duracion) : undefined,
            anio: anio !== undefined && anio !== '' ? Number(anio) : undefined,
            idioma,
            plataforma,
            favorita: favorita === true || favorita === 'true' || favorita === 'on'
        });

        await nuevaCancion.save();
        response.status(200).json({ mensaje: 'Canción almacenada correctamente.' });
    } catch (excepcion) {
        console.error('Error al guardar canción:', excepcion);
        if (excepcion.name === 'ValidationError') {
            return response.status(400).json({ mensaje: 'Los datos ingresados no son válidos.', errores: excepcion.errors });
        }
        if (excepcion.name === 'CastError') {
            return response.status(400).json({ mensaje: 'El usuario seleccionado no es válido.' });
        }
        response.status(500).json({ mensaje: 'No se ha podido almacenar la canción: ', excepcion });
    }
});

// Crear el método GET para consultar las Canciones en la colección correspondiente.
// Mediante $lookup se trae la información del Usuario dueño de cada canción
// (nombre y rut), para poder asociarlas en la vista.
router.get('/canciones', async (request, response) => {
    try {
        const canciones = await Cancion.aggregate([
            {
                $lookup: {
                    from: 'usuarios',        // Colección desde la que agregamos datos
                    localField: 'usuario',   // Campo en Cancion (ObjectId del usuario)
                    foreignField: '_id',     // Campo relacionado en Usuario
                    as: 'usuarioInfo'
                }
            },
            {
                // Cada canción pertenece a un único usuario -> desenrollamos el arreglo resultante
                $unwind: {
                    path: '$usuarioInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    titulo: 1,
                    artista: 1,
                    album: 1,
                    genero: 1,
                    duracion: 1,
                    anio: 1,
                    idioma: 1,
                    plataforma: 1,
                    favorita: 1,
                    'usuarioInfo.nombre': 1,
                    'usuarioInfo.rut': 1
                }
            }
        ]);

        if (!canciones || canciones.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron canciones registradas.' });
        }

        response.status(200).json(canciones);
    } catch (error) {
        console.error('Error al consultar canciones:', error);
        response.status(500).json({ mensaje: 'No ha sido posible obtener los datos: ', error });
    }
});

module.exports = router;