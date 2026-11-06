document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Particle Canvas Background
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const PARTICLE_COUNT = 70;
    const COLORS = ['rgba(99,102,241,', 'rgba(6,182,212,', 'rgba(244,63,94,'];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.6 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
          this.reset();
        }
      }
      draw() {
        const alpha = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.07;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrameId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        animateParticles();
      }
    });
  }


  /* ==========================================================================
     2. Header Scroll Effect
     ========================================================================== */
  const mainHeader = document.getElementById('main-header');
  if (mainHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }


  /* ==========================================================================
     3. Mobile Navigation
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav-link, .mobile-tab-btn') : [];

  function openMobileNav() {
    if (!hamburgerBtn || !mobileNav) return;
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!hamburgerBtn || !mobileNav) return;
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }


  /* ==========================================================================
     4. Multi-Service Tabs System (WAI-ARIA Pattern & Deep Linking)
     ========================================================================== */
  const tabTriggers = Array.from(document.querySelectorAll('.tab-trigger'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
  const navQuickPills = Array.from(document.querySelectorAll('.nav-service-pill'));
  const mobileTabBtns = Array.from(document.querySelectorAll('.mobile-tab-btn'));
  const floatingCtaText = document.getElementById('floating-cta-text');
  const floatingCtaIcon = document.getElementById('floating-cta-icon');
  const serviceSelect = document.getElementById('service-select');

  const TAB_SERVICE_MAP = {
    'english': {
      serviceVal: 'Clases de Inglés (Grupos de 4)',
      ctaText: 'Reservar mi plaza',
      ctaIcon: '🎓',
      cardTitle: 'Clases de Inglés en Grupo',
      cardDesc: 'Máximo 4 alumnos por clase',
      priceAmount: '79',
      pricePeriod: '/ mes',
      features: [
        '🔋 Clases online 100% prácticas',
        '💬 Foco principal en conversación y fluidez',
        '📝 Materiales incluidos y correcciones personalizadas',
        '🚫 Sin cuota de inscripción ni permanencia'
      ],
      urgency: '<strong>3 plazas</strong> disponibles para el grupo del próximo viernes'
    },
    'it-consulting': {
      serviceVal: 'Consultoría Amazon & IT',
      ctaText: 'Consultoría eCommerce & IT',
      ctaIcon: '📦',
      cardTitle: 'Consultoría IT & eCommerce Amazon',
      cardDesc: 'Operativa integral y arquitectura técnica en España, UE, México y EE.UU.',
      priceAmount: '490',
      pricePeriod: '/ auditoría',
      features: [
        '📦 Arquitectura de catálogo y resolución de errores 5665 / 8572',
        '🚚 Logística FBA transfronteriza (Send to Amazon)',
        '🛡️ Brand Registry, Contenido A+ y Store de marca',
        '🔌 Integración técnica SP-API, ERPs y automatizaciones IT'
      ],
      urgency: '<strong>Disponibilidad limitada:</strong> Máximo 3 marcas o auditorías simultáneas'
    },
    'online-consulting': {
      serviceVal: 'Consultoría Online 1 a 1',
      ctaText: 'Agendar Sesión 1 a 1',
      ctaIcon: '🌐',
      cardTitle: 'Consultoría Online 1 a 1: Seller Central',
      cardDesc: 'Sesión en directo compartiendo pantalla paso a paso',
      priceAmount: '75',
      pricePeriod: '/ sesión',
      features: [
        '🎯 Pantalla compartida en vivo en tu Amazon Seller Central',
        '📋 Creación de listings manual o subida de flat files',
        '📹 Grabación completa en HD + checklist de ejecución',
        '💬 7 días de soporte para dudas tras la sesión'
      ],
      urgency: '<strong>Reserva flexible:</strong> Horarios disponibles esta semana para sesión en directo'
    },
    'freelance': {
      serviceVal: 'Gestión Freelance Amazon',
      ctaText: 'Iniciar Proyecto Amazon',
      ctaIcon: '🚀',
      cardTitle: 'Gestión Freelance de Catálogo & SP-API',
      cardDesc: 'Ejecución técnica de listings, A+ y desarrollo a medida',
      priceAmount: '290',
      pricePeriod: '/ proyecto',
      features: [
        '📋 Subida masiva de listings vía flat file con variaciones',
        '✍️ Copywriting bilingüe con SEO (España, México, EE.UU.)',
        '🎨 Diseño de Contenido A+ y Amazon Brand Store',
        '🔌 Desarrollo de conectores a medida con Amazon SP-API'
      ],
      urgency: '<strong>Presupuesto sin compromiso:</strong> Respuesta en menos de 24 horas'
    }
  };

  function switchTab(tabId, updateUrl = true) {
    if (!TAB_SERVICE_MAP[tabId]) tabId = 'english';

    // 1. Update WAI-ARIA states on tab buttons
    tabTriggers.forEach(tab => {
      const isTarget = tab.getAttribute('data-tab') === tabId;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      tab.setAttribute('tabindex', isTarget ? '0' : '-1');
    });

    // 2. Update Tab Panels
    tabPanels.forEach(panel => {
      const isTarget = panel.id === `panel-${tabId}`;
      if (isTarget) {
        panel.classList.remove('hidden');
        panel.removeAttribute('hidden');
        panel.classList.add('active');
      } else {
        panel.classList.add('hidden');
        panel.setAttribute('hidden', '');
        panel.classList.remove('active');
      }
    });

    // 3. Update Nav Quick Pills & Mobile Buttons
    navQuickPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-tab-target') === tabId);
    });
    mobileTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab-target') === tabId);
    });

    // 4. Update Floating CTA
    const info = TAB_SERVICE_MAP[tabId];
    if (floatingCtaText && floatingCtaIcon && info) {
      floatingCtaText.textContent = info.ctaText;
      floatingCtaIcon.textContent = info.ctaIcon;
    }

    // 5. Update Contact Form defaults if appropriate
    if (serviceSelect && info) {
      syncServiceFormFields(info.serviceVal);
    }

    // 6. Update URL hash cleanly
    if (updateUrl && history.replaceState) {
      history.replaceState(null, null, `#${tabId}`);
    }

    // 7. Trigger scroll reveal check & stat counters on the newly shown panel
    triggerScrollRevealsInPanel(`panel-${tabId}`);
  }

  // Keyboard navigation for tablist (WAI-ARIA pattern)
  const tabList = document.querySelector('[role="tablist"]');
  if (tabList) {
    tabList.addEventListener('keydown', (e) => {
      const activeElement = document.activeElement;
      if (!tabTriggers.includes(activeElement)) return;

      const currentIndex = tabTriggers.indexOf(activeElement);
      let newIndex = null;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabTriggers.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabTriggers.length) % tabTriggers.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabTriggers.length - 1;
      }

      if (newIndex !== null) {
        e.preventDefault();
        const targetTab = tabTriggers[newIndex];
        targetTab.focus();
        const tabId = targetTab.getAttribute('data-tab');
        switchTab(tabId);
      }
    });
  }

  // Click handlers on tab triggers
  tabTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Click handlers on header & mobile pills
  document.querySelectorAll('[data-tab-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = el.getAttribute('data-tab-target');
      switchTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Handle URL hash on load or on hashchange
  function handleUrlHash() {
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    if (!rawHash) {
      switchTab('english', false);
      return;
    }

    if (rawHash === 'it-consulting' || rawHash === 'consultoria-it' || rawHash === 'servicios-it') {
      switchTab('it-consulting', false);
    } else if (rawHash === 'online-consulting' || rawHash === 'consultoria-online' || rawHash === 'tematicas-online') {
      switchTab('online-consulting', false);
    } else if (rawHash === 'freelance' || rawHash === 'freelancing' || rawHash === 'capacidades-freelance') {
      switchTab('freelance', false);
    } else if (rawHash === 'english' || rawHash === 'beneficios' || rawHash === 'testimonios' || rawHash === 'sobre-mi' || rawHash === 'clases-online') {
      switchTab('english', false);
    } else if (rawHash === 'terminos' || rawHash === 'disclaimer' || rawHash === 'privacidad' || rawHash === 'reembolso' || rawHash === 'contratos') {
      openLegalDialog(rawHash);
    }
  }
  handleUrlHash();
  window.addEventListener('hashchange', handleUrlHash);


  /* ==========================================================================
     5. Context-Sensitive Contact Scrolling & Navigation
     ========================================================================== */
  document.querySelectorAll('a[href="#contacto"], .floating-cta').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const activePanel = document.querySelector('.tab-panel.active') || document.getElementById('panel-english');
      const contactSection = activePanel ? activePanel.querySelector('.contact-section') : null;
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ==========================================================================
     6. Dynamic Next Batch (Closest Future Friday) & Countdown Timer
     ========================================================================== */
  function getNextClosestFriday() {
    const now = new Date();
    const target = new Date(now);

    // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
    const currentDay = now.getDay();
    let daysUntilFriday = (5 - currentDay + 7) % 7;

    // Target start time: Friday at 18:00:00 (6:00 PM) local time
    target.setDate(now.getDate() + daysUntilFriday);
    target.setHours(18, 0, 0, 0);

    // If today is Friday and 18:00 has already passed, roll over to the next Friday (+7 days)
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 7);
    }

    return target;
  }

  let targetDate = getNextClosestFriday();

  function formatSpanishDate(date) {
    const monthsEs = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `Viernes, ${date.getDate()} de ${monthsEs[date.getMonth()]} de ${date.getFullYear()}`;
  }

  function formatShortDate(date) {
    const monthsShort = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return `Viernes, ${date.getDate()} ${monthsShort[date.getMonth()]}`;
  }

  function updateDynamicBatchDates() {
    targetDate = getNextClosestFriday();
    const fullDateStr = formatSpanishDate(targetDate);
    const shortDateStr = formatShortDate(targetDate);

    const heroBadge = document.getElementById('hero-batch-badge');
    if (heroBadge) {
      heroBadge.textContent = `📅 Próximo grupo: ${shortDateStr}`;
    }

    const courseStartDate = document.getElementById('course-start-date');
    if (courseStartDate) {
      courseStartDate.textContent = fullDateStr;
    }

    if (TAB_SERVICE_MAP && TAB_SERVICE_MAP['english']) {
      TAB_SERVICE_MAP['english'].urgency = `<strong>3 plazas</strong> disponibles para el grupo del ${shortDateStr}`;
      const contactUrgencyText = document.getElementById('contact-urgency-text');
      const serviceSelect = document.getElementById('service-select');
      if (contactUrgencyText && serviceSelect && serviceSelect.value.includes('Inglés')) {
        contactUrgencyText.innerHTML = TAB_SERVICE_MAP['english'].urgency;
      }
    }
  }

  updateDynamicBatchDates();

  function updateCountdown() {
    const cdDays = document.getElementById('cd-days');
    if (!cdDays) return;

    const now = new Date();
    let diff = targetDate - now;

    // When the countdown reaches 0 or less, recalculate to the next Friday
    if (diff <= 0) {
      updateDynamicBatchDates();
      diff = targetDate - now;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    function pad(n) { return String(n).padStart(2, '0'); }

    document.getElementById('cd-days').textContent    = pad(days);
    document.getElementById('cd-hours').textContent   = pad(hours);
    document.getElementById('cd-minutes').textContent = pad(minutes);
    document.getElementById('cd-seconds').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ==========================================================================
     7. Animated Number Counters (All Stats Sections)
     ========================================================================== */
  function animateCounter(el) {
    if (!el) return;
    const target = parseFloat(el.getAttribute('data-target'));
    if (isNaN(target)) return;
    if (target === 0) {
      el.textContent = '0';
      return;
    }
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const duration = 1200;
    const step = 25;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        el.textContent = target >= 1000 ? (target === 10000 ? '10K' : target.toLocaleString('es-ES')) : target;
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px 0px', threshold: 0.01 });

    statNums.forEach(el => statsObserver.observe(el));
  } else {
    statNums.forEach(el => animateCounter(el));
  }

  // Animate counters immediately in current active panel
  setTimeout(() => {
    document.querySelectorAll('.tab-panel.active .stat-num[data-target]').forEach(el => {
      animateCounter(el);
    });
  }, 100);


  /* ==========================================================================
     8. Scroll Reveal Setup
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => el.classList.add('active'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px 0px', threshold: 0.01 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  function triggerScrollRevealsInPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    panel.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('active');
    });

    panel.querySelectorAll('.stat-num[data-target]').forEach(el => {
      animateCounter(el);
    });

    const contact = document.getElementById('contacto');
    if (contact) contact.classList.add('active');
  }


  /* ==========================================================================
     9. Form Validation & Submission (Web3Forms + LocalStorage Dashboard)
     ========================================================================== */
  const allLeadForms = document.querySelectorAll('.lead-form');

  allLeadForms.forEach(form => {
    const formContainer = form.closest('.form-container');
    const formSuccess = formContainer ? formContainer.querySelector('.form-success') : null;
    const submitBtn = form.querySelector('button[type="submit"]');
    const resetFormBtn = formSuccess ? formSuccess.querySelector('.reset-form-btn') : null;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');

    const fields = {
      name: {
        input: nameInput,
        error: nameInput ? nameInput.closest('.form-group')?.querySelector('.error-msg') : null,
        validate() {
          if (!this.input || !this.input.value.trim()) {
            this.showError('El nombre es obligatorio.');
            return false;
          }
          this.clearError();
          return true;
        }
      },
      email: {
        input: emailInput,
        error: emailInput ? emailInput.closest('.form-group')?.querySelector('.error-msg') : null,
        validate() {
          if (!this.input) return true;
          const value = this.input.value.trim();
          if (!value) {
            this.showError('El correo electrónico es obligatorio.');
            return false;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            this.showError('Introduce un correo electrónico válido (ej. nombre@correo.com).');
            return false;
          }
          this.clearError();
          return true;
        }
      },
      phone: {
        input: phoneInput,
        error: phoneInput ? phoneInput.closest('.form-group')?.querySelector('.error-msg') : null,
        validate() {
          if (!this.input) return true;
          const value = this.input.value.trim();
          if (!value) {
            this.showError('El número de teléfono o WhatsApp es obligatorio.');
            return false;
          }
          const digits = value.replace(/\D/g, '');
          if (digits.length < 8) {
            this.showError('Introduce un número válido con prefijo (mínimo 8 dígitos).');
            return false;
          }
          this.clearError();
          return true;
        }
      }
    };

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (!field.input) return;

      field.showError = (msg) => {
        if (field.error) {
          field.error.textContent = msg;
          field.error.classList.add('visible');
        }
        field.input.closest('.form-group')?.classList.add('has-error');
        field.input.setAttribute('aria-invalid', 'true');
      };

      field.clearError = () => {
        if (field.error) {
          field.error.textContent = '';
          field.error.classList.remove('visible');
        }
        field.input.closest('.form-group')?.classList.remove('has-error');
        field.input.removeAttribute('aria-invalid');
      };

      field.input.addEventListener('blur', () => { field.validate(); });
      field.input.addEventListener('input', () => {
        if (field.input.value.trim() !== '') field.clearError();
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const honeypot = form.querySelector('input[name="website_url"]')?.value;
      if (honeypot) { showSuccessView(); return; }

      let isValid = true;
      Object.keys(fields).forEach(key => {
        if (fields[key] && !fields[key].validate()) isValid = false;
      });

      if (!isValid) {
        const firstInvalid = Object.keys(fields).find(key => fields[key] && !fields[key].validate());
        if (firstInvalid && fields[firstInvalid].input) fields[firstInvalid].input.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text')?.classList.add('hidden');
        submitBtn.querySelector('.spinner')?.classList.remove('hidden');
      }

      const serviceVal = form.querySelector('input[name="service"]')?.value || 'Servicio';
      const levelVal = form.querySelector('input[name="level"]:checked')?.value;
      const detailsVal = form.querySelector('textarea')?.value || form.querySelector('select')?.value || '';
      const detailStr = levelVal || detailsVal || 'Sin detalles adicionales';

      const newLead = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
        service: serviceVal,
        name: fields.name.input ? fields.name.input.value.trim() : '',
        email: fields.email.input ? fields.email.input.value.trim() : '',
        phone: fields.phone.input ? fields.phone.input.value.trim() : '',
        detail: detailStr
      };

      // Save lead locally to admin dashboard
      saveLead(newLead);

      // Send to Web3Forms API
      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        showSuccessView();
      } catch (error) {
        console.error('Error submitting form:', error);
        showSuccessView();
      }
    });

    resetFormBtn?.addEventListener('click', () => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text')?.classList.remove('hidden');
        submitBtn.querySelector('.spinner')?.classList.add('hidden');
      }
      Object.keys(fields).forEach(key => fields[key]?.clearError());
      formSuccess?.classList.add('hidden');
      form.classList.remove('hidden');
    });

    function showSuccessView() {
      form.classList.add('hidden');
      formSuccess?.classList.remove('hidden');
    }
  });

  function saveLead(newLead) {
    const currentLeads = JSON.parse(localStorage.getItem('aish_multi_leads')) || [];
    currentLeads.push(newLead);
    localStorage.setItem('aish_multi_leads', JSON.stringify(currentLeads));
    updateAdminTable();
  }


  /* ==========================================================================
     10. Admin Leads Dashboard (Supports All Services)
     ========================================================================== */
  const adminDialog        = document.getElementById('admin-dialog');
  const secretAdminTrigger = document.getElementById('secret-admin-trigger');
  const closeAdmin         = document.getElementById('close-admin');
  const exportBtn          = document.getElementById('export-leads');
  const clearBtn           = document.getElementById('clear-leads');
  const leadsTbody         = document.getElementById('leads-tbody');
  const totalLeadsCount    = document.getElementById('total-leads-count');

  let clickCount = 0;
  let clickTimer = null;

  if (secretAdminTrigger) {
    secretAdminTrigger.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 5) {
        promptAdminAccess();
        clickCount = 0;
      }
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 1500);
    });
  }

  function promptAdminAccess() {
    const password = prompt('Introduce la contraseña para acceder al panel de administración:');
    if (password === 'aish2026') {
      updateAdminTable();
      adminDialog?.showModal();
    } else if (password !== null) {
      alert('Contraseña incorrecta. Acceso denegado.');
    }
  }

  if (window.location.hash === '#admin') {
    promptAdminAccess();
    history.replaceState(null, null, window.location.pathname);
  }

  closeAdmin?.addEventListener('click', () => { adminDialog?.close(); });

  adminDialog?.addEventListener('click', (e) => {
    const d = adminDialog.getBoundingClientRect();
    if (e.clientX < d.left || e.clientX > d.right || e.clientY < d.top || e.clientY > d.bottom) {
      adminDialog.close();
    }
  });

  function updateAdminTable() {
    if (!leadsTbody || !totalLeadsCount) return;

    // Backward-compat check with old key
    let leads = JSON.parse(localStorage.getItem('aish_multi_leads'));
    if (!leads) {
      const oldLeads = JSON.parse(localStorage.getItem('aish_english_leads')) || [];
      leads = oldLeads.map(l => ({
        id: l.id,
        timestamp: l.timestamp,
        service: 'Clases de Inglés (Grupos de 4)',
        name: l.name,
        email: l.email,
        phone: l.phone,
        detail: l.level || l.student_type || 'N/A'
      }));
      localStorage.setItem('aish_multi_leads', JSON.stringify(leads));
    }

    totalLeadsCount.textContent = leads.length;

    if (leads.length === 0) {
      leadsTbody.innerHTML = `<tr><td colspan="7" class="text-center empty-state">No hay leads registrados aún.</td></tr>`;
      return;
    }

    const sortedLeads = [...leads].sort((a, b) => b.id - a.id);

    leadsTbody.innerHTML = sortedLeads.map(lead => {
      const escapedDetail = lead.detail ? escapeHTML(lead.detail) : '<span style="color:var(--text-muted)">—</span>';
      return `
        <tr data-id="${lead.id}">
          <td>${escapeHTML(lead.timestamp)}</td>
          <td><span class="badge badge-accent">${escapeHTML(lead.service || 'Clases de Inglés')}</span></td>
          <td><strong>${escapeHTML(lead.name)}</strong></td>
          <td><a href="mailto:${encodeURIComponent(lead.email)}" style="color:var(--primary-color)">${escapeHTML(lead.email)}</a></td>
          <td><a href="tel:${encodeURIComponent(lead.phone)}" style="color:var(--accent-secondary)">${escapeHTML(lead.phone)}</a></td>
          <td title="${escapedDetail}">${escapedDetail}</td>
          <td>
            <button class="btn btn-outline btn-sm delete-single-lead danger-text" data-id="${lead.id}">Eliminar</button>
          </td>
        </tr>
      `;
    }).join('');

    leadsTbody.querySelectorAll('.delete-single-lead').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const leadId = parseInt(e.target.getAttribute('data-id'));
        if (confirm('¿Estás seguro de que deseas eliminar este lead?')) {
          deleteLead(leadId);
        }
      });
    });
  }

  function deleteLead(id) {
    let leads = JSON.parse(localStorage.getItem('aish_multi_leads')) || [];
    leads = leads.filter(l => l.id !== id);
    localStorage.setItem('aish_multi_leads', JSON.stringify(leads));
    updateAdminTable();
  }

  clearBtn?.addEventListener('click', () => {
    const leads = JSON.parse(localStorage.getItem('aish_multi_leads')) || [];
    if (leads.length === 0) { alert('No hay leads para eliminar.'); return; }
    if (confirm('¡ATENCIÓN! Esto eliminará de forma permanente TODOS los leads guardados. ¿Deseas continuar?')) {
      localStorage.removeItem('aish_multi_leads');
      updateAdminTable();
    }
  });

  exportBtn?.addEventListener('click', () => {
    const leads = JSON.parse(localStorage.getItem('aish_multi_leads')) || [];
    if (leads.length === 0) { alert('No hay leads registrados para exportar.'); return; }

    const csvHeaders = "Fecha de Registro,Servicio Solicitado,Nombre Completo,Email,Telefono,Nivel o Detalle del Proyecto\n";
    const csvRows = leads.map(l => [
      l.timestamp, l.service || 'Clases de Inglés', l.name, l.email, l.phone,
      l.detail ? l.detail.replace(/\r?\n|\r/g, " ").replace(/"/g, '""') : ""
    ].map(val => `"${val}"`).join(",")).join("\n");

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_englishwithaish_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }


  /* ==========================================================================
     11. Legal Documents Dialog (In-Page Reader)
     ========================================================================== */
  const legalDialog = document.getElementById('legal-dialog');
  const legalModalBody = document.getElementById('legal-modal-body');
  const closeLegalDialog = document.getElementById('close-legal-dialog');
  const legalTabBtns = Array.from(document.querySelectorAll('.legal-tab-btn'));

  const LEGAL_DOCS = {
    terminos: `
      <h2>📜 Términos y Condiciones Generales de Contratación</h2>
      <p style="font-size:0.8125rem; color:var(--text-muted); margin-bottom:1rem;">Conforme a la Ley 34/2002 (LSSI-CE) y Real Decreto Legislativo 1/2007 (TRLGDCU) | Última revisión: Noviembre de 2026</p>
      
      <div class="legal-highlight-box">
        <p>El presente documento regula la contratación de servicios profesionales entre <strong>Aishwarya Gupta Khera</strong> (en adelante, el "Prestador" o "englishwithaish.online"), con actividad profesional y residencia legal en Bilbao (España) y correo oficial <strong>aishwarya.gupta.khera@gmail.com</strong>, y el Cliente o Alumno.</p>
      </div>

      <h3>1. Capacidad Jurídica y Aceptación</h3>
      <p>La contratación de cualquiera de los servicios a través de este portal exige que el Cliente sea mayor de 18 años o cuente con autorización formal y fehaciente de sus progenitores o tutores legales. La formalización del pedido o pago implica la aceptación íntegra de estas cláusulas con plena validez jurídica electrónica según el Art. 23 de la LSSI-CE.</p>

      <h3>2. Modalidades de Servicios</h3>
      <ul>
        <li><strong>Clases de Inglés Online (B2C):</strong> Impartidas por videoconferencia en directo en grupos súper reducidos de <strong>máximo 4 alumnos</strong> para maximizar el speaking. Inicio dinámico en el viernes futuro más cercano. Materiales pedagógicos digitales incluidos sin cuota de matrícula.</li>
        <li><strong>Consultoría IT &amp; eCommerce para Amazon Marketplaces (B2B):</strong> Auditoría técnica, arquitectura de catálogo y asesoramiento operativo integral para vendedores y marcas en Amazon (España, Unión Europea, México y EE.UU.). Incluye cómo listar productos, creación y saneamiento de catálogo mediante plantillas masivas (flat files), resolución de errores técnicos (5665, 8572, 5461), logística FBA transfronteriza (Send to Amazon), optimización de estrategias de visibilidad y posicionamiento orgánico, Brand Registry, Contenido A+ e integración técnica de sistemas IT / ERP a través de la Selling Partner API (SP-API).</li>
        <li><strong>Consultoría Online 1 a 1 (Seller Central en Directo):</strong> Sesiones privadas por videollamada compartiendo pantalla directamente sobre la cuenta de Amazon Seller Central del Cliente para resolución en vivo de incidencias de listing, validación de atributos obligatorios y preparación de envíos FBA.</li>
        <li><strong>Gestión Freelance de Catálogo &amp; SP-API:</strong> Ejecución técnica delegada: creación de matrices de variación parent-child, copywriting y SEO de listings bilingüe (español de España/México e inglés de EE.UU.), diseño de Brand Store y programación de microservicios con la Amazon SP-API.</li>
      </ul>

      <h3>3. Precios, Facturación y Medios de Pago</h3>
      <ul>
        <li>Precios fijados en Euros (€) con impuestos aplicables según la normativa vigente en España (Ley 37/1992 del IVA).</li>
        <li><strong>Clases de inglés:</strong> Tarifa plana mensual de 79€/mes (o pactada para clases privadas) abonada antes del día 1 del mes lectivo. <strong>Sin permanencia</strong>.</li>
        <li><strong>Consultorías IT y 1 a 1:</strong> Pago íntegro al confirmar la reserva de fecha y hora.</li>
        <li><strong>Desarrollo Freelance:</strong> 50% de anticipo inicial como reserva de sprint y 50% a la entrega y validación en staging o pase a producción.</li>
        <li>Pagos procesados mediante plataformas seguras certificadas PCI-DSS y PSD2: tarjeta vía pasarelas oficiales autorizadas (<strong>Razorpay</strong> / <strong>Stripe</strong>), transferencia bancaria, Bizum o PayPal.</li>
      </ul>

      <h3>4. Propiedad Intelectual y Cesión de Derechos</h3>
      <ul>
        <li><strong>Material Didáctico:</strong> Propiedad exclusiva de Aishwarya, concediéndose únicamente licencia personal para uso educativo privado del alumno.</li>
        <li><strong>Software Freelance:</strong> Condicionado al pago íntegro del 100% de la factura del proyecto, el Prestador cede al Cliente en exclusiva y con alcance mundial todos los derechos de explotación patrimonial sobre el código fuente a medida desarrollado.</li>
      </ul>

      <h3>5. Jurisdicción y Ley Aplicable</h3>
      <p>Este contrato se rige por la legislación española. Para litigios entre profesionales (B2B), las partes se someten a los Juzgados de Bilbao (España). En caso de consumidores finales (B2C), rige el fuero legal del domicilio del consumidor.</p>
    `,
    disclaimer: `
      <h2>⚖️ Aviso Legal y Exención de Responsabilidad (Disclaimer)</h2>
      <div class="legal-highlight-box">
        <p><strong>Información General Obligatoria (Art. 10 Ley 34/2002 - LSSI-CE):</strong><br>
        • Titular: Aishwarya Gupta Khera<br>
        • Actividad: Formación Lingüística no reglada, Consultoría IT & Desarrollo de Software<br>
        • Sede: Bilbao, España<br>
        • Email: <a href="mailto:aishwarya.gupta.khera@gmail.com" style="color:var(--primary-color); font-weight:700;">aishwarya.gupta.khera@gmail.com</a><br>
        • Dominio Web: englishwithaish.online
        </p>
      </div>

      <h3>1. Condiciones de Uso y Navegación</h3>
      <p>El acceso a este portal web confiere la condición de Usuario e impone la obligación de hacer un uso lícito del mismo, prohibiéndose la introducción de malware, inyecciones SQL/XSS, scraping no consentido o ataques de denegación de servicio.</p>

      <h3>2. Exención de Responsabilidad sobre Progreso Lingüístico</h3>
      <p>El ritmo de aprendizaje y adquisición de fluidez en una segunda lengua dependen de variables individuales ajenas al control exclusivo de la docente (dedicación horaria fuera de clase, asistencia constante, nivel inicial y práctica activa). Los testimonios representan vivencias de alumnos reales y no constituyen una promesa matemática de resultados idénticos sin la dedicación individual requerida.</p>

      <h3>3. Exención de Responsabilidad en Consultoría IT y Amazon Marketplaces</h3>
      <p>Las auditorías técnicas, informes de catálogo, optimizaciones SEO y recomendaciones de operativa en Amazon (España, UE, México y EE.UU.) se formulan siguiendo las mejores prácticas y guías oficiales de Seller Central. Sin embargo, el Prestador no tiene vinculación societaria con Amazon Services LLC ni con aduanas gubernamentales. La aprobación definitiva de marcas, reactivación de ASINs suprimidos, asignación de la Buy Box, variaciones de comisiones o decisiones discrecionales del algoritmo y soporte de Amazon competen exclusivamente a Amazon. El Prestador no responderá de lucro cesante, bloqueos de cuenta por causas imputables al vendedor o costes arancelarios en destino.</p>

      <h3>4. Garantía de Software Freelance, Integraciones SP-API y Terceros</h3>
      <p>El código desarrollado (conectores SP-API, scripts o plataformas web) se entrega verificado y cuenta con <strong>30 días naturales de garantía</strong> para solventar fallos atribuibles a la programación. Quedan excluidas incidencias derivadas de caídas de proveedores externos (AWS, servidores de Amazon SP-API, pasarelas de pago) o roturas de retrocompatibilidad en APIs ajenas.</p>
    `,
    privacidad: `
      <h2>🔒 Política de Privacidad y Protección de Datos Personales</h2>
      <p style="font-size:0.8125rem; color:var(--text-muted); margin-bottom:1rem;">Conforme al Reglamento (UE) 2016/679 (RGPD) y Ley Orgánica 3/2018 (LOPDGDD)</p>
      
      <div class="legal-highlight-box">
        <p><strong>Responsable del Tratamiento:</strong> Aishwarya Gupta Khera<br>
        <strong>Email de Contacto y Privacidad:</strong> <a href="mailto:aishwarya.gupta.khera@gmail.com" style="color:var(--primary-color); font-weight:700;">aishwarya.gupta.khera@gmail.com</a><br>
        <strong>Ubicación:</strong> Bilbao, España</p>
      </div>

      <h3>1. Finalidades y Bases Jurídicas del Tratamiento</h3>
      <ul>
        <li><strong>Atención de Consultas:</strong> Tratamiento de nombre, email, teléfono/WhatsApp y consulta para atender solicitudes de información (<strong>Art. 6.1.a RGPD</strong>: Consentimiento expreso).</li>
        <li><strong>Gestión de Clases y Servicios:</strong> Organización de grupos, asistencia, evaluación pedagógica y ejecución de consultorías o proyectos de desarrollo (<strong>Art. 6.1.b RGPD</strong>: Ejecución contractual).</li>
        <li><strong>Facturación y Gestión Fiscal:</strong> Emisión de facturas y cumplimiento de obligaciones contables ante la Agencia Tributaria (<strong>Art. 6.1.c RGPD</strong>: Obligación legal).</li>
      </ul>

      <h3>2. Tratamiento de Datos de Menores</h3>
      <p>Para alumnos menores de 14 años, la inscripción y el consentimiento del tratamiento de datos deben formalizarse expresamente por sus progenitores o tutores legales conforme al Art. 7 de la LOPDGDD.</p>

      <h3>3. Conservación y Encargados del Tratamiento</h3>
      <p>Los datos se conservan durante la vigencia de la relación contractual y, tras ella, durante los plazos legalmente exigibles (mínimo 5 años para efectos mercantiles y tributarios). Los datos no se ceden a terceros para fines comerciales. Se utilizan encargados de tratamiento bajo garantías europeas (Web3Forms para formularios, Google Workspace/Meet para videoconferencias y pasarelas de pago seguras PCI-DSS Nivel 1 como Razorpay y Stripe).</p>

      <h3>4. Derechos ARCO-POL del Usuario</h3>
      <p>Puedes ejercitar de forma gratuita tus derechos de Acceso, Rectificación, Supresión ("olvido"), Limitación, Portabilidad y Oposición enviando un correo electrónico acreditando tu identidad a:</p>
      <p style="font-size:1.05rem; font-weight:700; color:var(--primary-color);">✉️ aishwarya.gupta.khera@gmail.com</p>
      <p>Asimismo, tienes derecho a reclamar ante la Agencia Española de Protección de Datos (AEPD - <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style="color:var(--accent-secondary);">www.aepd.es</a>).</p>
    `,
    reembolso: `
      <h2>🔄 Política de Cancelación, Desistimiento y Reembolso</h2>
      <p style="font-size:0.8125rem; color:var(--text-muted); margin-bottom:1rem;">Conforme a los Arts. 102 a 108 del Real Decreto Legislativo 1/2007 (TRLGDCU)</p>

      <div class="legal-highlight-box">
        <p>Garantizamos un marco de cancelaciones transparente que protege tanto los derechos legales del consumidor como la viabilidad organizativa de las reservas de plazas de 4 alumnos y bloqueos de agenda profesional.</p>
      </div>

      <h3>1. Clases de Inglés Online (Grupos de 4 Alumnos)</h3>
      <ul>
        <li><strong>Sin Compromiso de Permanencia:</strong> Puedes cancelar tu suscripción mensual en cualquier momento notificándolo antes del <strong>día 1 del mes natural siguiente</strong>. La baja no conlleva recargos ni penalizaciones.</li>
        <li><strong>Derecho Legal de Desistimiento de 14 Días:</strong> Tienes derecho a desistir del contrato en el plazo de 14 días naturales desde el pago si las clases no se han iniciado (reembolso del 100%). Si solicitaste comenzar de forma inmediata y ya asististe a clases, se devolverá la parte proporcional no devengada.</li>
        <li><strong>Faltas de Asistencia Individuales:</strong> Al ser plazas estrictamente limitadas a 4 personas, las faltas individuales de asistencia del alumno no son reembolsables ni acumulables, facilitándose los materiales y resúmenes de la sesión.</li>
        <li><strong>Suspensión por la Docente:</strong> Si una clase debiera suspenderse por causa de fuerza mayor de la profesora, se reprogramará de mutuo acuerdo o se compensará económicamente en la siguiente mensualidad.</li>
      </ul>

      <h3>2. Consultoría Amazon &amp; IT y Sesiones Online 1 a 1</h3>
      <ul>
        <li><strong>Aviso Previo > 24 Horas:</strong> Reembolso del 100% del importe pagado o reprogramación sin coste.</li>
        <li><strong>Aviso < 24 Horas o Incomparecencia (No-show):</strong> Sesión devengada sin derecho a reembolso por reserva de agenda profesional y trabajo previo de preparación de catálogo.</li>
      </ul>

      <h3>3. Proyectos Freelance de Catálogo y SP-API</h3>
      <ul>
        <li><strong>Anticipo del 50%:</strong> No reembolsable una vez iniciada la redacción SEO, maquetación de plantillas flat files o desarrollo de conectores SP-API, cubriendo los costes de provisión técnica.</li>
        <li><strong>Aceptación de Entregas:</strong> Cada carga masiva de listings validada en Seller Central o hito de software se considera definitivo. En caso de resolución anticipada unilateral por el Cliente, se liquidarán exclusivamente los listings o módulos desarrollados hasta la fecha.</li>
      </ul>

      <h3>4. Plazo y Canal de Devolución</h3>
      <p>Las solicitudes deben enviarse a <strong>aishwarya.gupta.khera@gmail.com</strong>. Los reembolsos aprobados se ordenarán en un plazo de <strong>5 a 10 días laborables</strong> a través del mismo medio de pago original.</p>
    `,
    contratos: `
      <h2>📑 Contratos y Acuerdos de Servicio Estándar</h2>
      <p style="margin-bottom:1rem;">Condiciones marco de los contratos formalizados en englishwithaish.online:</p>

      <div class="contract-template-box">
        <div class="contract-template-title">📘 Modelo 1: Contrato de Formación Lingüística Online</div>
        <p><strong>Objeto:</strong> Clases semanales de conversación y fluidez en directo en grupos de máximo 4 alumnos con inicio dinámico en el viernes más próximo.</p>
        <p><strong>Cuota:</strong> 79€ mensuales sin permanencia, pagaderos por anticipado antes del día 1 de cada mes.</p>
        <p><strong>Compromiso:</strong> Conexión puntual con cámara y audio habilitados. Prohibición taxativa de grabación o difusión no autorizada de las sesiones grupales por respeto a la privacidad del resto de alumnos.</p>
      </div>

      <div class="contract-template-box">
        <div class="contract-template-title">📦 Modelo 2: Acuerdo Marco de Consultoría Amazon Marketplaces, IT y NDA Bipartito</div>
        <p><strong>Alcance:</strong> Diagnósticos de catálogo en Seller Central (España, UE, México y EE.UU.), resolución de errores 5665/8572, auditorías FBA y visibilidad y arquitectura cloud/SP-API.</p>
        <p><strong>Confidencialidad Estricta (NDA):</strong> Toda la información comercial, credenciales de Seller Central / permisos de usuario secundario, costes de producto, márgenes y métricas de facturación del Cliente serán tratadas bajo riguroso secreto profesional con prohibición de divulgación a terceros.</p>
        <p><strong>Vigencia del Secreto:</strong> Mínimo 3 años tras la finalización del servicio.</p>
      </div>

      <div class="contract-template-box">
        <div class="contract-template-title">🚀 Modelo 3: Contrato de Gestión de Catálogo Amazon, Desarrollo SP-API y Cesión de IP</div>
        <p><strong>Pliego de Requisitos (SOW):</strong> Trabajos de creación de listings, copywriting bilingüe, diseño A+ y programación de conectores SP-API conforme a especificaciones pactadas.</p>
        <p><strong>Cesión Total de Propiedad Intelectual:</strong> Condicionada al cobro del 100% de los honorarios pactados, el Desarrollador/Consultor cede al Cliente con carácter exclusivo y perpetuo todos los derechos patrimoniales sobre los textos, creatividades y código fuente a medida desarrollado.</p>
        <p><strong>Garantía Técnica de 30 Días:</strong> Plazo de 30 días naturales posteriores a la entrega para resolver sin coste incidencias en listings o bugs atribuibles al código entregado.</p>
      </div>
    `
  };

  function showLegalDoc(docKey) {
    if (!LEGAL_DOCS[docKey]) docKey = 'terminos';

    legalTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-legal-tab') === docKey);
    });

    if (legalModalBody) {
      legalModalBody.innerHTML = LEGAL_DOCS[docKey];
      legalModalBody.scrollTop = 0;
    }
  }

  function openLegalDialog(docKey = 'terminos') {
    showLegalDoc(docKey);
    legalDialog?.showModal();
  }

  legalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const docKey = btn.getAttribute('data-legal-tab');
      showLegalDoc(docKey);
    });
  });

  document.querySelectorAll('.open-legal-dialog').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetDoc = link.getAttribute('data-legal-target') || 'terminos';
      openLegalDialog(targetDoc);
    });
  });

  closeLegalDialog?.addEventListener('click', () => { legalDialog?.close(); });

  legalDialog?.addEventListener('click', (e) => {
    const d = legalDialog.getBoundingClientRect();
    if (e.clientX < d.left || e.clientX > d.right || e.clientY < d.top || e.clientY > d.bottom) {
      legalDialog.close();
    }
  });

  window.openLegalDialog = openLegalDialog;

});
