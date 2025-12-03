document.addEventListener('DOMContentLoaded', function(){
  // Selector de colores
  (function initColorSelector() {
    const colorBtn = document.querySelector('.color-selector-btn');
    const colorDropdown = document.querySelector('.color-dropdown');
    const colorOptions = document.querySelectorAll('.color-option');

    if (!colorBtn) return;

    // Toggle dropdown
    colorBtn.addEventListener('click', () => {
      colorDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.color-selector-wrapper')) {
        colorDropdown.classList.remove('active');
      }
    });

    // Color mapping (HSL values)
    const colors = {
      magenta: { hue: 280, saturation: 100, lightness: 50 },
      purple: { hue: 270, saturation: 100, lightness: 50 },
      red: { hue: 0, saturation: 100, lightness: 50 },
      orange: { hue: 30, saturation: 100, lightness: 50 },
      yellow: { hue: 60, saturation: 100, lightness: 50 },
      green: { hue: 120, saturation: 100, lightness: 50 },
      cyan: { hue: 180, saturation: 100, lightness: 50 },
      blue: { hue: 240, saturation: 100, lightness: 50 },
      pink: { hue: 300, saturation: 100, lightness: 50 }
    };

    // Change color function
    function changeColor(colorName) {
      const color = colors[colorName];
      if (!color) return;

      const hue = color.hue;
      const sat = color.saturation;
      const light = color.lightness;

      // Main accent color
      const accentColor = `hsl(${hue}, ${sat}%, ${light}%)`;
      const accentGlow = `hsla(${hue}, ${sat}%, ${light}%, 0.95)`;

      // Convert HSL to RGB for gradient calculations
      const h = hue / 360;
      const s = sat / 100;
      const l = light / 100;
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      const r255 = Math.round(r * 255);
      const g255 = Math.round(g * 255);
      const b255 = Math.round(b * 255);

      // Set CSS variables for dynamic colors
      document.documentElement.style.setProperty('--accent', accentColor);
      document.documentElement.style.setProperty('--accent-glow', accentGlow);

      // Create and inject dynamic CSS for all hardcoded colors
      let styleId = 'dynamic-color-style';
      let styleEl = document.getElementById(styleId);
      
      if (styleEl) {
        styleEl.remove();
      }

      const dynamicCSS = `
        /* Dynamic color changes */
        :root {
          --accent: hsl(${hue}, ${sat}%, ${light}%);
          --accent-glow: hsla(${hue}, ${sat}%, ${light}%, 0.95);
        }

        /* Neon text effects */
        .neon-text, .accent, .nav-link.active, .section h2, .project-card h3,
        .training-card h3, .project-card p, .hero-title .accent,
        .rune-symbol, .runes span, .card-front h3, .card-back h3,
        .cert-year, .card-link, .card-front p, .card-back p,
        .contact-label, .cert-issuer, .skill-description,
        .rune-skill h3, h2, h3, .rune-start, .outer-rune-circle .runes span {
          color: hsl(${hue}, ${sat}%, ${light}%);
          text-shadow: 0 0 6px hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Borders and gradients with accent color */
        .card-inner, .certificate-card .cert-inner, .training-card,
        .project-card {
          border-color: rgba(${r255}, ${g255}, ${b255}, 0.4);
        }

        .card-back {
          border-color: rgba(${r255}, ${g255}, ${b255}, 0.6);
        }

        /* Hover effects */
        .card-inner:hover, .certificate-card:hover .cert-inner {
          box-shadow: 0 0 30px hsl(${hue}, ${sat}%, ${light}%), inset 0 0 40px rgba(${r255}, ${g255}, ${b255}, 0.2);
        }

        /* Training card hover */
        .training-card:hover {
          background: rgba(${r255}, ${g255}, ${b255}, 0.2);
          border-color: hsl(${hue}, ${sat}%, ${light}%);
          box-shadow: 0 0 20px hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Rune skill hover gradient */
        .rune-skill::before {
          background: linear-gradient(45deg, hsl(${hue}, ${sat}%, ${light}%), rgba(${r255}, ${g255}, ${b255}, 0.8), rgba(${r255}, ${g255}, ${b255}, 0.9), hsl(${hue}, ${sat}%, ${light}%)) !important;
        }

        .rune-skill:hover {
          box-shadow: 0 18px 40px rgba(${r255}, ${g255}, ${b255}, 0.12) !important;
          border-color: rgba(${r255}, ${g255}, ${b255}, 0.4) !important;
        }

        /* Buttons */
        .color-selector-btn::after, .nav-link:hover::after,
        .nav-link.active::after, .modal-close,
        .indicator, .modal-close {
          background: hsl(${hue}, ${sat}%, ${light}%);
          border-color: hsl(${hue}, ${sat}%, ${light}%);
          box-shadow: 0 0 10px hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Radar and circles */
        .circle-outer, .radial {
          stroke: hsl(${hue}, ${sat}%, ${light}%);
        }

        .tick {
          stroke: hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Skills and training */
        .skills-list li {
          background: hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Bars and progress */
        .skill-bar {
          background: linear-gradient(90deg, rgba(${r255}, ${g255}, ${b255}, 0.5), hsl(${hue}, ${sat}%, ${light}%));
        }

        .skill-progress {
          background: linear-gradient(90deg, var(--accent), rgba(${r255}, ${g255}, ${b255}, 0.7)) !important;
          box-shadow: 0 0 10px var(--accent-glow) !important;
        }

        /* Animation elements */
        .rune-glow {
          text-shadow: 0 0 10px hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Links */
        .card-link {
          color: hsl(${hue}, ${sat}%, ${light}%);
          text-shadow: 0 0 8px hsl(${hue}, ${sat}%, ${light}%);
        }

        .card-link:hover {
          text-shadow: 0 0 15px hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Particles and decorative elements */
        .circuit-line {
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent) !important;
        }

        .circuit-node {
          background: var(--accent) !important;
          box-shadow: 0 0 10px var(--accent-glow) !important;
        }

        .circuit-pulse {
          background: var(--accent) !important;
        }

        .circuit-circle {
          border-color: var(--accent) !important;
        }

        /* Spheres */
        .sphere {
          background: linear-gradient(135deg, hsl(${hue}, ${sat}%, ${light}%), rgba(${r255}, ${g255}, ${b255}, 0.6)) !important;
          box-shadow: 0 0 25px hsl(${hue}, ${sat}%, ${light}%), inset 0 0 20px rgba(255, 255, 255, 0.1) !important;
          border: none !important;
        }

        .sphere:hover {
          box-shadow: 0 0 35px hsl(${hue}, ${sat}%, ${light}%), inset 0 0 20px rgba(255, 255, 255, 0.2) !important;
        }

        /* Indicators */
        .indicator.active {
          background: hsl(${hue}, ${sat}%, ${light}%);
          box-shadow: 0 0 15px hsl(${hue}, ${sat}%, ${light}%);
        }

        .indicator:hover {
          background: hsl(${hue}, ${sat}%, ${light}%);
          box-shadow: 0 0 10px hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Certificate cards */
        .cert-icon {
          filter: drop-shadow(0 0 10px hsl(${hue}, ${sat}%, ${light}%)) !important;
        }

        /* Color dropdown */
        .color-option:hover {
          background: rgba(${r255}, ${g255}, ${b255}, 0.1);
          border-color: rgba(${r255}, ${g255}, ${b255}, 0.6);
        }

        /* Home nebula */
        .home-nebula {
          background: radial-gradient(circle at 30% 50%, rgba(${r255}, ${g255}, ${b255}, 0.15), transparent 50%) !important;
        }

        .menu-nebula {
          background: radial-gradient(circle at 70% 40%, rgba(${r255}, ${g255}, ${b255}, 0.08), transparent 60%) !important;
        }

        /* Rune floating animations */
        .floating-rune {
          color: hsl(${hue}, ${sat}%, ${light}%);
          text-shadow: 0 0 8px var(--accent-glow) !important;
          filter: drop-shadow(0 0 10px var(--accent-glow)) !important;
        }

        /* Background stars in home nebula */
        .home-nebula .star {
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(${r255}, ${g255}, ${b255}, 0.12) 55%, transparent 100%) !important;
          filter: drop-shadow(0 0 10px rgba(${r255}, ${g255}, ${b255}, 0.95)) !important;
          box-shadow: 0 0 6px rgba(${r255}, ${g255}, ${b255}, 0.5) !important;
        }

        /* Radar glow background */
        .radar-glow {
          background: radial-gradient(circle, rgba(${r255}, ${g255}, ${b255}, 0.25), transparent 70%) !important;
        }

        /* Center image neon effect */
        .center-image {
          filter: drop-shadow(0 0 15px rgba(${r255}, ${g255}, ${b255}, 0.8)) drop-shadow(0 0 30px rgba(${r255}, ${g255}, ${b255}, 0.6)) !important;
        }

        /* Outer rune circle - runas girando */
        .outer-rune-circle .runes span {
          color: hsl(${hue}, ${sat}%, ${light}%) !important;
          filter: drop-shadow(0 0 6px hsl(${hue}, ${sat}%, ${light}%)) !important;
        }

        .outer-rune-border {
          border-color: hsl(${hue}, ${sat}%, ${light}%) !important;
        }

        /* Radar lines */
        .radial {
          stroke: hsl(${hue}, ${sat}%, ${light}%) !important;
          filter: drop-shadow(0 0 4px hsl(${hue}, ${sat}%, ${light}%)) !important;
        }

        /* Background stars in sections */
        .star-contact {
          background: hsl(${hue}, ${sat}%, ${light}%);
        }

        /* Rune skill cards */
        .rune-skill {
          border-color: rgba(${r255}, ${g255}, ${b255}, 0.3) !important;
        }

        /* String animation */
        .string {
          background: linear-gradient(to bottom, var(--accent-glow), transparent) !important;
        }

        /* Carousel container active glow */
        .carousel-3d-card.active {
          filter: drop-shadow(0 0 30px var(--accent-glow)) !important;
        }

        /* Card glow radial */
        .card-glow {
          background: radial-gradient(circle at 30% 30%, rgba(${r255}, ${g255}, ${b255}, 0.3), transparent 60%) !important;
        }

        /* Card thumb shimmer */
        .card-thumb {
          background: linear-gradient(135deg, rgba(${r255}, ${g255}, ${b255}, 0.25), rgba(${r255}, ${g255}, ${b255}, 0.15)) !important;
          box-shadow: 0 6px 20px var(--accent-glow) inset !important;
        }
      `;

      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = dynamicCSS;
      document.head.appendChild(styleEl);

      // Save preference
      localStorage.setItem('selectedColor', colorName);

      // Close dropdown
      colorDropdown.classList.remove('active');
    }

    // Add event listeners to color options
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        const colorName = option.getAttribute('data-color');
        changeColor(colorName);
      });
    });

    // Load saved color on page load
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor && colors[savedColor]) {
      changeColor(savedColor);
    }
  })();

  // Selector de Estilos
  (function initStyleSelector() {
    const styleBtn = document.querySelector('.style-selector-btn');
    const styleDropdown = document.querySelector('.style-dropdown');
    const styleOptions = document.querySelectorAll('.style-option');

    if (!styleBtn) return;

    // Toggle dropdown
    styleBtn.addEventListener('click', () => {
      styleDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.style-selector-wrapper')) {
        styleDropdown.classList.remove('active');
      }
    });
  })();

  // Año en footer

  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  const yearBottom = document.getElementById('year-bottom') || document.getElementById('year');
  if(yearBottom) yearBottom.textContent = new Date().getFullYear();

  // Toggle tema (clásico claro/oscuro simple)
  const toggle = document.getElementById('toggleTheme');
  toggle && toggle.addEventListener('click', function(){
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    // Toggle entre dark y light
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });

  // Generar los ticks del radar en el SVG (evitar document.write)
  try{
    const svg = document.querySelector('.radar-svg');
    const ticksGroup = svg && svg.querySelector('.ticks');
    if(svg && ticksGroup){
      const ns = 'http://www.w3.org/2000/svg';
      for(let i=0;i<360;i+=6){
        const rad = i * Math.PI / 180;
        const x1 = 250 + Math.cos(rad) * 220;
        const y1 = 250 + Math.sin(rad) * 220;
        const x2 = 250 + Math.cos(rad) * 210;
        const y2 = 250 + Math.sin(rad) * 210;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'tick');
        ticksGroup.appendChild(line);
      }
    }
  }catch(e){
    // No bloquear la página si algo falla
    // console.warn('Radar ticks generation failed', e);
  }

  // Imprimir / exportar
  const printBtn = document.getElementById('printBtn');
  printBtn && printBtn.addEventListener('click', function(){
    window.print();
  });

  // Animaciones de entrada: añadir clases para animar elementos del hero
  const heroTitle = document.querySelector('.hero-title');
  const heroSub = document.querySelector('.hero-sub');
  const heroText = document.querySelector('.hero-text');
  if(heroTitle) heroTitle.classList.add('fade-in', 'delay-1');
  if(heroSub) heroSub.classList.add('fade-in', 'delay-2');
  if(heroText) heroText.classList.add('fade-in', 'delay-3');

  // Smooth scroll for nav links and active link highlighting
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if(target){
        // marcar active inmediatamente al hacer click
        navLinks.forEach(a=> a.classList.toggle('active', a === link));
        window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - 64, behavior:'smooth'});
      }
    });
  });
  // Mejor lógica para marcar el enlace activo según la posición de scroll
  (function(){
    const sections = Array.from(document.querySelectorAll('#home, main .section'))
      .filter(s => s && s.id);

    // devuelve el id de la sección que contiene el punto de referencia o la más cercana
    function getActiveSectionId(){
      const viewportRef = window.scrollY + window.innerHeight * 0.33; // punto 1/3 desde arriba
      let best = {id: null, distance: Infinity};
      for(const s of sections){
        const rect = s.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = rect.bottom + window.scrollY;
        if(viewportRef >= top && viewportRef <= bottom){
          return s.id; // contiene el punto
        }
        // si no contiene, medir distancia al centro del elemento
        const center = (top + bottom) / 2;
        const dist = Math.abs(center - viewportRef);
        if(dist < best.distance){ best = {id: s.id, distance: dist}; }
      }
      return best.id;
    }

    let ticking = false;
    function onScroll(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(()=>{
        const id = getActiveSectionId();
        if(id){
          navLinks.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    // inicializar estado al cargar
      onScroll();
      // Pausar animaciones en touch (mobile) y al mantener pulsado: añadir handlers para tracks
      const carouselRows = document.querySelectorAll('.carousel-row');
      carouselRows.forEach(row => {
        const track = row.querySelector('.carousel-track');
        if(!track) return;
        row.addEventListener('mouseenter', ()=> track.classList.add('paused'));
        row.addEventListener('mouseleave', ()=> track.classList.remove('paused'));
        // touch support: toggle pause on touchstart and remove on touchend
        row.addEventListener('touchstart', ()=> track.classList.add('paused'), {passive:true});
        row.addEventListener('touchend', ()=> track.classList.remove('paused'));
        // also stop propagation on pointerdown so clicks on slides don't resume automatically
        row.addEventListener('pointerdown', ()=> track.classList.add('paused'));
        row.addEventListener('pointerup', ()=> track.classList.remove('paused'));
      });

      // Runes / Habilidades: create floating runes and hover interactions
      const runesSection = document.querySelector('.runes-section');
      if (runesSection) {
        const floatingRunesSection = document.getElementById('floatingRunesSection');
        const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ'];
        if (floatingRunesSection) {
          // create more runes and vary sizes/durations for a denser, animated background
          const count = 26; // increase number for visibility
          for (let i = 0; i < count; i++) {
            const rune = document.createElement('div');
            rune.className = 'floating-rune';
            rune.textContent = runes[Math.floor(Math.random() * runes.length)];

            // random travel offsets (keep within reasonable viewport ranges)
            const tx = (Math.random() * 160 - 80).toFixed(2) + 'vw';
            const ty = (Math.random() * 120 - 60).toFixed(2) + 'vh';
            rune.style.setProperty('--tx', tx);
            rune.style.setProperty('--ty', ty);

            // initial position inside the section
            rune.style.left = `${Math.random() * 100}%`;
            rune.style.top = `${Math.random() * 100}%`;

            // staggered delay and varied durations
            const delay = (Math.random() * 12).toFixed(2) + 's';
            const dur = (Math.random() * 22 + 12).toFixed(2) + 's';
            rune.style.animationDelay = delay;
            rune.style.setProperty('--dur', dur);
            rune.style.animationDuration = dur;

            // size and slight opacity variance
            const size = (Math.random() * 2 + 1.2).toFixed(2) + 'rem';
            rune.style.fontSize = size;
            rune.style.opacity = '0'; // start invisible, css keyframes fade in

            floatingRunesSection.appendChild(rune);
          }
        }

        // Create subtle stars in the home nebula (only on #home)
        const homeNebula = document.querySelector('.home-nebula');
        if(homeNebula){
          // Increased star count for more visible and fuller background
          const starCount = 150;
          for(let i=0;i<starCount;i++){
            const s = document.createElement('span');
            s.className = 'star';
            // random position inside hero-inner (allow a bit of overflow top since nebula was lifted)
            s.style.left = `${Math.random()*100}%`;
            s.style.top = `${Math.random()*110 - 5}%`;
            
            // More varied sizes: small, medium, and large stars
            const rand = Math.random();
            let size;
            if(rand < 0.6) {
              // 60% small stars (1.5-3px)
              size = Math.random()*1.5 + 1.5;
            } else if(rand < 0.85) {
              // 25% medium stars (3-5px)
              size = Math.random()*2 + 3;
            } else {
              // 15% large stars (5-8px)
              size = Math.random()*3 + 5;
            }
            s.style.width = `${size}px`;
            s.style.height = `${size}px`;

            // random twinkle duration and delay (exposed as CSS vars so animation uses both)
            const dur = (Math.random()*6 + 4).toFixed(2);
            const delay = (Math.random()*8).toFixed(2);
            const glowDur = (Math.random()*3 + 1.4).toFixed(2);
            s.style.setProperty('--star-dur', dur + 's');
            s.style.setProperty('--star-delay', delay + 's');
            s.style.setProperty('--star-glow-dur', glowDur + 's');

            // start invisible; the CSS animation will make them appear/disappear
            s.style.opacity = '0';

            // slightly brighter initial opacity for larger stars
            if(size > 4.5) s.style.opacity = '0.85';

            homeNebula.appendChild(s);
          }
        }

        const runeSkills = runesSection.querySelectorAll('.rune-skill');
        runeSkills.forEach(skill => {
          skill.addEventListener('mouseenter', () => skill.classList.add('hover'));
          skill.addEventListener('mouseleave', () => skill.classList.remove('hover'));
        });
      }
  })();

  // Contact section: Create background stars dynamically
  (function initContactStars() {
    const backgroundStars = document.querySelector('.background-stars-contact');
    if (!backgroundStars) return;
    
    // Create 15 random stars
    for (let i = 0; i < 15; i++) {
      const star = document.createElement('div');
      star.className = 'star-contact';
      star.style.width = `${Math.random() * 2 + 1}px`;
      star.style.height = star.style.width;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.opacity = Math.random() * 0.5 + 0.3;
      backgroundStars.appendChild(star);
    }
  })();

  // Contact spheres: Add subtle movement on hover
  (function initContactSpheres() {
    const spheres = document.querySelectorAll('.contact-section .sphere');
    
    spheres.forEach((sphere, index) => {
      sphere.addEventListener('mouseenter', () => {
        const randomX = (Math.random() - 0.5) * 4;
        const randomY = (Math.random() - 0.5) * 4;
        sphere.style.transform = `translate(${randomX}px, ${randomY}px) scale(1.1)`;
      });
      
      sphere.addEventListener('mouseleave', () => {
        sphere.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  })();

  // Carrusel 3D con Drag y Flip Card
  (function initCarousel3D() {
    const container = document.querySelector('.carousel-3d-container');
    if (!container) return;

    const inner = container.querySelector('.carousel-3d-inner');
    const cards = container.querySelectorAll('.carousel-3d-card');

    let currentIndex = 0;
    const totalCards = cards.length;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = null;
    let dragThreshold = 30; // Reducido para mejor respuesta

    function updateCarousel(index) {
      currentIndex = ((index % totalCards) + totalCards) % totalCards;
      const rotation = currentIndex * -45;
      inner.style.transform = `rotateY(${rotation}deg)`;

      // Update active card
      cards.forEach((card, idx) => {
        card.classList.toggle('active', idx === currentIndex);
      });
    }

    function getPositionX(e) {
      return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function handleDragStart(e) {
      isDragging = true;
      startX = getPositionX(e);
      prevTranslate = currentTranslate;
      inner.classList.add('grabbing');
      inner.style.transition = 'none';
      
      if (animationID) {
        cancelAnimationFrame(animationID);
      }
    }

    function handleDragMove(e) {
      if (!isDragging) return;
      
      currentTranslate = getPositionX(e) - startX;
      
      // Aplicar rotación en tiempo real mientras arrastras
      const dragAmount = currentTranslate / 50; // Sensibilidad del drag
      const rotation = (currentIndex * -45) + (dragAmount * 45);
      inner.style.transform = `rotateY(${rotation}deg)`;
    }

    function handleDragEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      inner.classList.remove('grabbing');
      inner.style.transition = 'transform 0.6s ease-out';

      // Determinar dirección y distancia
      const dragDistance = currentTranslate;
      const dragDelta = dragDistance / 50;
      
      // Si se arrastra más de lo que el threshold, cambiar card
      if (Math.abs(dragDelta) > 0.3) {
        if (dragDistance > 0) {
          // Arrastró a la derecha
          updateCarousel(currentIndex - 1);
        } else {
          // Arrastró a la izquierda
          updateCarousel(currentIndex + 1);
        }
      } else {
        // Volver a la posición actual
        updateCarousel(currentIndex);
      }

      currentTranslate = 0;
      prevTranslate = 0;
    }

    // Event listeners para drag
    inner.addEventListener('mousedown', handleDragStart, false);
    inner.addEventListener('mousemove', handleDragMove, false);
    inner.addEventListener('mouseup', handleDragEnd, false);
    inner.addEventListener('mouseleave', handleDragEnd, false);

    inner.addEventListener('touchstart', handleDragStart, false);
    inner.addEventListener('touchmove', handleDragMove, false);
    inner.addEventListener('touchend', handleDragEnd, false);

    // Click en card para flip
    cards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        // Solo flip si no estamos arrastrando
        if (Math.abs(currentTranslate) < 5) {
          card.classList.toggle('flipped');
          e.stopPropagation();
        }
      });
    });

    // Initialize
    updateCarousel(0);
  })();

  // Animación de circuito para certificados
  (function initCircuitAnimation() {
    const circuitContainer = document.querySelector('.circuit-container');
    if (!circuitContainer) return;

    function createCircuit() {
      circuitContainer.innerHTML = '';
      
      // Add stars
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'circuit-star';
        star.style.width = `${Math.random() * 2 + 0.5}px`;
        star.style.height = star.style.width;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.5 + 0.3;
        circuitContainer.appendChild(star);
      }
      
      // Create lines
      const lines = [
        { x1: 0, y1: 30, x2: 100, y2: 30 },
        { x1: 0, y1: 70, x2: 100, y2: 70 },
        { x1: 20, y1: 10, x2: 80, y2: 90 },
        { x1: 80, y1: 10, x2: 20, y2: 90 },
        { x1: 0, y1: 50, x2: 50, y2: 50 },
        { x1: 50, y1: 50, x2: 100, y2: 50 },
        { x1: 30, y1: 20, x2: 70, y2: 20 },
        { x1: 30, y1: 80, x2: 70, y2: 80 },
        { x1: 10, y1: 10, x2: 10, y2: 90 },
        { x1: 90, y1: 10, x2: 90, y2: 90 }
      ];
      
      lines.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.className = 'circuit-line';
        
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        lineElement.style.width = `${length}%`;
        lineElement.style.left = `${line.x1}%`;
        lineElement.style.top = `${line.y1}%`;
        lineElement.style.transform = `rotate(${angle}deg)`;
        lineElement.style.animationDelay = `${Math.random() * 3}s`;
        
        circuitContainer.appendChild(lineElement);
      });
      
      // Create nodes
      const nodes = [
        { x: 50, y: 50 },
        { x: 30, y: 20 },
        { x: 70, y: 20 },
        { x: 30, y: 80 },
        { x: 70, y: 80 },
        { x: 10, y: 50 },
        { x: 90, y: 50 },
        { x: 20, y: 30 },
        { x: 80, y: 30 },
        { x: 20, y: 70 },
        { x: 80, y: 70 },
        { x: 50, y: 30 },
        { x: 50, y: 70 }
      ];
      
      nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'circuit-node';
        nodeElement.style.left = `${node.x}%`;
        nodeElement.style.top = `${node.y}%`;
        nodeElement.style.animationDelay = `${Math.random() * 2}s`;
        circuitContainer.appendChild(nodeElement);
      });
      
      // Create pulses
      for (let i = 0; i < 10; i++) {
        const pulse = document.createElement('div');
        pulse.className = 'circuit-pulse';
        pulse.style.left = `${Math.random() * 100}%`;
        pulse.style.top = `${Math.random() * 100}%`;
        pulse.style.animationDelay = `${Math.random() * 3}s`;
        circuitContainer.appendChild(pulse);
      }
      
      // Create circles
      for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'circuit-circle';
        circle.style.width = `${Math.random() * 200 + 100}px`;
        circle.style.height = circle.style.width;
        circle.style.left = `${Math.random() * 100 - 50}%`;
        circle.style.top = `${Math.random() * 100 - 50}%`;
        circle.style.animationDelay = `${Math.random() * 5}s`;
        circuitContainer.appendChild(circle);
      }
    }
    
    createCircuit();
    setInterval(createCircuit, 10000);
  })();

  // Modal para certificados
  (function initCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const closeBtn = document.querySelector('.modal-close');
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    if (!modal) return;
    
    certificateCards.forEach(card => {
      card.addEventListener('click', () => {
        // Aquí puedes agregar la imagen del certificado
        // Por ahora solo abrimos el modal
        modal.classList.add('active');
      });
    });
    
    closeBtn && closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  })();
});

