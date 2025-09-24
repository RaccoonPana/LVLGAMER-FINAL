// VALIDACIONES PARA LEVEL-UP GAMER

class Validador {
    constructor() {
        this.dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    }

    // Validar email según requisitos del proyecto
    validarEmail(email) {
        if (!email) return { valido: false, mensaje: 'El correo es requerido' };
        
        if (email.length > 100) {
            return { valido: false, mensaje: 'El correo debe tener máximo 100 caracteres' };
        }

        const dominioValido = this.dominiosPermitidos.some(dominio => email.endsWith(dominio));
        if (!dominioValido) {
            return { 
                valido: false, 
                mensaje: 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com' 
            };
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            return { valido: false, mensaje: 'Formato de correo inválido' };
        }

        return { valido: true, mensaje: '' };
    }

    // Validar contraseña según requisitos
    validarPassword(password) {
        if (!password) return { valido: false, mensaje: 'La contraseña es requerida' };
        
        if (password.length < 4 || password.length > 10) {
            return { 
                valido: false, 
                mensaje: 'La contraseña debe tener entre 4 y 10 caracteres' 
            };
        }

        return { valido: true, mensaje: '' };
    }

    // Validar nombre
    validarNombre(nombre) {
        if (!nombre) return { valido: false, mensaje: 'El nombre es requerido' };
        
        if (nombre.length > 100) {
            return { valido: false, mensaje: 'El nombre debe tener máximo 100 caracteres' };
        }

        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexNombre.test(nombre)) {
            return { valido: false, mensaje: 'El nombre solo puede contener letras y espacios' };
        }

        return { valido: true, mensaje: '' };
    }

    // Validar RUN chileno
    validarRUN(run) {
        if (!run) return { valido: false, mensaje: 'El RUN es requerido' };
        
        // Eliminar puntos y guión
        const runLimpio = run.replace(/[.-]/g, '');
        
        if (runLimpio.length < 7 || runLimpio.length > 9) {
            return { valido: false, mensaje: 'El RUN debe tener entre 7 y 9 caracteres' };
        }

        // Validar formato: números + dígito verificador (K o número)
        const regexRUN = /^(\d{7,8})([0-9Kk])$/;
        if (!regexRUN.test(runLimpio)) {
            return { valido: false, mensaje: 'Formato de RUN inválido' };
        }

        return { valido: true, mensaje: '' };
    }

    // Validar texto largo (comentarios, descripciones)
    validarTexto(texto, maxLength = 500) {
        if (!texto) return { valido: false, mensaje: 'Este campo es requerido' };
        
        if (texto.length > maxLength) {
            return { 
                valido: false, 
                mensaje: `El texto debe tener máximo ${maxLength} caracteres` 
            };
        }

        return { valido: true, mensaje: '' };
    }

    // Validar número (precio, stock)
    validarNumero(numero, min = 0, max = null) {
        if (numero === '' || numero === null || numero === undefined) {
            return { valido: false, mensaje: 'Este campo es requerido' };
        }

        const num = parseFloat(numero);
        if (isNaN(num)) {
            return { valido: false, mensaje: 'Debe ser un número válido' };
        }

        if (num < min) {
            return { valido: false, mensaje: `El valor mínimo es ${min}` };
        }

        if (max !== null && num > max) {
            return { valido: false, mensaje: `El valor máximo es ${max}` };
        }

        return { valido: true, mensaje: '' };
    }

    // Validar teléfono chileno
    validarTelefono(telefono) {
        if (!telefono) return { valido: true, mensaje: '' }; // Opcional
        
        const telefonoLimpio = telefono.replace(/\s/g, '');
        const regexTelefono = /^(\+56|56)?(\d{9})$/;
        
        if (!regexTelefono.test(telefonoLimpio)) {
            return { valido: false, mensaje: 'Formato de teléfono inválido' };
        }

        return { valido: true, mensaje: '' };
    }
}

// Instancia global del validador
const validador = new Validador();

// VALIDACIONES ESPECÍFICAS POR FORMULARIO

// Formulario de Contacto
function validarFormularioContacto() {
    const formulario = document.getElementById('formContacto');
    const campos = {
        nombre: formulario.querySelector('#nombre'),
        email: formulario.querySelector('#email'),
        asunto: formulario.querySelector('#asunto'),
        mensaje: formulario.querySelector('#mensaje')
    };

    let formularioValido = true;

    // Validar nombre
    const validacionNombre = validador.validarNombre(campos.nombre.value);
    mostrarError('errorNombre', validacionNombre);
    if (!validacionNombre.valido) formularioValido = false;

    // Validar email
    const validacionEmail = validador.validarEmail(campos.email.value);
    mostrarError('errorEmail', validacionEmail);
    if (!validacionEmail.valido) formularioValido = false;

    // Validar asunto
    if (!campos.asunto.value) {
        mostrarError('errorAsunto', { valido: false, mensaje: 'Selecciona un asunto' });
        formularioValido = false;
    } else {
        mostrarError('errorAsunto', { valido: true, mensaje: '' });
    }

    // Validar mensaje
    const validacionMensaje = validador.validarTexto(campos.mensaje.value, 500);
    mostrarError('errorMensaje', validacionMensaje);
    if (!validacionMensaje.valido) formularioValido = false;

    return formularioValido;
}

