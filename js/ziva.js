/**
 * ZIVA JEWELS - Interactive Scripts
 * Pure Silver Pure You | Nikol, Ahmedabad
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initGoldParticles();
  initShowcaseFilter();
  initLightboxModal();
  initVideoPlayer();
  initScrollAnimations();
  initAppointmentForm();
  initSmoothScroll();
  initScrollSpy();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.ziva-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle-btn');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const links = document.querySelectorAll('.mobile-nav-link, .mobile-nav-overlay a');

  if (!toggleBtn || !overlay) return;

  const toggleNav = () => {
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('open');
      toggleBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggleNav);

  links.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   3. GOLD DUST / PARTICLE EFFECT (CANVAS)
   ========================================================================== */
function initGoldParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];

  const resize = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    createParticles();
  };

  const createParticles = () => {
    particles = [];
    const count = Math.min(canvas.width > 768 ? 45 : 22, 60);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speedY: - (Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
      p.pulseVal += p.pulseSpeed;
      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(76, 179, 176, 0.6)';
      ctx.fill();

      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ==========================================================================
   4. SHOWCASE FILTER TABS
   ========================================================================== */
function initShowcaseFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.showcase-item');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCat === filterVal) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   5. LIGHTBOX MODAL & ENQUIRY PREVIEW
   ========================================================================== */
function initLightboxModal() {
  const modal = document.getElementById('zivaModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const triggers = document.querySelectorAll('[data-modal-target]');

  if (!modal) return;

  const openModal = (imgSrc, title, desc, tag) => {
    const modalImg = modal.querySelector('.modal-media-pane img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalTag = modal.querySelector('.modal-tag');
    const modalWhatsappBtn = modal.querySelector('.modal-whatsapp-enquire');

    if (modalImg && imgSrc) modalImg.src = imgSrc;
    if (modalTitle && title) modalTitle.textContent = title;
    if (modalDesc && desc) modalDesc.textContent = desc;
    if (modalTag && tag) modalTag.textContent = tag;

    if (modalWhatsappBtn && title) {
      const msg = encodeURIComponent(`Hello Ziva Jewels, I am interested in knowing more about: "${title}". Could you please assist me with details?`);
      modalWhatsappBtn.href = `https://wa.me/919601818828?text=${msg}`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = trigger.closest('.showcase-item') || trigger.closest('.gallery-tile') || trigger.closest('.collection-card');
      if (parentCard) {
        const img = parentCard.querySelector('img');
        const titleEl = parentCard.querySelector('.showcase-item-name, .gallery-tile-title, .collection-card-title');
        const descEl = parentCard.querySelector('.showcase-item-specs, .collection-card-desc');
        const tagEl = parentCard.querySelector('.showcase-badge-pill, .gallery-tile-tag, .collection-tag-small');

        const imgSrc = img ? img.src : '';
        const title = titleEl ? titleEl.textContent.trim() : 'Ziva Jewellery Masterpiece';
        const desc = descEl ? descEl.textContent.trim() : 'Pure silver jewellery masterpiece handcrafted with antique finish and royal heritage detailing.';
        const tag = tagEl ? tagEl.textContent.trim() : 'Masterpiece';

        openModal(imgSrc, title, desc, tag);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. VIDEO PLAYER INTERACTION
   ========================================================================== */
function initVideoPlayer() {
  const banner = document.querySelector('.video-banner-box');
  if (!banner) return;

  const video = banner.querySelector('video');
  const playBtn = banner.querySelector('.play-action-circle');

  if (!video || !playBtn) return;

  const togglePlay = () => {
    if (video.paused) {
      video.play();
      banner.classList.add('playing');
    } else {
      video.pause();
      banner.classList.remove('playing');
    }
  };

  playBtn.addEventListener('click', togglePlay);
  banner.addEventListener('click', (e) => {
    if (e.target === video) togglePlay();
  });

  video.addEventListener('ended', () => {
    banner.classList.remove('playing');
  });
}

/* ==========================================================================
   7. SCROLL OBSERVER ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================================================
   8. APPOINTMENT / ENQUIRY FORM HANDLER
   ========================================================================== */
function initAppointmentForm() {
  const form = document.getElementById('zivaEnquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#clientName')?.value || '';
    const phone = form.querySelector('#clientPhone')?.value || '';
    const interest = form.querySelector('#collectionInterest')?.value || 'General Collection';
    const message = form.querySelector('#clientMessage')?.value || '';

    const waText = encodeURIComponent(
      `*New Showroom Enquiry - Ziva Jewels*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Interest:* ${interest}\n` +
      `*Note:* ${message || 'I would like to arrange a showroom visit.'}`
    );

    const waUrl = `https://wa.me/919601818828?text=${waText}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');

    // Show instant feedback on the form
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Enquiry Sent to WhatsApp! ✓</span>`;
      submitBtn.style.background = '#25D366';
      submitBtn.style.color = '#FFFFFF';
      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        form.reset();
      }, 4000);
    }
  });
}

/* ==========================================================================
   9. SMOOTH SCROLL FOR IN-PAGE ANCHORS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.ziva-header')?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   10. SCROLL SPY (ACTIVE NAV FOR HOME, ABOUT, COLLECTION, CRAFTSMANSHIP, GALLERY, CONTACT)
   ========================================================================== */
function initScrollSpy() {
  const sectionIds = ['hero', 'about', 'collections', 'craftsmanship', 'gallery', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .mobile-nav-link');

  if (!sections.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 160;
    let currentId = 'hero';

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
        break;
      }
    }

    // Update Desktop Nav
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Nav
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
