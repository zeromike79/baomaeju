/* nav.js — 햄버거 메뉴 · 스크롤 효과 · 현재 페이지 활성화 */

(function () {
  'use strict';

  const header     = document.querySelector('.site-header');
  const toggle     = document.querySelector('.nav-toggle');
  const mobileNav  = document.querySelector('.nav-mobile');
  const navLinks   = document.querySelectorAll('.nav-links a, .nav-mobile a[data-page]');

  /* ── 스크롤 시 헤더 그림자 ── */
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 햄버거 토글 ── */
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* 모바일 메뉴 링크 클릭 시 닫기 */
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* 외부 클릭 시 닫기 */
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 현재 페이지 nav 링크 활성화 ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (a) {
    const href = a.getAttribute('href');
    if (href && (href === currentPage || href.endsWith(currentPage))) {
      a.classList.add('active');
    }
  });

  /* ── Hero 배경 이미지 Ken Burns 효과 ── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const img = new Image();
    img.onload = function () { heroBg.classList.add('loaded'); };
    img.src = 'images/exterior_night.jpg';
  }

  /* ── 섹션 페이드인 IntersectionObserver ── */
  const fadeEls = document.querySelectorAll(
    '.menu-card, .benefit-card, .stat-card, .gallery-item, .menu-item, .contact-card'
  );
  if ('IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity    = '1';
            entry.target.style.transform  = 'translateY(0)';
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      io.observe(el);
    });
  }

  /* ── 메뉴 탭 (menu.html) ── */
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const menuSections = document.querySelectorAll('.menu-section');

  if (tabBtns.length && menuSections.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.dataset.tab;

        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        menuSections.forEach(function (sec) {
          sec.classList.toggle('active', sec.id === target);
        });
      });
    });
  }

  /* ── 숫자 카운트업 애니메이션 (about.html) ── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length && 'IntersectionObserver' in window) {
    const countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          let   current = 0;
          const step    = Math.ceil(target / 60);
          const timer   = setInterval(function () {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString() + suffix;
            if (current >= target) clearInterval(timer);
          }, 20);
          countIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach(function (el) { countIO.observe(el); });
  }

})();
