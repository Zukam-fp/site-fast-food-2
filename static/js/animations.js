/**
 * StreetBurger - Animations avancées
 * Animation GSAP pour des effets visuels avancés
 */

document.addEventListener("DOMContentLoaded", function () {
  // Vérifier si GSAP est chargé
  if (typeof gsap !== "undefined") {
    // Animations du texte de l'en-tête
    gsap.from(".hero-title", {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power3.out",
    });

    gsap.from(".hero-subtitle", {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.from(".hero-cta .btn", {
      duration: 0.8,
      y: 20,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.6,
    });

    // Animation du logo
    gsap.from(".logo", {
      duration: 1,
      x: -30,
      opacity: 0,
      ease: "power2.out",
    });

    // Animation des liens de navigation
    gsap.from(".nav-item", {
      duration: 0.8,
      y: -20,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.2,
    });

    // Animation des sections au scroll
    const sections = document.querySelectorAll(".section");

    sections.forEach((section) => {
      gsap.fromTo(
        section.querySelector(".section-title"),
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Animation des éléments du menu
    gsap.registerEffect({
      name: "menuItemReveal",
      effect: (targets, config) => {
        return gsap.fromTo(
          targets,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: config.duration || 0.8,
            stagger: config.stagger || 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: config.trigger,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      },
      defaults: { duration: 0.8, stagger: 0.1 },
    });

    const menuSection = document.querySelector(".menu-section");
    if (menuSection) {
      gsap.effects.menuItemReveal(".menu-item", {
        trigger: menuSection,
        stagger: 0.1,
      });
    }

    // Animation des témoignages
    const testimonialsSection = document.querySelector(".testimonials");
    if (testimonialsSection) {
      gsap.fromTo(
        ".testimonial-item",
        {
          scale: 0.9,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: testimonialsSection,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Animation du compteur à rebours
    const countdownContainer = document.querySelector(".countdown-container");
    if (countdownContainer) {
      gsap.fromTo(
        ".countdown-item",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: countdownContainer,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Animation de l'icône de flamme
    const flames = document.querySelectorAll(".flame");
    if (flames.length > 0) {
      flames.forEach((flame) => {
        gsap.to(flame, {
          scaleY: 1.1,
          scaleX: 0.9,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });
    }

    // Animation de la fumée
    const smokes = document.querySelectorAll(".smoke-particle");
    if (smokes.length > 0) {
      smokes.forEach((smoke, index) => {
        gsap.to(smoke, {
          y: -50,
          x: index % 2 === 0 ? 10 : -10,
          opacity: 0,
          scale: 1.5,
          duration: 3,
          repeat: -1,
          delay: index * 0.5,
          ease: "power1.out",
        });
      });
    }

    // Animation des boutons
    const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          y: -3,
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          duration: 0.3,
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          y: 0,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
        });
      });
    });

    // Animation des éléments de la galerie
    const galleryItems = document.querySelectorAll(".gallery-item");
    if (galleryItems.length > 0) {
      galleryItems.forEach((item) => {
        gsap.fromTo(
          item,
          {
            scale: 0.9,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );

        // Hover effect
        item.addEventListener("mouseenter", () => {
          gsap.to(item.querySelector(".gallery-img"), {
            scale: 1.1,
            duration: 0.4,
          });

          gsap.to(item.querySelector(".gallery-overlay"), {
            opacity: 1,
            duration: 0.4,
          });
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(item.querySelector(".gallery-img"), {
            scale: 1,
            duration: 0.4,
          });

          gsap.to(item.querySelector(".gallery-overlay"), {
            opacity: 0,
            duration: 0.4,
          });
        });
      });
    }
  } else {
    // Fallback si GSAP n'est pas chargé
    console.log("GSAP not loaded, using CSS animations instead");

    // Ajouter des classes pour les animations CSS
    document.querySelector(".hero-title")?.classList.add("fade-in");
    document.querySelector(".hero-subtitle")?.classList.add("slide-up");
    document.querySelectorAll(".hero-cta .btn").forEach((btn, i) => {
      btn.classList.add("slide-up");
      btn.style.animationDelay = `${i * 0.2 + 0.6}s`;
    });

    // Animation logo et navigation
    document.querySelector(".logo")?.classList.add("slide-right");
    document.querySelectorAll(".nav-item").forEach((item, i) => {
      item.classList.add("slide-up");
      item.style.animationDelay = `${i * 0.1 + 0.2}s`;
    });

    // Utiliser IntersectionObserver pour les animations au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(
        ".reveal-from-bottom, .reveal-from-left, .reveal-from-right, .reveal-scale"
      )
      .forEach((item) => {
        observer.observe(item);
      });
  }
});
