document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Particle Canvas Background
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLE_COUNT = 80;
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

  // Init particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Draw connecting lines between nearby particles
  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
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

  // Pause animation when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      animateParticles();
    }
  });


  /* ==========================================================================
     2. Header Scroll Effect
     ========================================================================== */
  const mainHeader = document.getElementById('main-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ==========================================================================
     3. Mobile Navigation
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

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

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });


  /* ==========================================================================
     4. Countdown Timer to June 1, 2026
     ========================================================================== */
  const targetDate = new Date('2026-06-01T09:00:00');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
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
     5. Animated Number Counters (Stats Section)
     ========================================================================== */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));


  /* ==========================================================================
     6. Scroll Reveal Setup
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px', threshold: 0.08 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Trigger any already-visible elements
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('active');
      });
    }, 100);
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }


  /* ==========================================================================
     7. Form Validation & Submission
     ========================================================================== */
  const form = document.getElementById('lead-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const resetFormBtn = document.getElementById('reset-form-btn');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate() {
        if (!this.input.value.trim()) {
          this.showError('El nombre es obligatorio.');
          return false;
        }
        this.clearError();
        return true;
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate() {
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
      input: document.getElementById('phone'),
      error: document.getElementById('phone-error'),
      validate() {
        const value = this.input.value.trim();
        if (!value) {
          this.showError('El número de WhatsApp es obligatorio.');
          return false;
        }
        const digits = value.replace(/\D/g, '');
        if (digits.length < 9) {
          this.showError('Introduce un número de WhatsApp válido (mínimo 9 dígitos).');
          return false;
        }
        this.clearError();
        return true;
      }
    }
  };

  Object.keys(fields).forEach(key => {
    const field = fields[key];

    field.showError = (msg) => {
      field.error.textContent = msg;
      field.error.classList.add('visible');
      field.input.closest('.form-group').classList.add('has-error');
      field.input.setAttribute('aria-invalid', 'true');
    };

    field.clearError = () => {
      field.error.textContent = '';
      field.error.classList.remove('visible');
      field.input.closest('.form-group').classList.remove('has-error');
      field.input.removeAttribute('aria-invalid');
    };

    field.input.addEventListener('blur', () => { field.validate(); });
    field.input.addEventListener('input', () => {
      if (field.input.value.trim() !== '') field.clearError();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const honeypot = document.getElementById('website_url').value;
    if (honeypot) { showSuccessView(); return; }

    let isValid = true;
    Object.keys(fields).forEach(key => {
      if (!fields[key].validate()) isValid = false;
    });

    if (!isValid) {
      const firstInvalid = Object.keys(fields).find(key => !fields[key].validate());
      if (firstInvalid) fields[firstInvalid].input.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').classList.add('hidden');
    submitBtn.querySelector('.spinner').classList.remove('hidden');

    setTimeout(() => {
      const leadData = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('es-ES'),
        name:  fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        phone: fields.phone.input.value.trim(),
        level: form.querySelector('input[name="level"]:checked').value,
        student_type: 'N/A',
        message: 'N/A'
      };

      saveLead(leadData);
      showSuccessView();
    }, 1200);
  });

  resetFormBtn.addEventListener('click', () => {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').classList.remove('hidden');
    submitBtn.querySelector('.spinner').classList.add('hidden');
    Object.keys(fields).forEach(key => fields[key].clearError());
    formSuccess.classList.add('hidden');
    form.classList.remove('hidden');
  });

  function showSuccessView() {
    form.classList.add('hidden');
    formSuccess.classList.remove('hidden');
  }

  function saveLead(newLead) {
    const currentLeads = JSON.parse(localStorage.getItem('aish_english_leads')) || [];
    currentLeads.push(newLead);
    localStorage.setItem('aish_english_leads', JSON.stringify(currentLeads));
    updateAdminTable();
  }


  /* ==========================================================================
     8. Admin Leads Dashboard
     ========================================================================== */
  const adminDialog    = document.getElementById('admin-dialog');
  const secretAdminTrigger = document.getElementById('secret-admin-trigger');
  const closeAdmin     = document.getElementById('close-admin');
  const exportBtn      = document.getElementById('export-leads');
  const clearBtn       = document.getElementById('clear-leads');
  const leadsTbody     = document.getElementById('leads-tbody');
  const totalLeadsCount = document.getElementById('total-leads-count');

  let clickCount = 0;
  let clickTimer = null;

  if (secretAdminTrigger) {
    secretAdminTrigger.addEventListener('click', () => {
      clickCount++;
      
      if (clickCount === 5) {
        promptAdminAccess();
        clickCount = 0; // Reset
      }

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1500); // Must tap 5 times within 1.5 seconds
    });
  }

  function promptAdminAccess() {
    const password = prompt('Introduce la contraseña para acceder al panel de administración:');
    if (password === 'aish2026') {
      updateAdminTable();
      adminDialog.showModal();
    } else if (password !== null) {
      alert('Contraseña incorrecta. Acceso denegado.');
    }
  }

  // Allow access via hyperlink
  if (window.location.hash === '#admin') {
    promptAdminAccess();
    // Clean the URL so it doesn't trigger again on normal refresh
    history.replaceState(null, null, window.location.pathname);
  }

  closeAdmin.addEventListener('click', () => { adminDialog.close(); });

  adminDialog.addEventListener('click', (e) => {
    const d = adminDialog.getBoundingClientRect();
    if (e.clientX < d.left || e.clientX > d.right || e.clientY < d.top || e.clientY > d.bottom) {
      adminDialog.close();
    }
  });

  function updateAdminTable() {
    const leads = JSON.parse(localStorage.getItem('aish_english_leads')) || [];
    totalLeadsCount.textContent = leads.length;

    if (leads.length === 0) {
      leadsTbody.innerHTML = `<tr><td colspan="8" class="text-center empty-state">No hay leads registrados aún.</td></tr>`;
      return;
    }

    const sortedLeads = [...leads].sort((a, b) => b.id - a.id);

    leadsTbody.innerHTML = sortedLeads.map(lead => {
      const escapedMsg = lead.message ? escapeHTML(lead.message) : '<span style="color:var(--text-muted)">—</span>';
      return `
        <tr data-id="${lead.id}">
          <td>${escapeHTML(lead.timestamp)}</td>
          <td><strong>${escapeHTML(lead.name)}</strong></td>
          <td><a href="mailto:${encodeURIComponent(lead.email)}" style="color:var(--primary-color)">${escapeHTML(lead.email)}</a></td>
          <td><a href="tel:${encodeURIComponent(lead.phone)}" style="color:var(--accent-secondary)">${escapeHTML(lead.phone)}</a></td>
          <td><span class="badge badge-primary">${escapeHTML(lead.level)}</span></td>
          <td><span class="badge badge-accent">${escapeHTML(lead.student_type)}</span></td>
          <td title="${escapedMsg}">${escapedMsg}</td>
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
    let leads = JSON.parse(localStorage.getItem('aish_english_leads')) || [];
    leads = leads.filter(l => l.id !== id);
    localStorage.setItem('aish_english_leads', JSON.stringify(leads));
    updateAdminTable();
  }

  clearBtn.addEventListener('click', () => {
    const leads = JSON.parse(localStorage.getItem('aish_english_leads')) || [];
    if (leads.length === 0) { alert('No hay leads para eliminar.'); return; }
    if (confirm('¡ATENCIÓN! Esto eliminará de forma permanente TODOS los leads guardados. ¿Deseas continuar?')) {
      localStorage.removeItem('aish_english_leads');
      updateAdminTable();
    }
  });

  exportBtn.addEventListener('click', () => {
    const leads = JSON.parse(localStorage.getItem('aish_english_leads')) || [];
    if (leads.length === 0) { alert('No hay leads registrados para exportar.'); return; }

    const csvHeaders = "Fecha de Registro,Nombre Completo,Email,Telefono,Nivel Seleccionado,Tipo de Alumno,Comentarios\n";
    const csvRows = leads.map(l => [
      l.timestamp, l.name, l.email, l.phone, l.level, l.student_type,
      l.message ? l.message.replace(/\r?\n|\r/g, " ").replace(/"/g, '""') : ""
    ].map(val => `"${val}"`).join(",")).join("\n");

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_aish_english_${new Date().toISOString().slice(0,10)}.csv`);
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

});
