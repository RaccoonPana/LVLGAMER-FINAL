class Producto {
    constructor(id, nombre, precio, categoria, imagen, descripcion, stock = 10) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.stock = stock;
    }
}

// Array de productos Level-Up Gamer
const productos = [
    new Producto(1, "PlayStation 5", 549990, "Consolas", "img/ps5.jpg", "Consola de última generación Sony PS5 con SSD ultrarrápido"),
    new Producto(2, "Xbox Series X", 499990, "Consolas", "img/xbox-series-x.jpg", "Potencia de 12 TFLOPS, 4K a 60fps"),
    new Producto(3, "Nintendo Switch OLED", 349990, "Consolas", "img/switch-oled.jpg", "Pantalla OLED de 7 pulgadas, modo portátil y TV"),
    new Producto(4, "PC Gamer ASUS ROG", 1299990, "PC Gaming", "img/pc-gamer-asus.jpg", "RTX 4070, Intel i7, 16GB RAM, SSD 1TB"),
    new Producto(5, "Silla Gamer SecretLab", 349990, "Sillas", "img/silla-secretlab.jpg", "Silla ergonómica premium para maratones gaming"),
    new Producto(6, "Mouse Logitech G502", 49990, "Perifericos", "img/mouse-logitech.jpg", "Sensor HERO 25K, 11 botones programables"),
    new Producto(7, "Teclado Mecánico Razer", 89990, "Perifericos", "img/teclado-razer.jpg", "Switches Razer Green, RGB Chroma"),
    new Producto(8, "Auriculares HyperX Cloud II", 79990, "Accesorios", "img/auriculares-hyperx.jpg", "Sonido surround 7.1, micrófono desmontable"),
    new Producto(9, "Monitor Gamer 240Hz", 299990, "PC Gaming", "img/monitor-240hz.jpg", "27 pulgadas, 240Hz, 1ms, FreeSync Premium")
];

// Guardar productos en localStorage
localStorage.setItem("productos", JSON.stringify(productos));

function renderProductos(categoria = 'todos') {
    const container = document.getElementById('lista-productos');
    const productosFiltrados = categoria === 'todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoria);
    
    container.innerHTML = '';

    productosFiltrados.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'ficha';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <hr>
            <p class="categoria">${producto.categoria}</p>
            <p class="descripcion">${producto.descripcion}</p>
            <p class="precio">$${producto.precio.toLocaleString()} CLP</p>
            <p class="stock">Stock: ${producto.stock} unidades</p>
            <input type="button" value="🎮 Agregar al Carrito" onclick="agregarAlCarrito(${producto.id})">
        `;
        container.appendChild(div);
    });
}

function filtrarProductos(categoria) {
    // Actualizar botones activos
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderProductos(categoria);
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('lista-productos')) {
        renderProductos();
    }
    if (document.getElementById('productos-destacados')) {
        renderProductosDestacados();
    }
});

function renderProductosDestacados() {
    const container = document.getElementById('productos-destacados');
    const destacados = productos.slice(0, 6); // Primeros 6 productos
    
    container.innerHTML = '';

    destacados.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'ficha';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <hr>
            <p>${producto.descripcion}</p>
            <p class="precio-destacado">$${producto.precio.toLocaleString()} CLP</p>
            <input type="button" value="🎮 Comprar Ahora" onclick="agregarAlCarrito(${producto.id})">
        `;
        container.appendChild(div);
    });
}