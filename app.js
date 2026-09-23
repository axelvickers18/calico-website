/* =============================================================================
   Calico Websites, app.js
   -----------------------------------------------------------------------------
   Everything you'll ever need to edit lives in CONFIG below.
   The page works with JavaScript off; this file adds the Formspree
   submission, the thank-you state, and the scroll fade-in.
   Work cards are plain HTML in index.html. Copy a block to add one.
   ========================================================================== */

'use strict';

var CONFIG = {

  /* ---------------------------------------------------------------------
     APPLICATION FORM → Formspree
     Applications post to the endpoint below and arrive in the Formspree
     inbox for this form, and by email. To point them somewhere else, swap
     this endpoint and the matching action="" on the form in apply.html.
     --------------------------------------------------------------------- */
  form: {
    endpoint: 'https://formspree.io/f/xvkgryrv',
    subject: 'New site application (Calico Websites)',
    messages: {
      notConnected: 'The form isn’t switched on yet. Try again soon.',   /* only shown if the endpoint above is cleared */
      sending: 'Sending…',
      error: 'That didn’t send. Check your connection and tap Send again.'
    }
  },

  /* Scroll fade-in. Automatically disabled when the visitor asks for
     reduced motion. */
  reveal: {
    enabled: true,
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px'
  }
};

/* ========================================================================= */

(function () {

  var doc = document;
  var root = doc.documentElement;

  /* Arm the reveal styles only now that JS is confirmed running, so content
     is never left invisible if this file fails to load. */
  root.classList.add('js');

  var prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------------
     Application form
     ----------------------------------------------------------------------- */
  function endpointIsLive() {
    var url = CONFIG.form.endpoint || '';
    return url.indexOf('formspree.io/f/') > -1 && url.indexOf('YOUR_FORM_ID') === -1;
  }

  function setupForm() {
    var form = doc.querySelector('[data-apply-form]');
    if (!form) return;

    var status = form.querySelector('[data-form-status]');
    var subject = form.querySelector('[data-form-subject]');
    var done = doc.querySelector('[data-form-done]');

    if (subject) subject.value = CONFIG.form.subject;
    if (endpointIsLive()) form.setAttribute('action', CONFIG.form.endpoint);
    if (status) status.setAttribute('tabindex', '-1');

    /* Swap the form for the thank-you panel, and move focus to it so it is
       announced rather than silently replacing what was on screen. */
    function showDone() {
      if (!done) {
        say('Application sent! I’ll get back to you within 2 days.', 'success');
        return;
      }
      form.hidden = true;
      done.hidden = false;
      done.classList.add('is-visible');
      done.focus();
    }

    function say(message, state) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status' + (state ? ' is-' + state : '');
    }

    form.addEventListener('submit', function (event) {

      /* Not wired up yet. Say so rather than posting into the void. */
      if (!endpointIsLive()) {
        event.preventDefault();
        say(CONFIG.form.messages.notConnected, 'error');
        if (status) status.focus();
        return;
      }

      /* No fetch? Let the browser post normally. Formspree will handle it
         and show its own thank-you page. */
      if (typeof window.fetch !== 'function' || typeof window.FormData !== 'function') {
        return;
      }

      event.preventDefault();
      form.setAttribute('aria-busy', 'true');
      say(CONFIG.form.messages.sending);

      window.fetch(CONFIG.form.endpoint, {
        method: 'POST',
        body: new window.FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('Request failed: ' + response.status);
        form.reset();
        say('');
        showDone();
      }).catch(function () {
        say(CONFIG.form.messages.error, 'error');
        form.removeAttribute('aria-busy');
        if (status) status.focus();
      });
    });
  }

  /* -----------------------------------------------------------------------
     Footer year
     ----------------------------------------------------------------------- */
  function setYear() {
    var slots = doc.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());

    for (var i = 0; i < slots.length; i++) {
      slots[i].textContent = year;
    }
  }

  /* -----------------------------------------------------------------------
     Scroll fade-in
     ----------------------------------------------------------------------- */
  function revealOnScroll() {
    var items = doc.querySelectorAll('.reveal');
    var i;

    var skip =
      !CONFIG.reveal.enabled ||
      prefersReducedMotion ||
      typeof window.IntersectionObserver !== 'function';

    if (skip) {
      for (i = 0; i < items.length; i++) items[i].classList.add('is-visible');
      return;
    }

    var observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: CONFIG.reveal.threshold,
      rootMargin: CONFIG.reveal.rootMargin
    });

    for (i = 0; i < items.length; i++) observer.observe(items[i]);
  }

  /* -----------------------------------------------------------------------
     Go
     ----------------------------------------------------------------------- */
  function init() {
    setupForm();
    setYear();
    revealOnScroll();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
