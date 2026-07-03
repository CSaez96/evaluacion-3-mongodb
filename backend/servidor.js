// Importamos las librerías instaladas
const express = require('express'); // Express permite generar la aplicación backend
const cors = require('cors'); // Cors permite que el servidor reciba solicitudes externas
const mongoose = require('mongoose'); // ORM que permite trabajar con objetos y DBs

// Importamos las rutas de cada entidad
const usuariosRoutes = require('./routes/usuarios.routes');
const cancionesRoutes = require('./routes/canciones.routes');
const paisesRoutes = require('./routes/paises.routes');
const comunasRoutes = require('./routes/comunas.routes');

// Iniciar la aplicación express
const aplicacion = express();
const puerto = process.env.PORT || 3000;

// Instanciar las clases necesarias en nuestra aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Crear la conexión a DB
mongoose.connect('mongodb://localhost:27017/AP_N3_C1')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse por el siguiente error: ', excepcion));

// Montar las rutas de cada entidad sobre la aplicación
aplicacion.use(usuariosRoutes);
aplicacion.use(cancionesRoutes);
aplicacion.use(paisesRoutes);
aplicacion.use(comunasRoutes);

aplicacion.listen(puerto, () => console.log(`Corriendo en el puerto ${puerto}`));
