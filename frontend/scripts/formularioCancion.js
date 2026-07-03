window.onload = function () {
    obtenerUsuariosParaSelect();
};

async function obtenerUsuariosParaSelect() {
    try {
        const respuesta = await fetch('http://localhost:3000/usuarios');
        const usuarios = await respuesta.json();

        const selectUsuario = document.getElementById('selectUsuario');
        usuarios.forEach((usuario) => {
            const opcion = document.createElement('option');
            opcion.value = usuario._id;
            opcion.textContent = `${usuario.nombre} - ${usuario.rut}`;
            selectUsuario.appendChild(opcion);
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

function validarCampo(campo) {
    if (campo.value == '') {
        campo.classList.add('is-invalid', 'alerta');
        return false
    } else {
        campo.classList.remove('is-invalid', 'alerta');
        campo.classList.add('is-valid');
        return true
    }
}

function validarFormularioCancion() {
    let usuario = document.getElementById('selectUsuario');
    let titulo = document.getElementById('inputTitulo');
    let artista = document.getElementById('inputArtista');
    let formularioValido = true;

    if (!validarCampo(usuario)) {
        formularioValido = false;
    }

    if (!validarCampo(titulo)) {
        formularioValido = false;
    }

    if (!validarCampo(artista)) {
        formularioValido = false;
    }

    if (formularioValido) {
        const formulario = document.getElementById('registroCancion');
        const datosFormulario = new FormData(formulario);
        const data = Object.fromEntries(datosFormulario.entries());

        // El checkbox solo aparece en el FormData si está marcado; forzamos el valor explícito
        data.favorita = document.getElementById('inputFavorita').checked;

        const enviarDatos = async () => {
            try {
                const respuesta = await fetch('http://localhost:3000/guardarCancion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const info = await respuesta.json();
                console.log('Canción almacenada: ', info);
                if (respuesta.ok) {
                    formulario.reset();
                    window.location.href = './canciones.html';
                } else {
                    alert(info.mensaje || 'No fue posible guardar la canción.');
                }
            } catch (error) {
                console.log('Error al guardar la canción: ', error);
            }
        };
        enviarDatos();
    } else {
        alert('Complete todos los campos obligatorios antes de enviar el formulario.');
    }
}
