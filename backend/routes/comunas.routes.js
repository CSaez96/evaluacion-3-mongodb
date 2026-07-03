const express = require('express');
const router = express.Router();
const Comuna = require('../models/Comuna');

router.get('/comunas', async (request, response) => {
    try {
        const comunas = await Comuna.find().exec();
        if (!comunas || comunas.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron comunas registradas.' });
        }

        response.status(200).json(comunas);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los datos: ', error });
    }
});

module.exports = router;
