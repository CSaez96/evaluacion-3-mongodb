const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Crear el método POST para persistir un Usuario en la colección correspondiente.
// La contraseña se encripta automáticamente con bcrypt mediante el middleware
// definido en el modelo (usuarioSchema.pre('save', ...)).
router.post('/guardarUsuario', async (request, response) => {
    try {
        const {
            nombre, rut, correo, telefono, contrasena,
            fechaNacimiento, genero, nacionalidad, direccion
        } = request.body;

        // La dirección puede llegar como string JSON (formulario clásico) u objeto directo (JSON puro)
        const direccionObjeto = typeof direccion === 'string' ? JSON.parse(direccion) : direccion;

        const nuevoUsuario = new Usuario({
            nombre,
            rut,
            correo,
            telefono,
            contrasena,
            fechaNacimiento,
            genero,
            nacionalidad,
            direccion: direccionObjeto
        });

        await nuevoUsuario.save();
        response.status(200).json({ mensaje: 'Datos almacenados correctamente.' });
    } catch (excepcion) {
        console.error('Error al guardar usuario:', excepcion);
        if (excepcion.name === 'ValidationError') {
            return response.status(400).json({ mensaje: 'Los datos ingresados no son válidos.', errores: excepcion.errors });
        }
        if (excepcion.code === 11000) {
            return response.status(409).json({ mensaje: 'Ya existe un usuario registrado con ese RUT.' });
        }
        response.status(500).json({ mensaje: 'No se han podido almacenar los datos: ', excepcion });
    }
});

// Crear el método GET para consultar los Usuarios en la colección correspondiente.
// Se agregan (aggregate + $lookup) los datos del país de origen y de las
// canciones favoritas asociadas a cada usuario.
router.get('/usuarios', async (request, response) => {
    try {
        const usuarios = await Usuario.aggregate([
            {
                $lookup: {
                    from: 'paises',            // Colección desde la que agregamos datos
                    localField: 'nacionalidad', // Campo en Usuario
                    foreignField: 'iso2',       // Campo relacionado en Pais
                    as: 'paisOrigen'
                }
            },
            {
                $lookup: {
                    from: 'canciones',   // Entidad asignada relacionada 1:N
                    localField: '_id',
                    foreignField: 'usuario',
                    as: 'canciones'
                }
            }
        ]);

        if (!usuarios || usuarios.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron usuarios registrados.' });
        }

        response.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al consultar usuarios:', error);
        response.status(500).json({ mensaje: 'No ha sido posible obtener los datos: ', error });
    }
});

module.exports = router;