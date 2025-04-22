/**
 * StreetBurger - Compteur à rebours pour les offres promotionnelles
 * Affiche un compte à rebours pour les offres limitées dans le temps
 */

document.addEventListener("DOMContentLoaded", function () {
  // Sélectionner le conteneur du compte à rebours
  const countdownContainer = document.querySelector(".countdown-container");

  if (!countdownContainer) return; // Sortir si le conteneur n'existe pas

  // Obtenir la date de fin depuis l'attribut data
  const endDateStr = countdownContainer.dataset.endDate;

  if (!endDateStr) {
    console.error("Date de fin non spécifiée pour le compte à rebours");
    return;
  }

  // Convertir la chaîne de date en objet Date
  const endDate = new Date(endDateStr);

  // Vérifier si la date est valide
  if (isNaN(endDate.getTime())) {
    console.error("Format de date invalide pour le compte à rebours");
    return;
  }

  // Éléments d'affichage du compte à rebours
  const daysElement = document.getElementById("countdown-days");
  const hoursElement = document.getElementById("countdown-hours");
  const minutesElement = document.getElementById("countdown-minutes");
  const secondsElement = document.getElementById("countdown-seconds");
  const expiredMessage = document.getElementById("countdown-expired");

  // Fonction pour mettre à jour le compte à rebours
  function updateCountdown() {
    // Date actuelle
    const now = new Date();

    // Différence en millisecondes
    const diff = endDate - now;

    // Si la date est dépassée
    if (diff <= 0) {
      // Masquer le compteur et afficher le message d'expiration
      if (daysElement) daysElement.parentElement.style.display = "none";
      if (hoursElement) hoursElement.parentElement.style.display = "none";
      if (minutesElement) minutesElement.parentElement.style.display = "none";
      if (secondsElement) secondsElement.parentElement.style.display = "none";

      if (expiredMessage) {
        expiredMessage.style.display = "block";
      } else {
        const message = document.createElement("div");
        message.id = "countdown-expired";
        message.className = "countdown-expired";
        message.textContent = "Cette offre a expiré.";
        countdownContainer
          .querySelector(".countdown-content")
          .appendChild(message);
      }

      return;
    }

    // Calcul des jours, heures, minutes et secondes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Mise à jour des éléments HTML
    if (daysElement) daysElement.textContent = days.toString().padStart(2, "0");
    if (hoursElement)
      hoursElement.textContent = hours.toString().padStart(2, "0");
    if (minutesElement)
      minutesElement.textContent = minutes.toString().padStart(2, "0");
    if (secondsElement)
      secondsElement.textContent = seconds.toString().padStart(2, "0");

    // Animation de pulsation pour les secondes
    if (secondsElement) {
      secondsElement.classList.add("pulse");
      setTimeout(() => {
        secondsElement.classList.remove("pulse");
      }, 500);
    }
  }

  // Mettre à jour immédiatement
  updateCountdown();

  // Mettre à jour toutes les secondes
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Nettoyage lorsque l'utilisateur quitte la page
  window.addEventListener("beforeunload", function () {
    clearInterval(countdownInterval);
  });

  // Animation d'entrée du compte à rebours
  if (typeof gsap !== "undefined") {
    gsap.from(".countdown-item", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    });
  } else {
    // Fallback pour les animations sans GSAP
    const countdownItems = document.querySelectorAll(".countdown-item");
    countdownItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";

      setTimeout(() => {
        item.style.transition = "all 0.8s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * 200);
    });
  }
});
