(() => {
  // hero line stagger
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline) {
    heroHeadline.querySelectorAll('.line').forEach((el, i) => {
      el.style.setProperty('--i', i);
    });
    requestAnimationFrame(() => heroHeadline.classList.add('visible'));
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = +entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // safety net: if anything is still hidden after 3s, reveal it
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible), .reveal-up:not(.visible)')
      .forEach(el => el.classList.add('visible'));
  }, 3000);

  // subtle parallax on real visuals (video + image only)
  const visuals = document.querySelectorAll('.case-visual:not(.case-visual-graphic):not(.case-visual-quote):not(.case-visual-list)');
  if (visuals.length) {
    let scrolling = false;
    const onScroll = () => {
      if (scrolling) return;
      scrolling = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        visuals.forEach(v => {
          const rect = v.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;
          const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
          const shift = Math.max(-18, Math.min(18, progress * -18));
          const inner = v.querySelector('img, video');
          if (inner) inner.style.transform = `translate3d(0, ${shift}px, 0) scale(1.06)`;
        });
        scrolling = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
