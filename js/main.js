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
