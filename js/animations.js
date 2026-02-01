/**
 * animations.js — Intersection Observer for fade-in and typewriter triggers.
 */

(function () {
  'use strict';

  /* ─── Fade-in-up on scroll ─── */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in-up').forEach((el) => {
    fadeObserver.observe(el);
  });

  /* ─── Typewriter triggers ─── */
  const typewriterInstances = [];

  // Hero terminal
  const heroEl = document.getElementById('hero-terminal');
  if (heroEl && typeof TypewriterAnimation !== 'undefined') {
    const heroTW = new TypewriterAnimation(heroEl, TYPEWRITER_CONTENT.hero);
    typewriterInstances.push({ el: heroEl, tw: heroTW, started: false });
  }

  // Feature-block terminals
  document.querySelectorAll('[data-typewriter]').forEach((el) => {
    const key = el.getAttribute('data-typewriter');
    const content = TYPEWRITER_CONTENT[key];
    if (content && typeof TypewriterAnimation !== 'undefined') {
      const tw = new TypewriterAnimation(el, content);
      typewriterInstances.push({ el, tw, started: false });
    }
  });

  const twObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const instance = typewriterInstances.find((i) => i.el === entry.target);
          if (instance && !instance.started) {
            instance.started = true;
            instance.tw.start();
            twObserver.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  typewriterInstances.forEach((instance) => {
    twObserver.observe(instance.el);
  });
})();
