// ============================================================
// Amingo Design & Photography — interactivity (vanilla JS)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('amingo-theme');
  if (savedTheme === 'light') root.classList.add('light');
  const syncThemeIcon = () => {
    if (!themeToggle) return;
    themeToggle.querySelector('[data-icon="sun"]').classList.toggle('hidden', !root.classList.contains('light'));
    themeToggle.querySelector('[data-icon="moon"]').classList.toggle('hidden', root.classList.contains('light'));
  };
  syncThemeIcon();
  themeToggle?.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('amingo-theme', root.classList.contains('light') ? 'light' : 'dark');
    syncThemeIcon();
  });

  /* ---------------- Mobile menu ---------------- */
  const menuBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn?.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  }));

  /* ---------------- Sticky nav shrink + scroll progress ---------------- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 40);
    backToTop?.classList.toggle('opacity-0', y < 500);
    backToTop?.classList.toggle('pointer-events-none', y < 500);
    const h = document.documentElement;
    const scrollPct = (y / (h.scrollHeight - h.clientHeight)) * 100;
    if (progress) progress.style.width = scrollPct + '%';
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.counter, 10);
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------------- Skill bars ---------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.level + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(b => skillObserver.observe(b));

  /* ---------------- Hero parallax (mouse) ---------------- */
  const hero = document.getElementById('home');
  const floaters = document.querySelectorAll('.float-card');
  hero?.addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5) * 2;
    const y = (e.clientY / h - 0.5) * 2;
    floaters.forEach((el, i) => {
      const depth = (i + 1) * 6;
      el.style.setProperty('--px', `${x * depth}px`);
      el.style.setProperty('--py', `${y * depth}px`);
      el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });

  /* ---------------- Particles ---------------- */
  const particleField = document.getElementById('particle-field');
  if (particleField) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 2 + Math.random() * 4;
      p.style.width = p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `-${Math.random() * 20}px`;
      p.style.animationDuration = `${10 + Math.random() * 12}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      particleField.appendChild(p);
    }
  }

  /* ---------------- Gallery filters (Photography) ---------------- */
  const setupFilter = (filterSelector, itemSelector) => {
    const buttons = document.querySelectorAll(filterSelector);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('bg-gold', 'text-black'));
        btn.classList.add('bg-gold', 'text-black');
        const filter = btn.dataset.filter;
        document.querySelectorAll(itemSelector).forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  };
  setupFilter('.photo-filter-btn', '.photo-item');
  setupFilter('.design-filter-btn', '.design-item');

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxItems = Array.from(document.querySelectorAll('.photo-item'));
  let lightboxIndex = 0;

  const openLightbox = (index) => {
    lightboxIndex = index;
    const item = lightboxItems[lightboxIndex];
    if (!item) return;
    const srcImg = item.querySelector('.ph-img');
    const bgClasses = Array.from(srcImg.classList).filter(c =>
      c.startsWith('bg-') || c.startsWith('from-') || c.startsWith('via-') || c.startsWith('to-')
    );
    lightboxImg.className = ['w-full', 'aspect-[4/3]', 'rounded-2xl', 'flex', 'items-center', 'justify-center', ...bgClasses].join(' ');
    lightboxImg.innerHTML = srcImg.innerHTML;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  lightboxItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.getElementById('lightbox-next')?.addEventListener('click', () => openLightbox((lightboxIndex + 1) % lightboxItems.length));
  document.getElementById('lightbox-prev')?.addEventListener('click', () => openLightbox((lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length));
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') openLightbox((lightboxIndex + 1) % lightboxItems.length);
    if (e.key === 'ArrowLeft') openLightbox((lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length);
  });

  /* ---------------- Project detail modal ---------------- */
  const projectModal = document.getElementById('project-modal');
  const projectData = {
    horizon: {
      title: 'Horizon Coffee — Brand Identity',
      client: 'Horizon Coffee Roasters',
      story: 'Horizon Coffee approached Amingo to reimagine their identity ahead of a three-city expansion. The brief called for something that felt both artisanal and scalable across packaging, signage, and digital.',
      objectives: 'Create a distinctive mark that works at espresso-cup scale and on storefront signage, paired with a warm, premium packaging system.',
      process: 'Moodboarding → 40+ logo concepts → 3 refined directions → client workshop → final identity, type system, and packaging mockups.',
      challenges: 'Balancing a hand-crafted feel with the consistency needed for a multi-location rollout across print and digital.',
      results: 'Brand rolled out across 3 flagship stores; packaging redesign linked to a 22% increase in repeat online orders.',
      testimonial: '"Amingo captured exactly what we couldn’t put into words. Every touchpoint now feels unmistakably us." — Horizon Coffee, Founder',
    },
    lumen: {
      title: 'Lumen Fashion Week — Campaign Photography',
      client: 'Lumen Studio',
      story: 'A full-day shoot covering runway, backstage, and portrait sessions for Lumen’s Spring/Summer collection launch.',
      objectives: 'Deliver a cohesive gallery for press, social, and the lookbook within 48 hours of the show.',
      process: 'Pre-shoot lighting tests → live runway coverage → backstage documentary shots → same-night culling and edit → delivery.',
      challenges: 'Low, shifting runway lighting and a tight next-day press deadline.',
      results: 'Gallery featured in 4 fashion publications; became Lumen’s highest-engagement social campaign to date.',
      testimonial: '"The images told the story of the collection better than we could have imagined." — Lumen Studio, Creative Director',
    },
  };
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const data = projectData[card.dataset.project];
      if (!data) return;
      projectModal.querySelector('[data-field="title"]').textContent = data.title;
      projectModal.querySelector('[data-field="client"]').textContent = data.client;
      projectModal.querySelector('[data-field="story"]').textContent = data.story;
      projectModal.querySelector('[data-field="objectives"]').textContent = data.objectives;
      projectModal.querySelector('[data-field="process"]').textContent = data.process;
      projectModal.querySelector('[data-field="challenges"]').textContent = data.challenges;
      projectModal.querySelector('[data-field="results"]').textContent = data.results;
      projectModal.querySelector('[data-field="testimonial"]').textContent = data.testimonial;
      projectModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });
  document.getElementById('project-modal-close')?.addEventListener('click', () => {
    projectModal.classList.add('hidden');
    document.body.style.overflow = '';
  });
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      projectModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  /* ---------------- Before / After sliders ---------------- */
  document.querySelectorAll('.ba-wrap').forEach(wrap => {
    const after = wrap.querySelector('.ba-after');
    const handle = wrap.querySelector('.ba-handle');
    const setPos = (clientX) => {
      const rect = wrap.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.width = pct + '%';
      handle.style.left = pct + '%';
    };
    let dragging = false;
    wrap.addEventListener('pointerdown', (e) => { dragging = true; setPos(e.clientX); });
    window.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener('pointerup', () => dragging = false);
  });

  /* ---------------- Testimonial carousel ---------------- */
  const track = document.getElementById('testimonial-track');
  const slides = track ? Array.from(track.children) : [];
  let tIndex = 0;
  const showSlide = (i) => {
    tIndex = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${tIndex * 100}%)`;
    document.querySelectorAll('.testimonial-dot').forEach((d, di) => d.classList.toggle('bg-gold', di === tIndex));
  };
  document.getElementById('testimonial-next')?.addEventListener('click', () => showSlide(tIndex + 1));
  document.getElementById('testimonial-prev')?.addEventListener('click', () => showSlide(tIndex - 1));
  document.querySelectorAll('.testimonial-dot').forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  let autoplay = setInterval(() => showSlide(tIndex + 1), 6000);
  const carousel = document.getElementById('testimonial-carousel');
  carousel?.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel?.addEventListener('mouseleave', () => autoplay = setInterval(() => showSlide(tIndex + 1), 6000));
  // swipe
  let touchStartX = 0;
  carousel?.addEventListener('touchstart', (e) => touchStartX = e.touches[0].clientX, { passive: true });
  carousel?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 50) showSlide(tIndex - 1);
    if (dx < -50) showSlide(tIndex + 1);
  }, { passive: true });

  /* ---------------- Booking form ---------------- */
  const bookingForm = document.getElementById('booking-form');
  const slotButtons = document.querySelectorAll('.slot-btn');
  let selectedSlot = null;
  slotButtons.forEach(btn => btn.addEventListener('click', () => {
    slotButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSlot = btn.textContent.trim();
    document.getElementById('booking-slot-error')?.classList.add('hidden');
  }));

  const dateInput = document.getElementById('booking-date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      document.getElementById('booking-slot-error')?.classList.remove('hidden');
      return;
    }
    const data = new FormData(bookingForm);
    showConfirmation({
      service: data.get('service'),
      date: data.get('date'),
      slot: selectedSlot,
      name: data.get('name'),
    });
    bookingForm.reset();
    slotButtons.forEach(b => b.classList.remove('selected'));
    selectedSlot = null;
  });

  const confirmModal = document.getElementById('confirm-modal');
  function showConfirmation({ service, date, slot, name }) {
    document.getElementById('confirm-summary').innerHTML =
      `Thanks, <strong>${name}</strong>. Your request for <strong>${service}</strong> on ` +
      `<strong>${date}</strong> at <strong>${slot}</strong> has been sent. We'll confirm by email within 24 hours.`;
    confirmModal.classList.remove('hidden');
  }
  document.getElementById('confirm-modal-close')?.addEventListener('click', () => confirmModal.classList.add('hidden'));
  confirmModal?.addEventListener('click', (e) => { if (e.target === confirmModal) confirmModal.classList.add('hidden'); });

  /* ---------------- Contact + newsletter forms (client-side confirmation) ---------------- */
  const toast = document.getElementById('toast');
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 3500);
  };
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent — we\'ll reply within 24 hours.');
    e.target.reset();
  });
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('You\'re subscribed. Welcome to the studio.');
    e.target.reset();
  });

  /* ---------------- Blog filter/search ---------------- */
  const blogSearch = document.getElementById('blog-search');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  const applyBlogFilter = () => {
    const query = (blogSearch?.value || '').toLowerCase();
    const activeCat = document.querySelector('.blog-filter-btn.bg-gold')?.dataset.category || 'all';
    blogCards.forEach(card => {
      const matchesCat = activeCat === 'all' || card.dataset.category === activeCat;
      const matchesQuery = card.dataset.title.toLowerCase().includes(query);
      card.style.display = matchesCat && matchesQuery ? '' : 'none';
    });
  };
  blogSearch?.addEventListener('input', applyBlogFilter);
  blogFilterBtns.forEach(btn => btn.addEventListener('click', () => {
    blogFilterBtns.forEach(b => b.classList.remove('bg-gold', 'text-black'));
    btn.classList.add('bg-gold', 'text-black');
    applyBlogFilter();
  }));

});
