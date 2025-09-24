/**
 * auth.js
 * Propósito: Manejo de autenticación simple con LocalStorage.
 * Incluye:
 * - Semilla de usuarios por defecto (admin y usuario demo).
 * - login(): valida credenciales y redirige según rol (admin → admin_index, cliente → index).
 * - registerUser(): valida y crea usuarios nuevos, con confirmación.
 * Notas: Persistencia en `localStorage.usuarios_app` y sesión en `localStorage.session_user`.
 */
// Auth: login/register + admin access via credentials
(function(){
  const LS_USERS_KEY = 'usuarios_app';

  function getUsers(){
    try { return JSON.parse(localStorage.getItem(LS_USERS_KEY)) || []; } catch(_) { return []; }
  }
  function setUsers(arr){ localStorage.setItem(LS_USERS_KEY, JSON.stringify(arr)); }

  // Seed default users once (admin and test user)
  function seedDefaults(){
    const users = getUsers();
    const exists = (email) => users.some(u => u.email.toLowerCase() === email.toLowerCase());
    // Accept both admin@duoc.cl and the variant admin@duoc,cl (comma) per request
    const adminEmails = ['admin@duoc.cl', 'admin@duoc,cl'];
    adminEmails.forEach(email => {
      if (!exists(email)) users.push({ email, pass: 'admin', role: 'admin' });
    });
    if (!exists('prueba@gmail.com')) users.push({ email: 'prueba@gmail.com', pass: 'prueba 123', role: 'cliente' });
    setUsers(users);
  }

  window.login = function(){
    const email = (document.getElementById('login-email')?.value || '').trim();
    const pass = document.getElementById('login-pass')?.value || '';
    if (!email || !pass) { alert('Completa correo y contraseña'); return; }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);

    if (!user) {
      alert('❌ No existe dicho usuario o credenciales incorrectas');
      return;
    }

    // Guardar sesión simple
    localStorage.setItem('session_user', JSON.stringify({ email: user.email, role: user.role }));

    if (user.role === 'admin' || email.toLowerCase() === 'admin@duoc.cl' || email.toLowerCase() === 'admin@duoc,cl') {
      alert('✅ Bienvenido administrador');
      window.location.href = 'admin_index.html';
    } else {
      alert('✅ Inicio de sesión correcto');
      // Redirige a la tienda o a donde prefieras
      window.location.href = 'index.html';
    }
  };

  window.registerUser = function(){
    const email = (document.getElementById('reg-email')?.value || '').trim();
    const pass = document.getElementById('reg-pass')?.value || '';
    const pass2 = document.getElementById('reg-pass2')?.value || '';

    if (!email) { alert('Ingresa un correo'); return; }
    if (!pass || pass.length < 4 || pass.length > 10) { alert('La contraseña debe ser de 4 a 10 caracteres'); return; }
    if (pass !== pass2) { alert('Las contraseñas no coinciden'); return; }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) { alert('El correo ya está registrado'); return; }

    users.push({ email, pass, role: 'cliente' });
    setUsers(users);
    alert('✅ Usuario creado correctamente');

    // Volver a login
    const toggle = document.getElementById('cambiar-formulario');
    if (toggle) toggle.checked = false;
  };

  document.addEventListener('DOMContentLoaded', seedDefaults);
})();
