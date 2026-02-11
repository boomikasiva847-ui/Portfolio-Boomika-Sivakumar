// Main portfolio interactions
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const yearEl = document.getElementById("year");
  const skillBars = document.querySelectorAll(".skill-progress");
  const statValues = document.querySelectorAll(".stat-value");
  const contactForm = document.querySelector(".contact-form");
  const roleRotatorEl = document.getElementById("role-rotator");

  // ===== Set current year =====
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== Hero role typewriter rotation =====
  if (roleRotatorEl) {
    let roles = [
      "Full‑Stack Developer",
      "Data Analyst",
      "Data Scientist",
      "Backend Developer",
    ];

    const attr = roleRotatorEl.getAttribute("data-roles");
    if (attr) {
      try {
        const parsed = JSON.parse(attr);
        if (Array.isArray(parsed) && parsed.length) {
          roles = parsed;
        }
      } catch {
        // ignore malformed JSON and keep default list
      }
    }

    let roleIndex = 0;
    let charIndex = 0;
    const typingSpeed = 90;
    const eraseSpeed = 45;
    const holdDelay = 1100;

    const type = () => {
      const current = roles[roleIndex];
      if (charIndex <= current.length) {
        roleRotatorEl.textContent = current.slice(0, charIndex);
        charIndex += 1;
        setTimeout(type, typingSpeed);
      } else {
        setTimeout(erase, holdDelay);
      }
    };

    const erase = () => {
      const current = roles[roleIndex];
      if (charIndex >= 0) {
        roleRotatorEl.textContent = current.slice(0, charIndex);
        charIndex -= 1;
        setTimeout(erase, eraseSpeed);
      } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 260);
      }
    };

    type();
  }

  // ===== Mobile nav toggle =====
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Close mobile menu when clicking a nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // ===== Smooth scrolling for internal links =====
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const section = document.querySelector(href);
        if (section) {
          event.preventDefault();
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  });

  // ===== Scroll reveal animations =====
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ===== Skill bar animation =====
  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillBars.forEach((bar) => {
            const value = bar.getAttribute("data-progress");
            if (value) {
              bar.style.width = value + "%";
            }
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ===== Stat counters =====
  const animateCount = (el, target, duration = 1200) => {
    let start = 0;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * (target - start) + start);
      el.textContent = value.toString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toString();
      }
    };

    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statValues.forEach((el) => {
            const targetStr = el.getAttribute("data-count");
            const targetVal = targetStr ? parseInt(targetStr, 10) : 0;
            if (!Number.isNaN(targetVal)) {
              animateCount(el, targetVal);
            }
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  const achievementsSection = document.getElementById("achievements");
  if (achievementsSection) {
    statsObserver.observe(achievementsSection);
  }

  // ===== Active nav link based on scroll =====
  const sections = document.querySelectorAll("main section[id]");

  const setActiveNav = () => {
    let currentId = "";
    const scrollPos = window.scrollY;
    const offset = 140; // approximate nav + breathing room

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const targetId = href.replace("#", "");
      if (targetId === currentId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  // ===== Contact form validation =====
  if (contactForm) {
    const statusEl = contactForm.querySelector(".form-status");

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let isValid = true;
      statusEl.textContent = "";
      statusEl.classList.remove("success", "error");

      const fields = [
        {
          id: "name",
          validate: (value) => value.trim().length >= 2,
          message: "Please enter at least 2 characters.",
        },
        {
          id: "email",
          validate: (value) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
          message: "Please enter a valid email address.",
        },
        {
          id: "message",
          validate: (value) => value.trim().length >= 10,
          message: "Please enter at least 10 characters.",
        },
      ];

      fields.forEach(({ id, validate, message }) => {
        const input = contactForm.querySelector(`#${id}`);
        const errorEl =
          input && input.parentElement
            ? input.parentElement.querySelector(".field-error")
            : null;

        if (!input || !errorEl) return;

        const value = input.value;
        if (!validate(value)) {
          isValid = false;
          errorEl.textContent = message;
        } else {
          errorEl.textContent = "";
        }
      });

      if (!isValid) {
        statusEl.textContent = "Please correct the highlighted fields.";
        statusEl.classList.add("error");
        return;
      }

      // Fake "success" without actual backend
      statusEl.textContent = "Thank you! Your message has been validated.";
      statusEl.classList.add("success");
      contactForm.reset();
    });
  }
});


