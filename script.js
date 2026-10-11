'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Мобільне меню
  const burgerBtn = document.getElementById('burgerBtn');
  const nav = document.getElementById('nav');

  if (burgerBtn && nav) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burgerBtn.classList.toggle('is-active', isOpen);
      burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burgerBtn.classList.remove('is-active');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Анімація появи
  document.querySelectorAll('.hero .reveal').forEach((el) => {
    el.classList.add('reveal--visible');
  });

  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => {
      if (!el.classList.contains('reveal--visible')) observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('reveal--visible'));
  }

  // Лічильники
  document.querySelectorAll('.stats__num[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    let startTime = null;

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (progress === 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });

  // Форма
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = "Дякуємо! Ми зв'яжемося з вами найближчим часом.";
      contactForm.reset();
    });
  }
});
