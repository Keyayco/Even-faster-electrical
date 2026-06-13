const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const serviceCards = document.querySelectorAll("[data-expandable]");
const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");
const galleryCards = document.querySelectorAll(".gallery-card");
const lightbox = document.querySelector(".lightbox");
const lightboxMedia = document.querySelector(".lightbox-media");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const faqItems = document.querySelectorAll(".faq-item");
const sliderTrack = document.querySelector("[data-slider-track]");
const slides = sliderTrack ? sliderTrack.querySelectorAll(".testimonial-card") : [];
const sliderDotsContainer = document.querySelector(".slider-dots");
const sliderControls = document.querySelectorAll("[data-slider]");
const contactForm = document.querySelector(".contact-form");
const currentYear = document.getElementById("year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentSlide = 0;
let sliderInterval;

const addRevealDelays = () => {
  const revealGroups = [
    document.querySelectorAll(".trust-card"),
    document.querySelectorAll(".service-card"),
    document.querySelectorAll(".reason-card"),
    document.querySelectorAll(".process-step"),
    document.querySelectorAll(".faq-item"),
    document.querySelectorAll(".gallery-item")
  ];

  revealGroups.forEach((group) => {
    group.forEach((item, index) => {
      item.classList.add(`reveal-delay-${Math.min(index % 4, 3)}`);
    });
  });
};

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("open");
};

const openMenu = () => {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", "true");
  navMenu.classList.add("open");
};

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!navMenu || !navToggle) return;
  const clickedInside = navMenu.contains(event.target) || navToggle.contains(event.target);
  if (!clickedInside) {
    closeMenu();
  }
});

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || "";
  const duration = reduceMotion ? 0 : 1400;

  if (!target) return;

  if (duration === 0) {
    element.textContent = `${target}${suffix}`;
    return;
  }

  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("counter")) {
        animateCounter(entry.target);
      }

      if (entry.target.querySelectorAll) {
        entry.target.querySelectorAll(".counter").forEach((counter) => {
          if (!counter.dataset.counted) {
            counter.dataset.counted = "true";
            animateCounter(counter);
          }
        });
      }

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
counters.forEach((counter) => {
  if (!counter.dataset.counted) {
    counter.dataset.counted = "false";
  }
});

serviceCards.forEach((card) => {
  const trigger = card.querySelector(".text-button");
  if (!trigger) return;

  trigger.addEventListener("click", () => {
    const expanded = card.classList.toggle("expanded");
    trigger.textContent = expanded ? "Show less" : "Learn more";
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const category = item.dataset.category || "";
      const matches = filter === "all" || category.includes(filter);
      item.classList.toggle("hidden", !matches);
    });
  });
});

const openLightbox = (card) => {
  if (!lightbox || !lightboxMedia || !lightboxCaption) return;

  const media = card.querySelector(".gallery-media");
  if (!media) return;

  lightboxMedia.style.background = getComputedStyle(media).background;
  lightboxCaption.textContent = card.dataset.title || "Project preview";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
};

galleryCards.forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeMenu();
  }
});

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  if (!button) return;

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((entry) => {
      entry.classList.remove("open");
      const entryButton = entry.querySelector(".faq-question");
      if (entryButton) {
        entryButton.setAttribute("aria-expanded", "false");
      }
    });

    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const renderSliderDots = () => {
  if (!sliderDotsContainer || !slides.length) return;

  sliderDotsContainer.innerHTML = "";

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `slider-dot${index === currentSlide ? " active" : ""}`;
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateSlider();
      restartSlider();
    });
    sliderDotsContainer.appendChild(dot);
  });
};

const updateSlider = () => {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });

  const dots = sliderDotsContainer ? sliderDotsContainer.querySelectorAll(".slider-dot") : [];
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
};

const goToSlide = (direction) => {
  if (!slides.length) return;
  currentSlide =
    direction === "next"
      ? (currentSlide + 1) % slides.length
      : (currentSlide - 1 + slides.length) % slides.length;
  updateSlider();
};

const startSlider = () => {
  if (!slides.length || reduceMotion) return;
  sliderInterval = window.setInterval(() => {
    goToSlide("next");
  }, 5000);
};

const restartSlider = () => {
  window.clearInterval(sliderInterval);
  startSlider();
};

sliderControls.forEach((control) => {
  control.addEventListener("click", () => {
    goToSlide(control.dataset.slider);
    restartSlider();
  });
});

if (slides.length) {
  renderSliderDots();
  updateSlider();
  startSlider();
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = (data.get("name") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const service = (data.get("service") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const emailBody = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService Required: ${service}\n\nMessage:\n${message}`
    );
    const subject = encodeURIComponent(`Quote Request: ${service || "General Enquiry"}`);
    const mailtoUrl = `mailto:evenfaster.services@gmail.com?subject=${subject}&body=${emailBody}`;

    window.location.href = mailtoUrl;
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear().toString();
}

if (!reduceMotion) {
  body.classList.add("cursor-glow");

  window.addEventListener(
    "pointermove",
    (event) => {
      body.style.setProperty("--cursor-x", `${event.clientX}px`);
      body.style.setProperty("--cursor-y", `${event.clientY}px`);
    },
    { passive: true }
  );
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeMenu();
  }
});

addRevealDelays();
updateHeaderState();
