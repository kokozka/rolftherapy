import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { Lightbox } from './lightbox.js';
import { initNav }  from './nav.js';

initNav();

const carouselEl = document.getElementById('carousel');
if (carouselEl) {
  new Swiper(carouselEl, {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    keyboard: { enabled: true },
    a11y: { enabled: true },
  });
}

const galerieEl = document.getElementById('galerie');
if (galerieEl) new Lightbox(galerieEl);

// Scroll to top button
const btnScrollTop = document.getElementById('btn-scroll-top');
if (btnScrollTop) {
  window.addEventListener('scroll', () => {
    btnScrollTop.hidden = window.scrollY < 200;
  }, { passive: true });
  btnScrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Floating "Napište nám" button — scroll to contact form
const btnFloat = document.getElementById('btn-napiste-nam');
if (btnFloat) {
  btnFloat.addEventListener('click', () => {
    const target = document.getElementById('contact-form');
    if (!target) return;
    const headerH = document.getElementById('site-header').offsetHeight;
    const offset = target.getBoundingClientRect().top + window.scrollY - headerH - 24;
    window.scrollTo({ top: offset, behavior: 'smooth' });
    setTimeout(() => document.getElementById('f-jmeno')?.focus(), 600);
  });
}

// Contact form — frontend validation + AJAX submit
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status  = document.getElementById('form-status');
    const email   = contactForm.email.value.trim();
    const telefon = contactForm.telefon.value.trim();
    const zprava  = contactForm.zprava.value.trim();

    const errors = [];
    if (!zprava) errors.push('Zpráva je povinná.');
    if (!email && !telefon) errors.push('Vyplňte e-mail nebo telefon.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail má nesprávný formát.');
    if (telefon && !/^\+?[\d\s\-().]{9,20}$/.test(telefon)) errors.push('Telefon má nesprávný formát.');

    if (errors.length) {
      status.className = 'form-status form-status--error';
      status.textContent = errors.join(' ');
      return;
    }

    const btn = contactForm.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Odesílám…';
    status.className = 'form-status';
    status.textContent = '';

    try {
      const res  = await fetch('contact.php', { method: 'POST', body: new FormData(contactForm) });
      const data = await res.json();
      status.className = 'form-status ' + (data.success ? 'form-status--ok' : 'form-status--error');
      status.textContent = data.message;
      if (data.success) contactForm.reset();
    } catch {
      status.className = 'form-status form-status--error';
      status.textContent = 'Chyba připojení. Zkuste to prosím znovu.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Odeslat zprávu';
    }
  });
}
