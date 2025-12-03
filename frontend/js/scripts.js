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

// ==========================================
// Barras de progreso semicirculares en flip cards
// ==========================================
(function () {
  // Función para animar contador de porcentaje
  function animatePercentage(element, target) {
    let current = 0;
    const increment = target / 60; // 60 frames aproximadamente
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '%';
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current) + '%';
      }
    }, 25);
  }

  // Inicializar tarjetas flip con barras de progreso
  const flipCards = document.querySelectorAll('.flip-card');

  flipCards.forEach(card => {
    const percent = card.dataset.percent;
    const color = card.dataset.color;
    const label = card.dataset.label;
    const backCard = card.querySelector('.flip-card-back');

    if (!backCard || !percent) return;

    // Crear SVG semicircular
    const svgHTML = `
      <div class="skill-progress">
        <svg viewBox="0 -7 180 97">
          <path class="bg" d="M10 80 A80 80 0 0 1 170 80"></path>
          <path class="progress" d="M10 80 A80 80 0 0 1 170 80" 
                stroke="${color}" 
                style="stroke-dashoffset: 283;"></path>
        </svg>
        <div class="info">
          <div class="percent">0%</div>
          <div class="label">${label}</div>
        </div>
      </div>
    `;

    backCard.innerHTML = svgHTML;

    // Animar cuando la tarjeta se voltea
    const progressPath = backCard.querySelector('.progress');
    const percentElement = backCard.querySelector('.percent');

    // Función para reiniciar y animar
    function startAnimation() {
      // Resetear la barra y el contador
      progressPath.style.transition = 'none';
      progressPath.style.strokeDashoffset = '283';
      percentElement.textContent = '0%';

      // Forzar reflow para que el reseteo surta efecto
      void progressPath.offsetWidth;

      // Restaurar transición y animar
      setTimeout(() => {
        progressPath.style.transition = 'stroke-dashoffset 1.5s ease';
        
        // Calcular stroke-dashoffset basado en el porcentaje
        const circumference = 283;
        const offset = circumference - (circumference * percent / 100);
        progressPath.style.strokeDashoffset = offset;

        // Animar el contador
        animatePercentage(percentElement, parseInt(percent));
      }, 50);
    }

    // Detectar cuando la tarjeta se voltea (mouseenter)
    card.addEventListener('mouseenter', () => {
      setTimeout(() => {
        startAnimation();
      }, 300); // Esperar a que termine la animación de flip
    });
  });
})();

// Style dropdown toggle
(function initStyleToggle() {
  const btn = document.getElementById('styleToggleBtn');
  const dropdown = document.getElementById('styleDropdown');
  const sidebar = document.querySelector('.sidebar');
  
  if (!btn || !dropdown) return;
  
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });
  
  // Cerrar dropdown cuando se cierra el sidebar (mouse deja el sidebar)
  if (sidebar) {
    sidebar.addEventListener('mouseleave', () => {
      dropdown.style.display = 'none';
    });
  }
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[style*="position: relative"]')) {
      dropdown.style.display = 'none';
    }
  });
})();

// Mobile Menu Toggle
(function() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.querySelector('.sidebar');
  
  if (!menuBtn || !sidebar) return;

  // Toggle menú al hacer clic en el botón
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('mobile-open');
  });

  // Cerrar menú al hacer clic en un enlace
  const navLinks = sidebar.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-btn')) {
      sidebar.classList.remove('mobile-open');
    }
  });

  // Cerrar menú al hacer scroll
  window.addEventListener('scroll', () => {
    sidebar.classList.remove('mobile-open');
  });
})();

