/**
 * detalle_producto.js
 * Propósito: Renderizar la vista de detalle de un producto.
 * Flujo:
 * 1) Lee el parámetro `id` de la URL.
 * 2) Carga productos desde localStorage y busca el producto con ese id.
 * 3) Pinta la UI (imagen, nombre, descripción, precio, stock).
 * 4) Conecta el botón "Agregar al Carrito" con agregarAlCarrito(id).
 */
// Detalle de Producto
(function(){
  function qs(param){
    const u = new URL(window.location.href);
    return u.searchParams.get(param);
  }
  function getProductos(){ try { return JSON.parse(localStorage.getItem('productos')) || []; } catch(_) { return []; } }

  function render(){
    const id = Number(qs('id'));
    const prods = getProductos();
    const p = prods.find(x => x.id === id);
    const wrap = document.getElementById('detalle-producto');
    if (!p) {
      wrap.innerHTML = '<p>Producto no encontrado. <a href="productos.html">Volver</a></p>';
      return;
    }
    wrap.innerHTML = `
      <div class="detalle-img"><img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='img/placeholder.jpg'"></div>
      <div class="detalle-info">
        <h1>${p.nombre}</h1>
        <p class="categoria">Categoría: ${p.categoria}</p>
        <p class="descripcion">${p.descripcion}</p>
        <p class="precio">Precio: $${p.precio.toLocaleString()} CLP</p>
        <p class="stock">Stock: ${p.stock ?? 0} unidades</p>
        <div class="acciones">
          <button class="btn" id="btn-agregar">🎮 Agregar al Carrito</button>
          <a class="btn sec" href="productos.html">← Volver</a>
        </div>
      </div>
    `;

    const btn = document.getElementById('btn-agregar');
    btn.addEventListener('click', function(){
      if (typeof agregarAlCarrito === 'function') {
        agregarAlCarrito(p.id);
      } else {
        alert('Función de carrito no disponible');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
