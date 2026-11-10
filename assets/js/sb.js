/* SB Movement — progressive enhancements (the site works without JS). */
(function () {
  'use strict';

  /* Header: transparent over the hero, solid after scrolling */
  var header = document.querySelector('[data-site-header]');
  if (header && header.classList.contains('is-over-hero')) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Keep the header solid while the mobile menu is open
    var menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.addEventListener('show.bs.offcanvas', function () { header.classList.add('is-scrolled'); });
      menu.addEventListener('hidden.bs.offcanvas', onScroll);
    }
  }

  /* Close the mobile menu before opening the join modal */
  document.querySelectorAll('.mobile-menu [data-bs-target="#joinModal"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var oc = window.bootstrap && bootstrap.Offcanvas.getInstance(document.getElementById('mobileMenu'));
      if (oc) oc.hide();
    });
  });

  /* Scroll reveal (disabled when the user prefers reduced motion) */
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Forms not connected yet (Phase 3): validate, then say honestly that nothing was sent */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.querySelectorAll('form[data-pending-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = form.querySelector('input[type="email"]');
      var consent = form.querySelector('input[name="consent"]');
      var status = form.querySelector('.form-status');
      var ok = true;

      var setError = function (input, message) {
        var feedback = document.getElementById(input.getAttribute('aria-describedby'));
        input.classList.toggle('is-invalid', !!message);
        input.setAttribute('aria-invalid', message ? 'true' : 'false');
        if (feedback) feedback.textContent = message || '';
        if (message && ok) { input.focus(); ok = false; }
      };

      var value = email.value.trim();
      setError(email, !value ? form.dataset.msgEmailRequired : (!EMAIL.test(value) ? form.dataset.msgEmailInvalid : ''));
      setError(consent, consent.checked ? '' : form.dataset.msgConsentRequired);

      if (!ok) { status.hidden = true; return; }
      status.textContent = form.dataset.msgNotActive;
      status.hidden = false;
    });
  });
})();
