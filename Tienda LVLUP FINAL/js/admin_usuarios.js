/**
 * admin_usuarios.js
 * Propósito: CRUD de usuarios para el panel admin usando LocalStorage.
 * Contiene:
 * - Helpers de almacenamiento y validaciones (RUN, dominios de correo, longitudes)
 * - Render de tabla con acciones (editar/eliminar)
 * - Manejo del formulario (cargar, guardar, limpiar)
 * - Carga dependiente Región/Comuna
 * - Exportación a JSON
 */
// Admin Usuarios - CRUD LocalStorage
(function(){
  const LS_USERS_PRIMARY = 'usuarios_app'; // mismo que usa auth.js
  const LS_USERS_LEGACY = 'usuarios';
  const TABLA = document.getElementById('tabla-usuarios');
  const FORM = document.getElementById('form-usuario');
  const IDX = document.getElementById('user-index');
  const F = {
    run: document.getElementById('user-run'),
    nombre: document.getElementById('user-nombre'),
    apellidos: document.getElementById('user-apellidos'),
    correo: document.getElementById('user-correo'),
    fecha: document.getElementById('user-fecha'),
    tipo: document.getElementById('user-tipo'),
    region: document.getElementById('user-region'),
    comuna: document.getElementById('user-comuna'),
    direccion: document.getElementById('user-direccion'),
  };

  // Regiones/comunas demo
  const regiones = {
    'Región Metropolitana': ['Santiago', 'Providencia', 'La Florida'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
  };

  // Utilidades para generación aleatoria de usuarios (sin admin)
  function calcularDV(body){
    let sum = 0, mul = 2;
    for (let i = body.length - 1; i >= 0; i--) { sum += parseInt(body[i], 10) * mul; mul = mul === 7 ? 2 : mul + 1; }
    const res = 11 - (sum % 11);
    return res === 11 ? '0' : res === 10 ? 'K' : String(res);
  }

  function generarRUN(){
    // 7 u 8 dígitos + DV
    const len = Math.random() < 0.5 ? 7 : 8;
    let body = '';
    for (let i = 0; i < len; i++) body += Math.floor(Math.random() * 10);
    return body + calcularDV(body);
  }

  const NOMBRES = ['Andrés','Valentina','Camila','Benjamín','Javiera','Diego','Catalina','Lucas','Sofía','Matías'];
  const APELLIDOS = ['González','Muñoz','Rojas','Díaz','Pérez','Soto','Contreras','Silva','Martínez','López'];
  const DOMINIOS = ['@gmail.com','@duoc.cl','@profesor.duoc.cl'];
  const TIPOS_NO_ADMIN = ['Cliente','Vendedor'];

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  function seedUsuariosDemo(minCantidad = 5){
    const existentes = getUsuarios();
    const emails = new Set(existentes.map(u => (u.correo||'').toLowerCase()));
    const total = existentes.length;
    const porCrear = Math.max(0, minCantidad - total);
    if (porCrear <= 0) return; // ya hay suficientes

    const nuevas = [];
    for (let i = 0; i < porCrear; i++) {
      const nombre = pick(NOMBRES);
      const apellido1 = pick(APELLIDOS);
      const apellido2 = pick(APELLIDOS);
      const apellidos = `${apellido1} ${apellido2}`;
      const base = (nombre + '.' + apellido1 + Math.floor(Math.random()*1000)).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
      let correo = base + pick(DOMINIOS);
      let intentos = 0;
      while (emails.has(correo) && intentos < 5) {
        correo = base + (Math.floor(Math.random()*1000)) + pick(DOMINIOS);
        intentos++;
      }
      emails.add(correo);

      const regionesKeys = Object.keys(regiones);
      const region = pick(regionesKeys);
      const comuna = pick(regiones[region]);
      const tipo = pick(TIPOS_NO_ADMIN);

      nuevas.push({
        run: generarRUN(),
        nombre,
        apellidos,
        correo,
        fecha: null,
        tipo,              // Nunca 'Administrador'
        role: tipo.toLowerCase(),
        region,
        comuna,
        direccion: `Calle ${Math.floor(Math.random()*900)+100} #${Math.floor(Math.random()*900)+100}`,
      });
    }

    const fusion = existentes.concat(nuevas);
    setUsuarios(fusion);
  }

  function getUsuarios(){
    try {
      const primary = JSON.parse(localStorage.getItem(LS_USERS_PRIMARY)) || [];
      const legacy = JSON.parse(localStorage.getItem(LS_USERS_LEGACY)) || [];
      // Merge por correo (case-insensitive), priorizando primary
      const map = new Map();
      legacy.forEach(u => { if (u && u.correo) map.set(u.correo.toLowerCase(), u); });
      primary.forEach(u => { if (u && u.correo) map.set(u.correo.toLowerCase(), u); });
      return Array.from(map.values());
    } catch(_) { return []; }
  }
  function setUsuarios(arr){
    // Guardar en ambos para compatibilidad hacia atrás
    localStorage.setItem(LS_USERS_PRIMARY, JSON.stringify(arr));
    localStorage.setItem(LS_USERS_LEGACY, JSON.stringify(arr));
  }

  function renderTabla(){
    const usuarios = getUsuarios();
    TABLA.innerHTML = '';
    usuarios.forEach((u, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.run}</td>
        <td>${u.nombre}</td>
        <td>${u.apellidos}</td>
        <td>${u.correo}</td>
        <td>${u.tipo}</td>
        <td class="acciones">
          <button class="btn sec" onclick="editarUsuario(${i})">✏️ Editar</button>
          <button class="btn danger" onclick="eliminarUsuario(${i})">🗑️ Eliminar</button>
        </td>
      `;
      TABLA.appendChild(tr);
    });
  }

  function validarRUN(run){
    const r = run.toUpperCase().trim();
    if (!/^([0-9K]{7,9})$/.test(r)) return false;
    // Validación simple de dígito verificador (módulo 11)
    const body = r.slice(0, -1);
    const dv = r.slice(-1);
    let sum = 0, mul = 2;
    for (let i = body.length - 1; i >= 0; i--) { sum += parseInt(body[i], 10) * mul; mul = mul === 7 ? 2 : mul + 1; }
    const res = 11 - (sum % 11);
    const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
    return dv === dvCalc;
  }

  function validar(){
    const run = F.run.value.replace(/\./g, '').replace(/-/g, '');
    if (!validarRUN(run)) { alert('RUN inválido (7-9, sin puntos ni guion, con dígito verificador)'); return false; }
    if (!F.nombre.value || F.nombre.value.length > 50) { alert('Nombre requerido (máx 50)'); return false; }
    if (!F.apellidos.value || F.apellidos.value.length > 100) { alert('Apellidos requeridos (máx 100)'); return false; }
    const correo = F.correo.value.trim();
    const dominioOK = /@duoc\.cl$|@profesor\.duoc\.cl$|@gmail\.com$/i.test(correo);
    if (!dominioOK || correo.length > 100) { alert('Correo inválido o dominio no permitido'); return false; }
    if (!F.tipo.value) { alert('Seleccione tipo de usuario'); return false; }
    if (!F.region.value || !F.comuna.value) { alert('Seleccione región y comuna'); return false; }
    if (!F.direccion.value || F.direccion.value.length > 300) { alert('Dirección requerida (máx 300)'); return false; }
    return true;
  }

  window.cargarRegiones = function(){
    F.region.innerHTML = '<option value="">Seleccione...</option>' + Object.keys(regiones).map(r => `<option>${r}</option>`).join('');
  };

  window.cargarComunas = function(){
    const r = F.region.value;
    const comunas = regiones[r] || [];
    F.comuna.innerHTML = '<option value="">Seleccione...</option>' + comunas.map(c => `<option>${c}</option>`).join('');
  };

  window.resetFormularioUsuario = function(){
    IDX.value = '';
    FORM.reset();
    cargarRegiones();
    F.comuna.innerHTML = '<option value="">Seleccione...</option>';
  };

  window.guardarUsuario = function(ev){
    ev.preventDefault();
    if (!validar()) return;
    const usuarios = getUsuarios();
    const index = IDX.value === '' ? -1 : Number(IDX.value);

    const obj = {
      run: F.run.value.replace(/\./g, '').replace(/-/g, '').toUpperCase(),
      nombre: F.nombre.value.trim(),
      apellidos: F.apellidos.value.trim(),
      correo: F.correo.value.trim(),
      fecha: F.fecha.value || null,
      tipo: F.tipo.value,
      // Mapear tipo a role para compatibilidad con auth.js
      role: (F.tipo.value || '').toLowerCase() === 'administrador' ? 'admin' : (F.tipo.value || '').toLowerCase(),
      region: F.region.value,
      comuna: F.comuna.value,
      direccion: F.direccion.value.trim(),
    };

    if (index >= 0) { usuarios[index] = { ...usuarios[index], ...obj }; }
    else { usuarios.push(obj); }

    setUsuarios(usuarios);
    renderTabla();
    resetFormularioUsuario();
    alert('Usuario guardado');
  };

  window.editarUsuario = function(index){
    const u = getUsuarios()[index];
    if (!u) return;
    IDX.value = String(index);
    F.run.value = u.run || '';
    F.nombre.value = u.nombre || '';
    F.apellidos.value = u.apellidos || '';
    F.correo.value = u.correo || '';
    F.fecha.value = u.fecha || '';
    F.tipo.value = u.tipo || '';
    F.region.value = u.region || '';
    cargarComunas();
    F.comuna.value = u.comuna || '';
    F.direccion.value = u.direccion || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.eliminarUsuario = function(index){
    const usuarios = getUsuarios();
    const u = usuarios[index];
    if (!u) return;
    if (!confirm(`¿Eliminar el usuario "${u.nombre} ${u.apellidos}"?`)) return;
    usuarios.splice(index, 1);
    setUsuarios(usuarios);
    renderTabla();
  };

  window.eliminarUsuarioActual = function(){
    if (IDX.value === '') { alert('No hay usuario cargado'); return; }
    const i = Number(IDX.value);
    window.eliminarUsuario(i);
    resetFormularioUsuario();
  };

  window.exportarUsuarios = function(){
    const data = localStorage.getItem('usuarios') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'usuarios.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Init
  document.addEventListener('DOMContentLoaded', function(){
    // Sembrar usuarios demo si hay pocos (nunca admin)
    seedUsuariosDemo(5);
    renderTabla();
    cargarRegiones();
  });
})();
