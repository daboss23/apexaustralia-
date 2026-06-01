/* =========================================================
   T-APEX AUSTRALIA — Interaction layer
   Controlled, mechanical, premium. No chaos.
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Nav: stuck state + mobile menu ---- */
  var nav = document.getElementById("nav");
  var burger = document.querySelector(".nav__burger");
  var links = document.querySelector(".nav__links");
  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 30);
    var rail = document.querySelector(".scroll-rail__fill");
    if (rail) {
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      rail.style.width = (p * 100).toFixed(2) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      nav.classList.toggle("is-menu", open);
      burger.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        nav.classList.remove("is-menu");
      }
    });
  }

  /* ---- Reveal on scroll ---- */
  var revs = document.querySelectorAll(".reveal");
  if (revs.length) {
    if ("IntersectionObserver" in window && !reduce) {
      var ro = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            ro.unobserve(en.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      // stagger siblings
      revs.forEach(function (el) {
        if (el.parentElement) {
          var sibs = Array.prototype.indexOf.call(el.parentElement.children, el);
          if (sibs > 0 && sibs < 5 && !el.hasAttribute("data-d")) el.setAttribute("data-d", String(sibs));
        }
        ro.observe(el);
      });
    } else {
      revs.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---- Hero entrance ---- */
  var hero = document.getElementById("hero");
  if (hero) requestAnimationFrame(function () { hero.classList.add("is-in"); });

  /* ---- Assembly: parts lock into place when section enters ---- */
  var assembly = document.getElementById("assembly");
  if (assembly && "IntersectionObserver" in window && !reduce) {
    var ao = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        assembly.classList.toggle("is-assembled", en.isIntersecting && en.intersectionRatio > 0.2);
      });
    }, { threshold: [0, 0.2, 0.5] });
    ao.observe(assembly);
  } else if (assembly) {
    assembly.classList.add("is-assembled");
  }

  /* ---- process line + .is-in for sections ---- */
  var proc = document.querySelectorAll(".process, .data");
  if (proc.length && "IntersectionObserver" in window) {
    var po = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) en.target.classList.add("is-in"); });
    }, { threshold: 0.25 });
    proc.forEach(function (s) { po.observe(s); });
  }

  /* ---- Count-up numbers ---- */
  var counts = document.querySelectorAll("[data-count]");
  if (counts.length && "IntersectionObserver" in window && !reduce) {
    var co = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dec = (target % 1 !== 0) ? 2 : 0;
        var t0 = null, dur = 1400;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          var val = (target * e).toFixed(dec);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(dec) + suffix;
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counts.forEach(function (c) { co.observe(c); });
  }

  /* ---- FAQ accordion ---- */
  var faqQs = document.querySelectorAll(".faq__q");
  faqQs.forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq__item");
      var a = item.querySelector(".faq__a");
      var open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open);
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });

  /* ---- Contact / enquiry form (no backend: premium confirm state) ---- */
  function wireForm(form, status) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      if (status) status.classList.remove("is-error");
      if (name && !name.value.trim()) { fail(status, "Please enter your name."); return; }
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) { fail(status, "Please enter a valid email."); return; }
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.style.opacity = ".6"; }
      if (status) status.textContent = "Transmitting…";
      setTimeout(function () {
        if (status) status.textContent = "Received. The T-APEX team will be in touch within one business day.";
        form.reset();
        if (btn) { btn.disabled = false; btn.style.opacity = "1"; }
      }, 900);
    });
  }
  function fail(status, msg) { if (status) { status.textContent = msg; status.classList.add("is-error"); } }
  wireForm(document.getElementById("contactForm"), document.getElementById("formStatus"));

  /* ---- ORDER / configure flow ---- */
  var config = document.getElementById("config");
  if (config) {
    var opts = config.querySelectorAll(".config__opt");
    var sumName = document.getElementById("sumName");
    var sumPrice = document.getElementById("sumPrice");
    var sumTotal = document.getElementById("sumTotal");
    function selectOpt(opt) {
      opts.forEach(function (o) { o.classList.remove("is-selected"); o.querySelector("input").checked = false; });
      opt.classList.add("is-selected");
      var input = opt.querySelector("input");
      input.checked = true;
      var name = opt.getAttribute("data-name");
      var price = opt.getAttribute("data-price");
      if (sumName) sumName.textContent = name;
      if (sumPrice) sumPrice.textContent = price;
      if (sumTotal) sumTotal.textContent = price;
    }
    opts.forEach(function (opt) {
      opt.addEventListener("click", function () { selectOpt(opt); });
    });
    // preselect first
    if (opts[0]) selectOpt(opts[0]);

    var orderForm = document.getElementById("orderForm");
    var orderMain = document.getElementById("orderMain");
    var orderConfirm = document.getElementById("orderConfirm");
    if (orderForm) {
      orderForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var oName = document.getElementById("oName");
        var oEmail = document.getElementById("oEmail");
        var st = document.getElementById("orderStatus");
        if (st) st.classList.remove("is-error");
        if (oName && !oName.value.trim()) { fail(st, "Please enter your name."); return; }
        if (oEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(oEmail.value)) { fail(st, "Please enter a valid email."); return; }
        var ref = "TA-" + Date.now().toString(36).toUpperCase().slice(-6);
        var refEl = document.getElementById("orderRef");
        if (refEl) refEl.textContent = ref;
        var pkgEl = document.getElementById("confirmPkg");
        if (pkgEl && sumName) pkgEl.textContent = sumName.textContent;
        if (orderMain) orderMain.style.display = "none";
        if (orderConfirm) orderConfirm.classList.add("is-shown");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }
})();
