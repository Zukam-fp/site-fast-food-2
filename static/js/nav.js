/**
 * StreetBurger - Navigation
 * Script pour gérer la navigation mobile et desktop
 */
document.addEventListener("DOMContentLoaded", function () {
  // Éléments de navigation
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  // Toggle menu mobile
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active");

      if (mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        setTimeout(() => {
          document.body.style.overflow = "";
        }, 300);
      } else {
        mobileMenu.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  }

  // Fermer le menu au clic sur un lien
  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("active");

        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove("active");
        }

        setTimeout(() => {
          document.body.style.overflow = "";
        }, 300);
      });
    });
  }
});
