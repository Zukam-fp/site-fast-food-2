/**
 * StreetBurger - Script Principal
 * Fonctionnalités générales du site
 */

document.addEventListener("DOMContentLoaded", function () {
  // Éléments du DOM fréquemment utilisés
  const header = document.querySelector(".header");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const flashMessages = document.querySelector(".flash-messages");

  // ======== NAVIGATION MOBILE ========
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      // Toggle le menu mobile
      mobileMenu.classList.toggle("active");
      this.classList.toggle("active");

      // Empêche le défilement du body quand le menu est ouvert
      if (mobileMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }

  // Fermer le menu mobile lors du clic sur un lien
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active");
          document.body.style.overflow = "";

          if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove("active");
          }
        }
      });
    });
  }

  // ======== HEADER SCROLLÉ ========
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  });

  // ======== ANIMATIONS AU SCROLL ========
  const animateElements = document.querySelectorAll(
    ".reveal-from-bottom, .reveal-from-left, .reveal-from-right, .reveal-scale"
  );

  const animateOnScroll = function () {
    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Animer lorsque l'élément est visible dans le viewport
      if (elementTop < windowHeight * 0.85) {
        element.classList.add("reveal-active");
      }
    });
  };

  // Animer les éléments visibles au chargement initial
  animateOnScroll();

  // Animer au défilement
  window.addEventListener("scroll", animateOnScroll);

  // ======== MASQUER LES MESSAGES FLASH ========
  if (flashMessages) {
    document.querySelectorAll(".flash").forEach((flash) => {
      setTimeout(() => {
        flash.style.opacity = "0";
        flash.style.transform = "translateX(50px)";
        setTimeout(() => {
          flash.remove();
        }, 300);
      }, 5000);
    });
  }

  // ======== FILTRE DU MENU ========
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuItems = document.querySelectorAll(".menu-item");

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Retirer la classe active de tous les boutons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Ajouter la classe active au bouton cliqué
        button.classList.add("active");

        const category = button.dataset.filter;

        // Filtrer les éléments du menu
        menuItems.forEach((item) => {
          if (category === "all" || item.dataset.category === category) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // ======== GALLERIE D'IMAGES AVEC LIGHTBOX ========
  const galleryItems = document.querySelectorAll(".gallery-item");
  const body = document.body;

  if (galleryItems.length > 0) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", function () {
        const imgSrc = this.querySelector("img").src;
        const caption = this.querySelector(".gallery-caption").textContent;

        // Créer le lightbox
        const lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.innerHTML = `
                  <div class="lightbox-content">
                      <button class="lightbox-close">&times;</button>
                      <img src="${imgSrc}" alt="${caption}" class="lightbox-img">
                      <div class="lightbox-caption">${caption}</div>
                  </div>
              `;

        // Ajouter le lightbox au body
        body.appendChild(lightbox);

        // Empêcher le défilement du corps de la page
        body.style.overflow = "hidden";

        // Animation d'entrée
        setTimeout(() => {
          lightbox.style.opacity = "1";
        }, 10);

        // Fermer le lightbox au clic
        lightbox.addEventListener("click", function (e) {
          if (
            e.target === lightbox ||
            e.target.classList.contains("lightbox-close")
          ) {
            lightbox.style.opacity = "0";
            setTimeout(() => {
              body.removeChild(lightbox);
              body.style.overflow = "";
            }, 300);
          }
        });
      });
    });
  }

  // ======== FORMULAIRE DE RÉSERVATION ========
  const reservationForm = document.getElementById("reservationForm");

  if (reservationForm) {
    // Définir la date minimum (aujourd'hui) pour le sélecteur de date
    const dateInput = document.getElementById("date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }
  }

  // ======== FORMULAIRE DE TÉMOIGNAGE ========
  const testimonialForm = document.getElementById("testimonialForm");

  if (testimonialForm) {
    const ratingInputs = testimonialForm.querySelectorAll(
      'input[name="rating"]'
    );
    const ratingLabels = testimonialForm.querySelectorAll(".rating-label");

    // Mettre à jour les étoiles au clic
    ratingInputs.forEach((input, index) => {
      input.addEventListener("change", () => {
        ratingLabels.forEach((label, labelIndex) => {
          if (labelIndex <= index) {
            label.classList.add("active");
          } else {
            label.classList.remove("active");
          }
        });
      });
    });
  }

  // ======== ANIMATION DE FUMÉE ET FLAMME ========
  const smokeContainers = document.querySelectorAll(".smoke-container");

  if (smokeContainers.length > 0) {
    smokeContainers.forEach((container) => {
      // Créer des particules de fumée dynamiquement
      for (let i = 0; i < 4; i++) {
        const smoke = document.createElement("div");
        smoke.className = `smoke-particle smoke-${i + 1}`;
        container.appendChild(smoke);
      }
    });
  }
});