// ======= MENU LATERAL MOVIL =======
const mobileBtn = document.getElementById("mobileMenuBtn");

if (mobileBtn) {

  // Crear menú si no existe
  if (!document.querySelector(".mobile-sidebar")) {
    const sidebar = document.createElement("div");
    sidebar.className = "mobile-sidebar";
    sidebar.innerHTML = `
      <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Cerrar menú">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <a href="#home">Home</a>
      <a href="#educacion">Formación</a>
      <a href="#proyectos">Proyectos</a>
      <a href="#habilidades">Habilidades</a>
      <a href="#certificados">Certificados</a>
      <a href="#contacto">Contactos</a>
      <a href="#" class="colors-open">Colores</a>
      <a href="#" class="style-open">Estilos</a>
    `;
    document.body.appendChild(sidebar);
  }

  const sidebar = document.querySelector(".mobile-sidebar");
  const closeBtn = document.getElementById("mobileMenuClose");

  // abrir menú
  mobileBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  // cerrar menú con la X
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // cerrar al tocar un link
  sidebar.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      sidebar.classList.remove("open");
    }
  });
}

// =============== FORMULARIO DE CONTACTO RÚNICO ===============
(function initRunicContactForm() {
  const API_BASE_URL = 'http://localhost:8001';
  
  const contactForm = document.getElementById('contactForm');
  const messageInput = document.getElementById('message');
  const charCounter = document.querySelector('.char-counter');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.querySelector('.spinner');
  const btnText = document.querySelector('.btn-text');
  const responseMessage = document.getElementById('responseMessage');

  if (!contactForm) return;

  // Contador de caracteres
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', function() {
      const currentLength = this.value.length;
      charCounter.textContent = `${currentLength}/2000 caracteres`;
      
      // Cambiar color si se acerca al límite
      if (currentLength > 1900) {
        charCounter.style.color = '#ff6b6b';
      } else {
        charCounter.style.color = '#9f6aff';
      }
    });
  }

  // Función para mostrar errores
  function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  // Función para limpiar errores
  function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
      error.classList.remove('show');
      error.textContent = '';
    });
  }

  // Función para mostrar mensaje de respuesta
  function showResponseMessage(message, type) {
    if (responseMessage) {
      responseMessage.textContent = message;
      responseMessage.className = `response-message ${type}`;
      responseMessage.style.display = 'block';
      
      // Auto-ocultar después de 5 segundos
      setTimeout(() => {
        responseMessage.style.display = 'none';
      }, 5000);
    }
  }

  // Validación del formulario
  function validateForm(formData) {
    const errors = {};

    if (!formData.username || formData.username.trim().length < 2) {
      errors.username = 'El nombre debe tener al menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    if (formData.message && formData.message.length > 2000) {
      errors.message = 'El mensaje no puede exceder 2000 caracteres';
    }

    return errors;
  }

  // Envío del formulario
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Limpiar errores previos
    clearErrors();
    
    // Obtener datos del formulario
    const formData = {
      username: document.getElementById('username').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    // Validar formulario
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(field => {
        showError(field, errors[field]);
      });
      return;
    }

    // Mostrar spinner y deshabilitar botón
    if (submitBtn && spinner && btnText) {
      submitBtn.disabled = true;
      spinner.style.display = 'block';
      btnText.style.opacity = '0.5';
    }

    try {
      console.log('🚀 Enviando mensaje al backend:', formData);
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('📋 Datos de respuesta JSON:', result);
      } else {
        const textResponse = await response.text();
        console.log('📋 Respuesta de texto:', textResponse);
        throw new Error(`El servidor devolvió una respuesta no válida: ${textResponse}`);
      }

      if (response.ok) {
        showResponseMessage('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
        contactForm.reset();
        if (charCounter) {
          charCounter.textContent = '0/2000 caracteres';
          charCounter.style.color = '#9f6aff';
        }
        console.log('✅ Mensaje enviado exitosamente');
      } else {
        console.log('❌ Error del servidor:', result);
        showResponseMessage(result.detail || 'Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
      }

    } catch (error) {
      console.error('💥 Error al enviar mensaje:', error);
      showResponseMessage(`Error de conexión: ${error.message}`, 'error');
    } finally {
      // Ocultar spinner y rehabilitar botón
      if (submitBtn && spinner && btnText) {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.style.opacity = '1';
      }
    }
  });
})();