// Formulario de Login
function validarLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const validacionEmail = validador.validarEmail(email);
    const validacionPassword = validador.validarPassword(password);

    if (!validacionEmail.valido) {
        alert(validacionEmail.mensaje);
        return false;
    }

    if (!validacionPassword.valido) {
        alert(validacionPassword.mensaje);
        return false;
    }

    return true;
}

// Formulario de Registro
function validarRegistro() {
    const formulario = document.getElementById('formRegistro');
    const campos = {
        email: formulario.querySelector('#regEmail'),
        password: formulario.querySelector('#regPassword'),
        confirmPassword: formulario.querySelector('#regConfirmPassword'),
        run: formulario.querySelector('#regRun'),
        nombre: formulario.querySelector('#regNombre'),
        apellidos: formulario.querySelector('#regApellidos')
    };

    let formularioValido = true;

    // Validar RUN
    const validacionRUN = validador.validarRUN(campos.run.value);
    if (!validacionRUN.valido) {
        alert(validacionRUN.mensaje);
        formularioValido = false;
    }

    // Validar nombre
    const validacionNombre = validador.validarNombre(campos.nombre.value);
    if (!validacionNombre.valido) {
        alert(validacionNombre.mensaje);
        formularioValido = false;
    }

    // Validar apellidos
    const validacionApellidos = validador.validarTexto(campos.apellidos.value, 100);
    if (!validacionApellidos.valido) {
        alert(validacionApellidos.mensaje);
        formularioValido = false;
    }

    // Validar email
    const validacionEmail = validador.validarEmail(campos.email.value);
    if (!validacionEmail.valido) {
        alert(validacionEmail.mensaje);
        formularioValido = false;
    }

    // Validar contraseña
    const validacionPassword = validador.validarPassword(campos.password.value);
    if (!validacionPassword.valido) {
        alert(validacionPassword.mensaje);
        formularioValido = false;
    }

    // Validar confirmación de contraseña
    if (campos.password.value !== campos.confirmPassword.value) {
        alert('Las contraseñas no coinciden');
        formularioValido = false;
    }

    return formularioValido;
}

// Formulario de Producto (Admin)
function validarProducto() {
    const nombre = document.getElementById('productoNombre').value;
    const precio = document.getElementById('productoPrecio').value;
    const stock = document.getElementById('productoStock').value;
    const descripcion = document.getElementById('productoDescripcion').value;

    const validacionNombre = validador.validarTexto(nombre, 100);
    const validacionPrecio = validador.validarNumero(precio, 0);
    const validacionStock = validador.validarNumero(stock, 0);
    const validacionDescripcion = validador.validarTexto(descripcion, 500);

    if (!validacionNombre.valido) {
        alert(validacionNombre.mensaje);
        return false;
    }

    if (!validacionPrecio.valido) {
        alert(validacionPrecio.mensaje);
        return false;
    }

    if (!validacionStock.valido) {
        alert(validacionStock.mensaje);
        return false;
    }

    if (!validacionDescripcion.valido) {
        alert(validacionDescripcion.mensaje);
        return false;
    }

    return true;
}

// FUNCIONES AUXILIARES
function mostrarError(elementoId, validacion) {
    const elementoError = document.getElementById(elementoId);
    const campo = document.getElementById(elementoId.replace('error', '').toLowerCase());

    if (elementoError && campo) {
        elementoError.textContent = validacion.mensaje;
        elementoError.style.display = validacion.valido ? 'none' : 'block';
        
        if (validacion.valido) {
            campo.classList.remove('error');
            campo.classList.add('success');
        } else {
            campo.classList.remove('success');
            campo.classList.add('error');
        }
    }
}

function limpiarErrores() {
    const errores = document.querySelectorAll('.error-msg');
    errores.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    const campos = document.querySelectorAll('.error, .success');
    campos.forEach(campo => {
        campo.classList.remove('error', 'success');
    });
}

// VALIDACIONES EN TIEMPO REAL
document.addEventListener('DOMContentLoaded', function() {
    // Validación en tiempo real para formulario de contacto
    const formContacto = document.getElementById('formContacto');
    if (formContacto) {
        const camposRealTime = ['nombre', 'email', 'mensaje'];
        
        camposRealTime.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.addEventListener('blur', function() {
                    let validacion;
                    
                    switch(campoId) {
                        case 'nombre':
                            validacion = validador.validarNombre(this.value);
                            break;
                        case 'email':
                            validacion = validador.validarEmail(this.value);
                            break;
                        case 'mensaje':
                            validacion = validador.validarTexto(this.value, 500);
                            break;
                    }
                    
                    mostrarError(`error${campoId.charAt(0).toUpperCase() + campoId.slice(1)}`, validacion);
                });
            }
        });
    }

    // Validación para caracteres restantes
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const contador = document.createElement('div');
        contador.className = 'contador-caracteres';
        contador.innerHTML = `<span>0</span>/${maxLength} caracteres`;
        textarea.parentNode.insertBefore(contador, textarea.nextSibling);

        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const span = contador.querySelector('span');
            span.textContent = currentLength;
            
            if (currentLength > maxLength * 0.9) {
                span.style.color = '#ff4757';
            } else if (currentLength > maxLength * 0.8) {
                span.style.color = '#ffa502';
            } else {
                span.style.color = '#2ed573';
            }
        });
    });
});

// EXPORTAR PARA USO EN OTROS ARCHIVOS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Validador, validador };
}