window.onload = function () {
    obtenerUsuarios();
};

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/usuarios');
        const usuarios = await respuesta.json();

        console.log(usuarios);

        new DataTable('#tablaUsuarios', {
            data: usuarios,
            columns: [
                { data: 'nombre', defaultContent: '' },
                { data: 'correo', defaultContent: '' },
                { data: 'rut', defaultContent: '' },
                { data: 'telefono', defaultContent: '' },
                {
                    data: 'fechaNacimiento',
                    defaultContent: '',
                    render: (valor) => valor ? new Date(valor).toLocaleDateString('es-CL') : ''
                },
                { data: 'genero', defaultContent: '' },
                { data: 'nacionalidad', defaultContent: '' },
                {
                    data: 'activo',
                    defaultContent: '',
                    render: (valor) => valor === true ? 'Sí' : (valor === false ? 'No' : '')
                },
                {
                    data: 'canciones',
                    defaultContent: '0',
                    render: (valor) => Array.isArray(valor) ? valor.length : 0
                }
            ]
        });
    } catch (error) {
        console.log('Error: ', error);
    }
};