/* Screens in Schools — About page behaviour.
   Survey URL nonce, news rail loop.
   Each init function no-ops if its section is missing, so sections can be removed from index.html freely. */
(function () {
  'use strict';

  // ---- Config -------------------------------------------------------------
  var SURVEY_URL = 'https://screensinschools.org/?utm_source=sis&utm_medium=web&utm_campaign=about-page';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---- Survey URL (one nonce per page load) --------------------------------
  function initSurveyLinks() {
    var nonce = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    var url = SURVEY_URL + (SURVEY_URL.indexOf('?') >= 0 ? '&' : '?') + 'nocache=' + nonce;
    $$('.js-survey-url').forEach(function (a) { a.href = url; });
  }

  // ---- News rail: infinite loop + arrows -----------------------------------
  function initNews() {
    var rail = $('#news-grid');
    if (!rail) return;
    var cards = $$('.news-card', rail);
    if (cards.length < 2) return;
    var n = cards.length;
    // Render the set three times.
    var frag = document.createDocumentFragment();
    cards.forEach(function (c) { var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1; frag.appendChild(k); });
    rail.insertBefore(frag, rail.firstChild);
    frag = document.createDocumentFragment();
    cards.forEach(function (c) { var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1; frag.appendChild(k); });
    rail.appendChild(frag);

    var all = $$('.news-card', rail);
    function setWidth() { return all[n].offsetLeft - all[0].offsetLeft; }     // one set, incl. gaps
    function step() { return all[1].offsetLeft - all[0].offsetLeft; }        // one card + gap

    // Wrap only once scrolling settles (changing scrollLeft mid-way cancels smooth scrolling),
    // and never while a card has focus, so the focused card stays on screen.
    var settle;
    function wrap() {
      if (rail.contains(document.activeElement)) return;
      var set = setWidth();
      if (rail.scrollLeft < set * 0.5) rail.scrollLeft += set;
      else if (rail.scrollLeft > set * 1.5 + 32) rail.scrollLeft -= set;
    }
    rail.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(wrap, 150);
    }, { passive: true });
    rail.addEventListener('focusout', function () { settle = setTimeout(wrap, 150); });

    var prev = $('#news-prev'), next = $('#news-next');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    function go(dir) { rail.scrollBy({ left: dir * step(), behavior: reduce.matches ? 'auto' : 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    // Start on the middle set; re-align after images load (if untouched) and on resize.
    rail.scrollLeft = setWidth();
    var start = rail.scrollLeft;
    window.addEventListener('load', function () { if (rail.scrollLeft === start) rail.scrollLeft = setWidth(); });
    window.addEventListener('resize', function () { rail.scrollLeft = setWidth(); });
  }

  function init() {
    initSurveyLinks();
    initNews();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
