/* =========================================================
   Contact form settings
   ---------------------------------------------------------
   Messages are delivered by Web3Forms (https://web3forms.com),
   so your email address never appears on the site.
   Paste your free access key below (see README.md).
   ========================================================= */
var WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
var SITE_OWNER = "James Stein";

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var finePointer = window.matchMedia("(pointer: fine)").matches;

// Footer year
document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Local time in DeLand (Eastern)
(function () {
  var clocks = document.querySelectorAll("[data-clock]");
  if (!clocks.length) return;
  var fmt = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York" });
  function tick() {
    var t = fmt.format(new Date());
    clocks.forEach(function (c) { c.textContent = t; });
  }
  tick();
  setInterval(tick, 15000);
})();

// Header border once scrolled
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  function update() { header.classList.toggle("scrolled", window.scrollY > 8); }
  update();
  window.addEventListener("scroll", update, { passive: true });
})();

// Cursor spotlight on the dot grid + glow inside cards
(function () {
  if (!finePointer || reduceMotion) return;
  var root = document.documentElement;
  var raf = 0, mx = 0, my = 0;
  window.addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      root.style.setProperty("--mx", mx + "px");
      root.style.setProperty("--my", my + "px");
      root.style.setProperty("--spot", "1");
    });
  }, { passive: true });
  document.addEventListener("pointerleave", function () { root.style.setProperty("--spot", "0"); });

  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--x", (e.clientX - r.left) + "px");
      card.style.setProperty("--y", (e.clientY - r.top) + "px");
    });
  });
})();

// Workflow console log (example run)
(function () {
  var log = document.querySelector("[data-log]");
  if (!log) return;

  var runs = [
    [
      ["→", "Email received", "“Can you quote 40 units by Friday?”"],
      ["◆", "Classified", "quote_request · confidence 0.98"],
      ["◆", "Drafted quote", "from price sheet · ready for review"],
      ["→", "Synced", "deal created in CRM"],
      ["→", "Notified", "#sales in team chat"],
      ["✓", "Done", "3.2s · 0 manual steps"]
    ],
    [
      ["→", "Form submitted", "new client onboarding"],
      ["◆", "Extracted", "company, contacts, scope"],
      ["→", "Created", "project, folder and task list"],
      ["◆", "Drafted", "welcome email for review"],
      ["✓", "Done", "4.1s · 0 manual steps"]
    ],
    [
      ["→", "Invoice received", "PDF · 3 pages"],
      ["◆", "Read", "vendor, amount, due date"],
      ["◆", "Matched", "PO-1142 · amounts agree"],
      ["→", "Queued", "for approval in invoicing"],
      ["✓", "Done", "2.7s · 0 manual steps"]
    ]
  ];

  var tfmt = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  var MAX = 6;

  function line(row, cls) {
    var el = document.createElement("div");
    el.className = "log-line" + (row[0] === "✓" ? " done" : "") + (cls ? " " + cls : "");
    var parts = [["ts", tfmt.format(new Date())], ["sym", row[0]], ["msg", row[1]], ["detail", row[2]]];
    parts.forEach(function (p) {
      var s = document.createElement("span");
      s.className = p[0];
      s.textContent = p[1];
      el.appendChild(s);
    });
    log.appendChild(el);
    while (log.children.length > MAX) log.removeChild(log.firstChild);
  }

  if (reduceMotion) {
    runs[0].forEach(function (r) { line(r); });
    return;
  }

  var run = 0, step = 0;
  function next() {
    var rows = runs[run];
    line(rows[step]);
    step++;
    if (step >= rows.length) {
      step = 0;
      run = (run + 1) % runs.length;
      setTimeout(next, 2600);
    } else {
      setTimeout(next, 650 + Math.random() * 500);
    }
  }
  setTimeout(next, 900);
})();

