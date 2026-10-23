
/* =========================================
   MICHAEL DJOSSOU — PORTFOLIO INTERACTIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Sélecteurs principaux
  const loader = document.getElementById("loader");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const themeToggle = document.getElementById("themeToggle");
  const typedRole = document.getElementById("typedRole");
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. ÉCRAN DE CHARGEMENT
  function hideLoader() {
    if (!loader) return;

    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.remove();
    }, 600);
  }

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });

    // Évite de conserver l'écran de chargement trop longtemps.
    window.setTimeout(hideLoader, 1800);
  }

  // 2. MENU MOBILE
  function closeMenu() {
    navMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Ouvrir le menu" : "Fermer le menu"
    );

    navMenu.classList.toggle("is-open", !isOpen);
  });

  navMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      navMenu.classList.contains("is-open") &&
      !navMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // 3. THÈME CLAIR / SOMBRE
  const root = document.documentElement;

  function updateThemeButton() {
    const isLight = root.dataset.theme === "light";

    themeToggle.textContent = isLight ? "☾" : "☼";
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Passer au thème sombre" : "Passer au thème clair"
    );
  }

  try {
    const savedTheme = localStorage.getItem("md-portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      root.dataset.theme = savedTheme;
    }
  } catch (error) {
    // Le site reste utilisable si le stockage est indisponible.
  }

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    root.dataset.theme =
      root.dataset.theme === "dark" ? "light" : "dark";

    updateThemeButton();

    try {
      localStorage.setItem("md-portfolio-theme", root.dataset.theme);
    } catch (error) {
      // Le changement de thème fonctionne même sans stockage.
    }
  });

  // 4. ANIMATIONS AU DÉFILEMENT
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // 5. EFFET DE TEXTE DYNAMIQUE
  if (typedRole && !reducedMotion) {
    const roles = [
      "génie civil",
      "structures",
      "infrastructures",
      "conception technique"
    ];

    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (deleting) {
        characterIndex--;
      } else {
        characterIndex++;
      }

      typedRole.textContent = currentRole.slice(0, characterIndex);

      let delay = deleting ? 45 : 85;

      if (characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      } else if (characterIndex >= roles[roleIndex].length) {
        deleting = true;
        delay = 1500;
      }

      window.setTimeout(typeEffect, delay);
    }

    window.setTimeout(typeEffect, 1800);
  }

  // 6. NAVIGATION ACTIVE
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = navMenu.querySelectorAll('a[href^="#"]');

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            if (isCurrent) {
              link.classList.add("active");
              link.setAttribute("aria-current", "location");
            } else {
              link.classList.remove("active");
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // 7. ANNÉE AUTOMATIQUE DANS LE FOOTER
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 8. FORMULAIRE DE CONTACT
  // Version statique : prépare un e-mail, sans backend.
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);

    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();

    if (!name || !email || !message) {
      formFeedback.textContent =
        "Merci de remplir tous les champs.";
      return;
    }

    // À remplacer par ta véritable adresse e-mail.
    const recipient = "ton.email@example.com";

    const subject = encodeURIComponent(
      `Prise de contact — Portfolio de Michael Djossou`
    );

    const body = encodeURIComponent(
      `Bonjour Michael,\n\n` +
      `Nom : ${name}\n` +
      `E-mail : ${email}\n\n` +
      `Message :\n${message}\n\n` +
      `Envoyé depuis ton portfolio.`
    );

    formFeedback.textContent =
      "Ouverture de votre application e-mail...";

    window.location.href =
      `mailto:${recipient}?subject=${subject}&body=${body}`;
  });

  // 9. ANNÉE ET EXPÉRIENCE : FIN
  console.info("Portfolio de Michael Djossou initialisé.");
});
