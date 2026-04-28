export function initNav() {
  const header   = document.getElementById('site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav-list a'));
  const toggle   = document.querySelector('.nav-toggle');
  const navList  = document.querySelector('.nav-list');
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Smooth scroll to section
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      );
      const offset = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      navList.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#main-nav')) {
      navList.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Active link via IntersectionObserver
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}
