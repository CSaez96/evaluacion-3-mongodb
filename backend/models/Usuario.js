const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Subesquema de Dirección: se embebe como OBJETO (no como arreglo) dentro de Usuario
const direccionSchema = new mongoose.Schema({
    comuna: {
        type: String,
        required: [true, 'La comuna es obligatoria.']
    },
    calle: {
        type: String,
        required: [true, 'La calle es obligatoria.']
    },
    numero: {
        type: String,
        required: [true, 'El número es obligatorio.']
    },
    departamento: {
        type: String
    }
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre completo es obligatorio.'],
        trim: true
    },
    rut: {
        type: String,
        required: [true, 'El RUT es obligatorio.'],
        trim: true,
        unique: true
    },
    correo: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio.'],
        trim: true,
        lowercase: true,
        match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'El correo electrónico no tiene un formato válido.']
    },
    telefono: {
        type: String
    },
    fechaNacimiento: {
        type: Date,
        validate: {
            validator: function (valor) {
                // Debe ser una fecha válida y anterior a la fecha actual
                return valor instanceof Date && !isNaN(valor.getTime()) && valor.getTime() < Date.now();
            },
            message: 'La fecha de nacimiento debe ser una fecha válida y anterior a la fecha actual.'
        }
    },
    nacionalidad: {
        type: String,
        required: [true, 'La nacionalidad es obligatoria.'],
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{2}$/, 'La nacionalidad debe corresponder a un código ISO-3166 Alpha-2 (ej: CL, AR, PE).']
    },
    genero: {
        type: String,
        enum: {
            values: ['M', 'F', 'O'],
            message: 'El género debe ser M, F u O.'
        }
    },
    direccion: {
        type: direccionSchema,
        required: [true, 'La dirección es obligatoria.']
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatoria.']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now,
        immutable: true // no debe modificarse una vez creado el documento
    },
    activo: {
        type: Boolean,
        default: true
    }
});

// Middleware: encripta la contraseña con bcrypt automáticamente antes de guardar,
// solo si esta fue creada o modificada (evita re-hashear un hash ya existente).
// Nota: al ser una función async, Mongoose no entrega callback "next" — el middleware
// se completa automáticamente cuando la función async termina, y si lanza un error,
// Mongoose lo captura solo (no hay que llamar next(error) manualmente).
usuarioSchema.pre('save', async function () {
    if (!this.isModified('contrasena')) return;

    const saltRounds = 10;
    this.contrasena = await bcrypt.hash(this.contrasena, saltRounds);
});

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

module.exports = Usuario;