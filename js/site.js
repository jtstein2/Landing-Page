/* =========================================================
   Contact form settings
   ---------------------------------------------------------
   Messages are delivered by Web3Forms (https://web3forms.com),
   so your email address never appears on the site.
   Paste your free access key below.
   ========================================================= */
var WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
var SITE_OWNER = "James Stein";

// Footer year
document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Hairline under the header once the page scrolls
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  function update() { header.classList.toggle("scrolled", window.scrollY > 8); }
  update();
  window.addEventListener("scroll", update, { passive: true });
})();

// Contact form (modal on every page, inline on contact.html)
(function () {
  var uid = 0;

  function formMarkup() {
    var n = ++uid;
    return (
      '<form class="contact-form" novalidate>' +
        '<div class="form-body">' +
          '<div class="field-row">' +
            '<label class="field"><span>Name</span>' +
              '<input name="name" type="text" autocomplete="name" required maxlength="100" id="cf-name-' + n + '"></label>' +
            '<label class="field"><span>Email</span>' +
              '<input name="email" type="email" autocomplete="email" required maxlength="200" id="cf-email-' + n + '"></label>' +
          '</div>' +
          '<div class="field-row">' +
            '<label class="field"><span>I\'m interested in</span>' +
              '<select name="project_type">' +
                '<option>AI integration</option>' +
                '<option>Workflow automation</option>' +
                '<option>A custom application</option>' +
                '<option>Not sure yet, let\'s talk</option>' +
              '</select></label>' +
            '<label class="field"><span>Budget <em class="optional">optional</em></span>' +
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
          '<p class="form-note">Your message comes straight to me. No mailing lists, ever.</p>' +
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
      form.classList.add("is-sending");
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
          form.classList.remove("is-sending");
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

  // Modal for every other "Get in touch" button
  var dialog;
  function buildDialog() {
    dialog = document.createElement("dialog");
    dialog.className = "contact-dialog";
    dialog.setAttribute("aria-labelledby", "contact-title");
    dialog.innerHTML =
      '<button class="dialog-close" type="button" aria-label="Close">&times;</button>' +
      '<span class="eyebrow">Start a project</span>' +
      '<h2 id="contact-title">Let\'s talk.</h2>' +
      '<p class="dialog-lead">Tell me a little about how your team works today and where it gets stuck. I\'ll be in touch.</p>' +
      formMarkup();
    document.body.appendChild(dialog);
    wire(dialog.querySelector("form"));

    dialog.querySelector(".dialog-close").addEventListener("click", close);
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) close(); // click on backdrop
    });
    dialog.addEventListener("close", function () {
      document.documentElement.classList.remove("modal-open");
      // Reset to a fresh form after a successful send
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
