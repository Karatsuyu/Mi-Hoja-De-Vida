  // Suavizar scroll al hacer clic en enlaces del menú
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  });
});

// Lightbox para la foto de perfil
(function () {
  const modal = document.getElementById('imgModal');
  const modalImg = modal ? modal.querySelector('.img-modal__image') : null;
  const closeBtn = modal ? modal.querySelector('.img-modal__close') : null;

  // Si no existe el modal en la página, no hacer nada.
  if (!modal || !modalImg) return;

  // Abrir modal al hacer clic en la imagen de perfil
  const profileImg = document.querySelector('.profile img');
  if (profileImg) {
    profileImg.style.cursor = 'zoom-in';
    profileImg.title = 'Ver imagen completa';
    profileImg.addEventListener('click', () => {
      const fullSrc = profileImg.getAttribute('src');
      modalImg.setAttribute('src', fullSrc);
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      // evitar scroll de fondo
      document.body.style.overflow = 'hidden';
    });
  }

  // Cerrar modal
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.removeAttribute('src');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Cerrar si hace clic fuera de la imagen
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();

// ==========================
// Toggle de tema (Día/Noche)
// ==========================
(function () {
  const THEME_KEY = 'site-theme';
  const body = document.body;
  const btn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    if (theme === 'light') {
      body.setAttribute('data-theme', 'light');
    } else {
      body.removeAttribute('data-theme');
    }
    // Ajustar icono/texto si existe el botón
    if (btn) {
      const icon = btn.querySelector('i');
      const text = btn.querySelector('.text');
      if (body.getAttribute('data-theme') === 'light') {
        if (icon) icon.className = 'fas fa-moon icon';
        if (text) text.textContent = 'Modo Noche';
      } else {
        if (icon) icon.className = 'fas fa-sun icon';
        if (text) text.textContent = 'Modo Día';
      }
    }
  }

  // Cargar tema guardado
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || 'dark');

  if (btn) {
    btn.addEventListener('click', (e) => {
      const isLight = body.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';

      // Coordenadas del botón (centro) para iniciar la animación
      const rect = btn.getBoundingClientRect();
      const cx = Math.round(rect.left + rect.width / 2);
      const cy = Math.round(rect.top + rect.height / 2);

      // Calcular el radio máximo necesario para cubrir toda la pantalla
      const vw = Math.max(window.innerWidth, document.documentElement.clientWidth);
      const vh = Math.max(window.innerHeight, document.documentElement.clientHeight);
      const farthestX = Math.max(cx, vw - cx);
      const farthestY = Math.max(cy, vh - cy);
      const maxRadius = Math.ceil(Math.hypot(farthestX, farthestY));

      // 1) Cambiar inmediatamente el tema para que los elementos cambien ya
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);

      // 2) Crear overlay de revelado que deja ver el nuevo tema dentro del círculo en expansión
      const reveal = document.createElement('div');
      reveal.className = 'theme-reveal';
      // El overlay pinta el color “antiguo” fuera del círculo, para que parezca que el nuevo tema emerge desde el botón
      reveal.style.setProperty('--overlay-bg', next === 'light' ? '#000000' : '#ffffff');
      reveal.style.setProperty('--cx', cx + 'px');
      reveal.style.setProperty('--cy', cy + 'px');
      document.body.appendChild(reveal);

      const DURATION = 700;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / DURATION);
        // easeInOutCubic para suavidad
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const currentR = Math.floor(eased * maxRadius);
        reveal.style.setProperty('--r', currentR + 'px');
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          // limpiar
          reveal.remove();
        }
      }

      // Iniciar animación
      requestAnimationFrame(step);
    });
  }
})();