// ========== FORMULARIO DE CONTACTO ==========
(function() {
  console.log('🔍 Iniciando sistema de formulario...');
  
  const form = document.getElementById('contactForm');
  const responseMessage = document.getElementById('responseMessage');
  
  if (!form) {
    console.log('❌ Formulario no encontrado, no estamos en la página de contacto');
    return;
  }
  
  console.log('✅ Formulario encontrado, inicializando...');
  
  const inputs = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
  };
  
  const errors = {
    username: document.getElementById('username-error'),
    email: document.getElementById('email-error'),
    message: document.getElementById('message-error')
  };
  
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');
  const charCount = document.getElementById('char-count');
  
  // Configuración de la API
  const API_BASE_URL = 'http://localhost:8001'; // Puerto 8001 para evitar conflicto con Django
  console.log('📡 API configurada:', API_BASE_URL);
  
  // Contador de caracteres para el mensaje
  if (inputs.message && charCount) {
    inputs.message.addEventListener('input', () => {
      const count = inputs.message.value.length;
      charCount.textContent = count;
      
      // Cambiar color según el límite
      if (count > 1900) {
        charCount.style.color = '#ef4444';
      } else if (count > 1500) {
        charCount.style.color = '#f59e0b';
      } else {
        charCount.style.color = '#64748b';
      }
    });
  }
  
  // Validación en tiempo real
  Object.keys(inputs).forEach(field => {
    const input = inputs[field];
    const error = errors[field];
    
    if (!input || !error) return;
    
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => clearError(field));
  });
  
  function validateField(field) {
    const input = inputs[field];
    const error = errors[field];
    const value = input.value.trim();
    
    clearError(field);
    
    switch (field) {
      case 'username':
        if (!value) {
          showError(field, 'El nombre es obligatorio');
          return false;
        }
        if (value.length < 2) {
          showError(field, 'El nombre debe tener al menos 2 caracteres');
          return false;
        }
        if (value.length > 100) {
          showError(field, 'El nombre no puede exceder 100 caracteres');
          return false;
        }
        break;
        
      case 'email':
        if (!value) {
          showError(field, 'El email es obligatorio');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showError(field, 'Por favor ingresa un email válido');
          return false;
        }
        break;
        
      case 'message':
        if (!value) {
          showError(field, 'El mensaje es obligatorio');
          return false;
        }
        if (value.length < 10) {
          showError(field, 'El mensaje debe tener al menos 10 caracteres');
          return false;
        }
        if (value.length > 2000) {
          showError(field, 'El mensaje no puede exceder 2000 caracteres');
          return false;
        }
        break;
    }
    
    return true;
  }
  
  function showError(field, message) {
    const error = errors[field];
    if (error) {
      error.textContent = message;
      error.classList.add('show');
    }
  }
  
  function clearError(field) {
    const error = errors[field];
    if (error) {
      error.textContent = '';
      error.classList.remove('show');
    }
  }
  
  function clearAllErrors() {
    Object.keys(errors).forEach(field => clearError(field));
  }
  
  function showResponseMessage(message, type) {
    responseMessage.textContent = message;
    responseMessage.className = `response-message ${type}`;
    responseMessage.style.display = 'block';
    
    // Auto-hide después de 5 segundos si es éxito
    if (type === 'success') {
      setTimeout(() => {
        responseMessage.style.display = 'none';
      }, 5000);
    }
  }
  
  function setLoading(loading) {
    submitBtn.disabled = loading;
    
    if (loading) {
      btnText.style.opacity = '0';
      spinner.style.display = 'block';
      submitBtn.style.cursor = 'not-allowed';
    } else {
      btnText.style.opacity = '1';
      spinner.style.display = 'none';
      submitBtn.style.cursor = 'pointer';
    }
  }
  
  // Enviar formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpiar mensajes anteriores
    clearAllErrors();
    responseMessage.style.display = 'none';
    
    // Validar todos los campos
    const isValid = Object.keys(inputs).every(field => validateField(field));
    
    if (!isValid) {
      showResponseMessage('Por favor corrige los errores antes de enviar', 'error');
      return;
    }
    
    // Preparar datos
    const formData = {
      username: inputs.username.value.trim(),
      email: inputs.email.value.trim(),
      message: inputs.message.value.trim()
    };
    
    // Enviar a la API
    setLoading(true);
    console.log('📤 Enviando datos:', formData);
    console.log('🌐 URL:', `${API_BASE_URL}/contact`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      console.log('📡 Respuesta recibida:', response.status, response.statusText);
      
      // Verificar si la respuesta es JSON válido
      const contentType = response.headers.get("content-type");
      console.log('📄 Content-Type:', contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error('❌ Respuesta no es JSON:', textResponse);
        throw new Error('El servidor devolvió una respuesta no válida (no JSON)');
      }
      
      const result = await response.json();
      console.log('✅ Datos recibidos:', result);
      
      if (response.ok && result.success) {
        showResponseMessage(result.message, 'success');
        form.reset();
        if (charCount) charCount.textContent = '0';
        
        // Scroll al mensaje de éxito
        responseMessage.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
      } else {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }
      
    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = 'Error al enviar el mensaje. ';
      
      if (error.message.includes('fetch')) {
        errorMessage += 'Verifica tu conexión a internet y que el servidor esté funcionando.';
      } else {
        errorMessage += error.message;
      }
      
      showResponseMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  });
  
})();

