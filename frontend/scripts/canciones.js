window.onload = function () {
    obtenerCanciones();
};

async function obtenerCanciones() {
    try {
        const respuesta = await fetch('http://localhost:3000/canciones');
        const canciones = await respuesta.json();

        console.log(canciones);

        new DataTable('#tablaCanciones', {
            data: canciones,
            columns: [
                { data: 'titulo' },
                { data: 'artista' },
                { data: 'album', defaultContent: '' },
                { data: 'genero', defaultContent: '' },
                { data: 'duracion', defaultContent: '' },
                { data: 'anio', defaultContent: '' },
                { data: 'idioma', defaultContent: '' },
                { data: 'plataforma', defaultContent: '' },
                {
                    data: 'favorita',
                    render: (valor) => valor ? 'Sí' : 'No'
                },
                {
                    data: 'usuarioInfo',
                    defaultContent: 'Sin usuario asociado',
                    render: (valor) => (valor && valor.nombre) ? `${valor.nombre} - ${valor.rut}` : 'Sin usuario asociado'
                }
            ]
        });
    } catch (error) {
        console.log('Error: ', error);
    }
};
