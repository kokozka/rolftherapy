export class Lightbox {
  #overlay;
  #img;
  #items = [];
  #current = 0;

  constructor(galleryEl) {
    this.#items = Array.from(galleryEl.querySelectorAll('.gallery-item'));
    this.#build();
    this.#items.forEach((btn, i) => {
      btn.addEventListener('click', () => this.#open(i));
    });
  }

  #build() {
    this.#overlay = document.createElement('div');
    this.#overlay.className = 'lightbox-overlay';
    this.#overlay.setAttribute('role', 'dialog');
    this.#overlay.setAttribute('aria-modal', 'true');
    this.#overlay.setAttribute('aria-label', 'Fotografie');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&#x2715;';
    closeBtn.setAttribute('aria-label', 'Zavřít');
    closeBtn.addEventListener('click', () => this.#close());

    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-prev';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.setAttribute('aria-label', 'Předchozí fotografie');
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.#step(-1); });

    this.#img = document.createElement('img');
    this.#img.className = 'lightbox-img';
    this.#img.alt = '';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-next';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.setAttribute('aria-label', 'Další fotografie');
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.#step(1); });

    this.#overlay.append(closeBtn, prevBtn, this.#img, nextBtn);

    this.#overlay.addEventListener('click', (e) => {
      if (e.target === this.#overlay) this.#close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.#overlay.classList.contains('open')) return;
      if (e.key === 'Escape')     this.#close();
      if (e.key === 'ArrowLeft')  this.#step(-1);
      if (e.key === 'ArrowRight') this.#step(1);
    });

    document.body.appendChild(this.#overlay);
  }

  #open(index) {
    this.#current = index;
    this.#render();
    this.#overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.#overlay.querySelector('.lightbox-close').focus();
  }

  #close() {
    this.#overlay.classList.remove('open');
    document.body.style.overflow = '';
    this.#items[this.#current].focus();
  }

  #step(dir) {
    this.#current = (this.#current + dir + this.#items.length) % this.#items.length;
    this.#render();
  }

  #render() {
    const btn   = this.#items[this.#current];
    const thumb = btn.querySelector('img');
    this.#img.src = thumb.dataset.full || thumb.src;
    this.#img.alt = thumb.alt;
  }
}
