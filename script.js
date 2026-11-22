/* ─────────────────────────────────────────────────────────────
   PORTFOLIO SCRIPT — Darren Paul T.
   Sections: Nav | Dark Mode | Stars | About Animations |
             Projects (data + render + filter + modal) |
             Contact (copy + form)
───────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════
   PROJECT DATA — Add your projects here.
   To add a new project, copy one object and paste it in.
═══════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    title: 'Attendance Desk',
    description: 'A browser-based QR attendance system with teacher and student workflows, encrypted local storage, offline support, camera scanning, and CSV/Excel reporting.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    emoji: '📷',
    liveUrl: 'https://xeioz.github.io/ClassAttendance/',
    githubUrl: 'https://github.com/Xeioz/ClassAttendance',
  },
  {
    title: 'First Repo',
    description: 'A collection of school activities and early programming work, maintained as a record of foundational development projects.',
    tags: ['School Work'],
    emoji: '📚',
    liveUrl: '',
    githubUrl: 'https://github.com/Xeioz/First-Repo',
  },
  {
    title: 'Prototype',
    description: 'An early repository reserved for experiments and in-progress ideas. Visit the source to follow future work.',
    tags: ['Prototype'],
    emoji: '🧪',
    liveUrl: '',
    githubUrl: 'https://github.com/Xeioz/prototype',
  },
];
/* ─── END PROJECT DATA ─── */


document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV TOGGLE (mobile) ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.classList.toggle('open', open);
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
      }
    });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link[data-section]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── DARK MODE ── */
  const darkModeToggle = document.getElementById('darkModeToggle');
  const updateToggleIcon = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (darkModeToggle) darkModeToggle.textContent = dark ? '☀️' : '🌙';
  };
  updateToggleIcon();

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('darkMode', 'false');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'true');
      }
      updateToggleIcon();
    });
  }

  /* ── STAR BACKGROUND ── */
  const starContainer = document.getElementById('stars');
  if (starContainer) {
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      s.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 4}s;
        animation-duration: ${2 + Math.random() * 3}s;
      `;
      starContainer.appendChild(s);
    }
  }

  /* ── ABOUT SECTION SCROLL ANIMATIONS ── */
  const animatedEls = document.querySelectorAll('.about-text, .timeline-item');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  animatedEls.forEach(el => {
    el.style.animationPlayState = 'paused';
    animObserver.observe(el);
  });

  /* ════════════════════════════════════════════════════════
     PROJECTS
  ════════════════════════════════════════════════════════ */
  const workGrid   = document.getElementById('workGrid');
  const noProjects = document.getElementById('noProjects');
  const filterBar  = document.getElementById('filterBar');
  let   activeFilter = 'all';

  function renderProjects(filter = 'all') {
    if (!workGrid) return;
    workGrid.innerHTML = '';

    const filtered = filter === 'all'
      ? PROJECTS
      : PROJECTS.filter(p => p.tags.includes(filter));

    if (noProjects) noProjects.style.display = filtered.length === 0 ? 'block' : 'none';

    filtered.forEach((project, i) => {
      const card = document.createElement('div');
      card.className = 'work-card';
      card.style.animationDelay = `${i * 0.07}s`;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View ${project.title}`);

      card.innerHTML = `
        <div class="work-card-thumb">${project.emoji}</div>
        <div class="work-card-info">
          <div class="work-card-tags">
            ${project.tags.map(t => `<span class="work-card-tag">${t}</span>`).join('')}
          </div>
          <div class="work-card-name">${project.title}</div>
          <div class="work-card-desc">${project.description}</div>
        </div>
      `;

      card.addEventListener('click', () => openModal(project));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(project); });
      workGrid.appendChild(card);
    });
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProjects(activeFilter);
    });
  }

  renderProjects();

  /* ── MODAL ── */
  const backdrop   = document.getElementById('modalBackdrop');
  const modal      = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc  = document.getElementById('modalDesc');
  const modalTags  = document.getElementById('modalTags');
  const modalLinks = document.getElementById('modalLinks');
  const modalImg   = document.getElementById('modalImgPlaceholder');

  function openModal(project) {
    if (!backdrop) return;

    modalImg.textContent   = project.emoji;
    modalTitle.textContent = project.title;
    modalDesc.textContent  = project.description;

    modalTags.innerHTML = project.tags
      .map(t => `<span class="modal-tag">${t}</span>`).join('');

    let links = '';
    if (project.liveUrl) {
      links += `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="modal-link modal-link-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live Demo
      </a>`;
    }
    if (project.githubUrl) {
      links += `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="modal-link modal-link-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        View on GitHub
      </a>`;
    }
    modalLinks.innerHTML = links;

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ════════════════════════════════════════════════════════
     CONTACT
  ════════════════════════════════════════════════════════ */

  /* Copy-to-clipboard buttons */
  const copyToast = document.getElementById('copyToast');
  let toastTimer;

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        clearTimeout(toastTimer);
        if (copyToast) {
          copyToast.textContent = 'Copied to clipboard!';
          copyToast.classList.add('show');
          toastTimer = setTimeout(() => {
            copyToast.classList.remove('show');
            btn.classList.remove('copied');
          }, 2000);
        }
      });
    });
  });

  /* Contact form submission */
  const contactForm = document.getElementById('contactForm');
  const formSubmit  = document.getElementById('formSubmit');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const action = contactForm.action;
      if (action.includes('YOUR_FORM_ID')) {
        alert('Set up your Formspree form ID first! Replace YOUR_FORM_ID in the action attribute of the form in index.html.');
        return;
      }

      formSubmit.disabled = true;
      formSubmit.querySelector('.submit-text').textContent = 'Sending…';

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          formSubmit.querySelector('.submit-text').textContent = 'Sent! ✓';
          contactForm.reset();
          setTimeout(() => {
            formSubmit.disabled = false;
            formSubmit.querySelector('.submit-text').textContent = 'Send Message';
          }, 3000);
        } else {
          throw new Error('Server error');
        }
      } catch {
        formSubmit.querySelector('.submit-text').textContent = 'Error — try again';
        formSubmit.disabled = false;
        setTimeout(() => {
          formSubmit.querySelector('.submit-text').textContent = 'Send Message';
        }, 3000);
      }
    });
  }

}); // end DOMContentLoaded
