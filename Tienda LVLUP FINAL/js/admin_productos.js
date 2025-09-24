/**
 * admin_productos.js
 * Propósito: CRUD de productos usando LocalStorage para el panel admin.
 * Secciones principales:
 * - Estado y helpers (leer/escribir productos en LS, validaciones básicas)
 * - Render del listado (tabla) y binding de botones (editar/eliminar)
 * - Formulario: cargar datos, guardar (crear/editar) y limpiar
 * - Exportación a JSON
 */
// Admin Productos - CRUD LocalStorage
(function(){
  const TABLA = document.getElementById('tabla-productos');
  const FORM = document.getElementById('form-producto');
  const IDX = document.getElementById('prod-index');
  const F = {
    codigo: document.getElementById('prod-codigo'),
    nombre: document.getElementById('prod-nombre'),
    descripcion: document.getElementById('prod-descripcion'),
    precio: document.getElementById('prod-precio'),
    stock: document.getElementById('prod-stock'),
    stockcrit: document.getElementById('prod-stockcrit'),
    categoria: document.getElementById('prod-categoria'),
    imagen: document.getElementById('prod-imagen'),
  };

  function getProductos(){
    try { return JSON.parse(localStorage.getItem('productos')) || []; } catch(_) { return []; }
  }
  function setProductos(arr){ localStorage.setItem('productos', JSON.stringify(arr)); }

  function renderTabla(){
    const productos = getProductos();
    TABLA.innerHTML = '';
    productos.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.codigo || '-'}</td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>$${Number(p.precio).toLocaleString()}</td>
        <td>${p.stock ?? 0}</td>
        <td class="acciones">
          <button class="btn sec" onclick="editarProducto(${i})">✏️ Editar</button>
          <button class="btn danger" onclick="eliminarProducto(${i})">🗑️ Eliminar</button>
        </td>
      `;
      TABLA.appendChild(tr);
    });
  }

  function validar(){
    // Validaciones básicas del formulario
    if (!F.codigo.value || F.codigo.value.length < 3) { alert('Código mínimo 3 caracteres'); return false; }
    if (!F.nombre.value || F.nombre.value.length > 100) { alert('Nombre requerido (máx 100)'); return false; }
    if (F.descripcion.value.length > 500) { alert('Descripción máx 500'); return false; }
    const precio = Number(F.precio.value);
    if (isNaN(precio) || precio < 0) { alert('Precio debe ser ≥ 0'); return false; }
    const stock = Number(F.stock.value);
    if (!Number.isInteger(stock) || stock < 0) { alert('Stock entero ≥ 0'); return false; }
    const stockcrit = F.stockcrit.value === '' ? null : Number(F.stockcrit.value);
    if (stockcrit != null && (!Number.isInteger(stockcrit) || stockcrit < 0)) { alert('Stock crítico entero ≥ 0'); return false; }
    if (!F.categoria.value) { alert('Seleccione una categoría'); return false; }
    return true;
  }

  window.resetFormularioProducto = function(){
    IDX.value = '';
    FORM.reset();
  };

  window.guardarProducto = function(ev){
    ev.preventDefault();
    if (!validar()) return;
    const productos = getProductos();
    const index = IDX.value === '' ? -1 : Number(IDX.value);

    // Construir objeto compatible con tienda
    const base = {
      id: index >= 0 ? productos[index].id : Date.now(),
      codigo: F.codigo.value.trim(),
      nombre: F.nombre.value.trim(),
      descripcion: F.descripcion.value.trim(),
      precio: Number(F.precio.value),
      stock: Number(F.stock.value),
      stockCritico: F.stockcrit.value === '' ? undefined : Number(F.stockcrit.value),
      categoria: F.categoria.value,
      imagen: F.imagen.value.trim() || 'img/placeholder.jpg',
    };

    if (index >= 0) {
      productos[index] = { ...productos[index], ...base };
    } else {
      productos.push(base);
    }
    setProductos(productos);
    renderTabla();
    resetFormularioProducto();
    alert('Producto guardado');
  };

  window.editarProducto = function(index){
    const p = getProductos()[index];
    if (!p) return;
    IDX.value = String(index);
    F.codigo.value = p.codigo || '';
    F.nombre.value = p.nombre || '';
    F.descripcion.value = p.descripcion || '';
    F.precio.value = p.precio ?? 0;
    F.stock.value = p.stock ?? 0;
    F.stockcrit.value = p.stockCritico ?? '';
    F.categoria.value = p.categoria || '';
    F.imagen.value = p.imagen || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.eliminarProducto = function(index){
    const productos = getProductos();
    const p = productos[index];
    if (!p) return;
    if (!confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    productos.splice(index, 1);
    setProductos(productos);
    renderTabla();
  };

  window.eliminarProductoActual = function(){
    if (IDX.value === '') { alert('No hay producto cargado'); return; }
    const i = Number(IDX.value);
    window.eliminarProducto(i);
    resetFormularioProducto();
  };

  window.exportarProductos = function(){
    const data = localStorage.getItem('productos') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'productos.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Init
  document.addEventListener('DOMContentLoaded', renderTabla);
})();
