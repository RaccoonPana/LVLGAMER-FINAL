/**
 * carrito.js
 * Propósito: gestionar el carrito en LocalStorage y la UI asociada.
 * Funciones clave:
 * - agregarAlCarrito(id): agrega o incrementa producto en el carrito.
 * - actualizarContadorCarrito(): actualiza contadores (navbar y resumen en productos).
 * - vaciarCarritoLS(): vacía el carrito desde cualquier página.
 * - debugCarrito(): utilitaria para depuración.
 * Notas: usa la lista de productos persistida en `localStorage.productos`.
 */
class ProductoCarrito {
    constructor(id, nombre, precio, imagen, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = 1;
        this.total = precio;
        this.imagen = imagen;
        this.categoria = categoria;
    }
}

function agregarAlCarrito(id) {
    console.log('=== AGREGAR AL CARRITO ===');
    console.log('Producto ID:', id);
    
    // Obtener productos del localStorage
    const productosStorage = localStorage.getItem("productos");
    console.log('Productos en localStorage:', productosStorage);
    
    const productos = productosStorage ? JSON.parse(productosStorage) : [];
    console.log('Productos parseados:', productos);
    
    const producto = productos.find(p => p.id === id);
    console.log('Producto encontrado:', producto);
    
    if (!producto) {
        alert("❌ Producto no encontrado");
        return;
    }

    // Crear producto para el carrito
    const productoCarro = new ProductoCarrito(
        producto.id,
        producto.nombre,
        producto.precio,
        producto.imagen,
        producto.categoria
    );

    // Obtener carrito actual
    const carritoStorage = localStorage.getItem("carrito");
    console.log('Carrito en localStorage:', carritoStorage);
    
    let carrito = carritoStorage ? JSON.parse(carritoStorage) : [];
    console.log('Carrito actual:', carrito);

    let existe = false;

    // Verificar si el producto ya está en el carrito
    carrito.forEach((item, index) => {
        if (item.id === productoCarro.id) {
            carrito[index].cantidad += 1;
            carrito[index].total = carrito[index].precio * carrito[index].cantidad;
            existe = true;
            console.log('Producto existente, cantidad aumentada');
        }
    });

    if (!existe) {
        carrito.push(productoCarro);
        console.log('Nuevo producto agregado al carrito');
    }

    // Guardar en localStorage
    console.log('Carrito a guardar:', carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Verificar que se guardó correctamente
    const carritoVerificado = localStorage.getItem("carrito");
    console.log('Carrito después de guardar:', carritoVerificado);
    
    // Actualizar interfaz
    actualizarContadorCarrito();
    
    // Mensaje de confirmación
    alert(`✅ ¡${producto.nombre} agregado al carrito! 🎮`);
}

function actualizarContadorCarrito() {
    const carritoStorage = localStorage.getItem("carrito");
    const carrito = carritoStorage ? JSON.parse(carritoStorage) : [];
    
    console.log('=== ACTUALIZAR CONTADOR ===');
    console.log('Carrito:', carrito);
    
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + item.total, 0);
    
    console.log('Total items:', totalItems);
    console.log('Total precio:', totalPrecio);
    
    // Actualizar en la página de productos
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const cartCount = document.getElementById('cart-count');
    
    if (contadorCarrito) {
        contadorCarrito.textContent = totalItems;
    }
    if (totalCarrito) {
        totalCarrito.textContent = totalPrecio.toLocaleString();
        console.log('Total actualizado en productos:', totalPrecio);
    }
    if (cartCount) {
        cartCount.textContent = totalItems;
        console.log('Contador nav actualizado:', totalItems);
    }
}

// Vaciar carrito desde cualquier página
function vaciarCarritoLS() {
    const carritoStorage = localStorage.getItem("carrito");
    const carrito = carritoStorage ? JSON.parse(carritoStorage) : [];
    if (carrito.length === 0) {
        alert("El carrito ya está vacío");
        return;
    }
    if (!confirm("¿Estás seguro de vaciar todo el carrito?")) return;
    localStorage.setItem("carrito", JSON.stringify([]));
    actualizarContadorCarrito();
    if (typeof cargarCarrito === 'function') {
        try { cargarCarrito(); } catch (e) {}
    }
}

// Función para debug del carrito
function debugCarrito() {
    console.log('=== DEBUG CARRITO ===');
    console.log('localStorage carrito:', localStorage.getItem("carrito"));
    console.log('localStorage productos:', localStorage.getItem("productos"));
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log('Carrito parseado:', carrito);
    console.log('Número de items:', carrito.length);
    console.log('Total items:', carrito.reduce((sum, item) => sum + item.cantidad, 0));
}

// Inicializar contador al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carrito.js inicializado');
    debugCarrito();
    actualizarContadorCarrito();
});