// Reading progress on posts
(function () {
  var bar = document.querySelector("[data-progress]");
  if (!bar) return;
  function update() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty("--p", h > 0 ? Math.min(1, window.scrollY / h) : 0);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();

// Contact form (modal on every page, inline on contact.html)
(function () {
  function formMarkup() {
    return (
      '<form class="contact-form" novalidate>' +
        '<div class="form-body">' +
          '<div class="field-row">' +
            '<label class="field"><span>Name</span>' +
              '<input name="name" type="text" autocomplete="name" required maxlength="100"></label>' +
            '<label class="field"><span>Email</span>' +
              '<input name="email" type="email" autocomplete="email" required maxlength="200"></label>' +
          '</div>' +
          '<div class="field-row">' +
            '<label class="field"><span>Interested in</span>' +
              '<select name="project_type">' +
                '<option>AI integration</option>' +
                '<option>Workflow automation</option>' +
                '<option>A custom application</option>' +
                '<option>Not sure yet, let\'s talk</option>' +
              '</select></label>' +
            '<label class="field"><span>Budget <em class="optional">· optional</em></span>' +
              '<select name="budget">' +
                '<option value="">Prefer not to say</option>' +
                '<option>Under $2,500</option>' +
                '<option>$2,500 &ndash; $5,000</option>' +
                '<option>$5,000 &ndash; $10,000</option>' +
                '<option>$10,000+</option>' +
              '</select></label>' +
          '</div>' +
          '<label class="field"><span>What would you like to improve?</span>' +
            '<textarea name="message" rows="5" required maxlength="5000" placeholder="Which process is slowing your team down, and what would better look like?"></textarea></label>' +
          // Honeypot: hidden from people, bots fill it in and get ignored
          '<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<p class="form-error" role="alert" hidden></p>' +
          '<button class="button submit" type="submit"><span class="label">Send message</span> <span class="arrow" aria-hidden="true">&rarr;</span></button>' +
          '<p class="form-note">Goes straight to me &middot; never shared &middot; no mailing lists</p>' +
        '</div>' +
        '<div class="form-success" hidden tabindex="-1">' +
          '<div class="success-mark" aria-hidden="true">&check;</div>' +
          '<h3>Message sent.</h3>' +
          '<p>Thanks<span data-thanks-name></span>. I\'ll read it properly and get back to you soon.</p>' +
        '</div>' +
      '</form>'
    );
  }

  function wire(form) {
    var errorEl = form.querySelector(".form-error");
    var submit = form.querySelector(".submit");
    var label = submit.querySelector(".label");

    function fail(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorEl.hidden = true;

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        var bad = form.querySelector(":invalid");
        if (bad) bad.focus();
        fail("Please fill in your name, a valid email, and a short message.");
        return;
      }

      if (form.botcheck.checked) return; // bot

      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.indexOf("YOUR_") === 0) {
        fail("The contact form isn't connected yet. Please check back soon.");
        return;
      }

      var data = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New enquiry from " + form.name.value.trim() + " via your website",
        from_name: SITE_OWNER + " website",
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        project_type: form.project_type.value,
        budget: form.budget.value || "Not specified",
        message: form.message.value.trim(),
        page: location.pathname
      };

      submit.disabled = true;
      label.textContent = "Sending…";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || "Send failed");
          var first = data.name.split(/\s+/)[0];
          form.querySelector("[data-thanks-name]").textContent = first ? ", " + first : "";
          form.querySelector(".form-body").hidden = true;
          var ok = form.querySelector(".form-success");
          ok.hidden = false;
          ok.focus();
          form.reset();
        })
        .catch(function () {
          fail("Sorry, something went wrong sending your message. Please try again in a moment.");
        })
        .then(function () {
          submit.disabled = false;
          label.textContent = "Send message";
        });
    });
  }

  // Inline form on the contact page
  var mount = document.querySelector("[data-contact-mount]");
  if (mount) {
    mount.innerHTML = formMarkup();
    wire(mount.querySelector("form"));
  }

  // Modal for every other "Start a project" button
  var dialog;
  function buildDialog() {
    dialog = document.createElement("dialog");
    dialog.className = "contact-dialog";
    dialog.setAttribute("aria-labelledby", "contact-title");
    dialog.innerHTML =
      '<div class="dialog-bar"><span>new_project.form</span>' +
        '<button class="dialog-close" type="button" aria-label="Close">ESC</button></div>' +
      '<div class="dialog-inner">' +
        '<p class="kicker"><span class="live-dot" aria-hidden="true"></span>Start a project</p>' +
        '<h2 id="contact-title">Let\'s talk.</h2>' +
        '<p class="dialog-lead">Tell me a little about how your team works today and where it gets stuck. I\'ll be in touch.</p>' +
        formMarkup() +
      '</div>';
    document.body.appendChild(dialog);
    wire(dialog.querySelector("form"));

    dialog.querySelector(".dialog-close").addEventListener("click", close);
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) close(); // click on backdrop
    });
    dialog.addEventListener("close", function () {
      document.documentElement.classList.remove("modal-open");
      var form = dialog.querySelector("form");
      if (!form.querySelector(".form-success").hidden) {
        form.querySelector(".form-success").hidden = true;
        form.querySelector(".form-body").hidden = false;
      }
    });
  }

  function open() {
    if (!dialog) buildDialog();
    dialog.showModal();
    document.documentElement.classList.add("modal-open");
    var first = dialog.querySelector("input[name=name]");
    if (first) first.focus();
  }

  function close() { dialog.close(); }

  document.querySelectorAll("[data-contact]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (mount) {
        e.preventDefault();
        mount.querySelector("input[name=name]").focus();
        return;
      }
      if (typeof HTMLDialogElement === "undefined") return; // old browser: follow link to contact.html
      e.preventDefault();
      open();
    });
  });
})();
