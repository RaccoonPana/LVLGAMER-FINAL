// Admin guard: redirect to login if not admin
/**
 * admin_guard.js
 * Propósito: Proteger páginas de administración. Si no hay sesión de admin
 * en `localStorage.session_user`, redirige a login_register.html.
 * Lógica:
 * - isAdmin(): revisa role==='admin' o email admin@duoc.(cl|,cl)
 * - Al DOMContentLoaded: si no es admin, alerta y redirige.
 */
(function(){
  function isAdmin(){
    try {
      const s = JSON.parse(localStorage.getItem('session_user'));
      if (!s) return false;
      if ((s.role && s.role.toLowerCase() === 'admin')) return true;
      if (s.email && (s.email.toLowerCase() === 'admin@duoc.cl' || s.email.toLowerCase() === 'admin@duoc,cl')) return true;
      return false;
    } catch(_) { return false; }
  }
  document.addEventListener('DOMContentLoaded', function(){
    if (!isAdmin()) {
      alert('Acceso restringido. Inicia sesión como administrador.');
      window.location.href = 'login_register.html';
    }
  });
})();
