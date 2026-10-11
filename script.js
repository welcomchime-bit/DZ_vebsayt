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

  // Збірка авто при скролі
  const assemblyTrack = document.getElementById('assemblyTrack');

  if (assemblyTrack) {
    const parts = Array.from(assemblyTrack.querySelectorAll('[data-start]'));
    const fill = document.getElementById('assemblyFill');
    const pct = document.getElementById('assemblyPct');
    const stageLabel = document.getElementById('assemblyStage');
    const done = document.getElementById('assemblyDone');
    const stages = [
      { at: 0, label: 'Рама' },
      { at: 0.2, label: 'Колеса' },
      { at: 0.38, label: 'Кузов' },
      { at: 0.56, label: 'Скло' },
      { at: 0.66, label: 'Фари та бампери' },
      { at: 0.86, label: 'Полірування' },
    ];
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      parts.forEach((el) => el.style.setProperty('--pp', 1));
      if (done) done.style.setProperty('--pp', 1);
      if (fill) fill.style.width = '100%';
      if (pct) pct.textContent = '100%';
      if (stageLabel) stageLabel.textContent = stages[stages.length - 1].label;
    } else {
      let ticking = false;

      const render = () => {
        ticking = false;
        const rect = assemblyTrack.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, total > 0 ? -rect.top / total : 0));

        parts.forEach((el) => {
          const start = parseFloat(el.dataset.start);
          const end = parseFloat(el.dataset.end);
          const local = Math.min(1, Math.max(0, (p - start) / (end - start)));
          el.style.setProperty('--pp', easeOutCubic(local));
        });

        if (fill) fill.style.width = (p * 100) + '%';
        if (pct) pct.textContent = Math.round(p * 100) + '%';
        if (done) done.style.setProperty('--pp', Math.min(1, Math.max(0, (p - 0.92) / 0.08)));
        if (stageLabel) {
          const current = stages.filter((s) => p >= s.at).pop();
          if (current) stageLabel.textContent = current.label;
        }
      };

      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(render);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      render();
    }
  }

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
