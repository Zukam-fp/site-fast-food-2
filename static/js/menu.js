/**
 * StreetBurger - Gestion du menu
 * Filtrage et animation des éléments du menu
 */

document.addEventListener("DOMContentLoaded", function () {
  // Sélection des éléments du DOM
  const filterBtns = document.querySelectorAll(".custom-filter-btn");
  const menuItems = document.querySelectorAll(".menu-item");
  const searchInput = document.getElementById("menu-search");

  // Variables pour la gestion des filtres
  let currentCategory = "all";
  let searchQuery = "";

  // Fonction pour filtrer les éléments du menu
  const filterMenuItems = () => {
    menuItems.forEach((item) => {
      const category = item.dataset.category;
      const itemTitle = item.querySelector(".menu-item-title");
      const itemDesc = item.querySelector(".menu-item-desc");

      if (!itemTitle || !itemDesc) return; // Éviter les erreurs si l'élément n'existe pas

      const itemName = itemTitle.textContent.toLowerCase();
      const itemDescription = itemDesc.textContent.toLowerCase();

      // Vérifier si l'élément correspond à la catégorie et à la recherche
      const matchesCategory =
        currentCategory === "all" || category === currentCategory;
      const matchesSearch =
        searchQuery === "" ||
        itemName.includes(searchQuery) ||
        itemDescription.includes(searchQuery);

      // Afficher ou masquer l'élément en fonction des critères
      if (matchesCategory && matchesSearch) {
        item.classList.remove("hidden");
        // Reset styles
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      } else {
        item.classList.add("hidden");
      }
    });

    // Vérifier s'il y a des résultats à afficher
    const visibleItems = document.querySelectorAll(".menu-item:not(.hidden)");
    const noResultsEl = document.querySelector(".no-results");
    const menuContainer = document.querySelector(".menu-grid");

    if (!menuContainer) return; // Éviter les erreurs si la grille n'existe pas

    if (visibleItems.length === 0) {
      if (!noResultsEl) {
        const noResults = document.createElement("div");
        noResults.className = "no-results text-center py-4";
        noResults.innerHTML = `<p>Aucun résultat ne correspond à votre recherche "${searchQuery}"</p>`;
        menuContainer.appendChild(noResults);
      }
    } else if (noResultsEl) {
      noResultsEl.remove();
    }
  };

  // Gestionnaire d'événement pour les boutons de filtre
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Retirer la classe active de tous les boutons
        filterBtns.forEach((el) => {
          el.classList.remove("custom-active");
        });

        // Ajouter la classe active au bouton cliqué
        this.classList.add("custom-active");

        // Mettre à jour la catégorie actuelle
        currentCategory = this.dataset.filter;

        // Filtrer les éléments
        filterMenuItems();
      });
    });
  }

  // Gestionnaire d'événement pour la recherche
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchQuery = this.value.toLowerCase().trim();
      filterMenuItems();
    });
  }

  // Fonction pour trier les éléments par prix
  const sortByPrice = (ascending = true) => {
    const menuGrid = document.querySelector(".menu-grid");
    if (!menuGrid) return;

    const items = Array.from(menuItems);

    items.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);

      return ascending ? priceA - priceB : priceB - priceA;
    });

    // Réorganiser les éléments dans le DOM
    items.forEach((item) => {
      menuGrid.appendChild(item);
    });
  };

  // Gestionnaire d'événement pour le tri par prix
  const sortPriceBtn = document.getElementById("sort-price");
  if (sortPriceBtn) {
    let ascending = true;

    sortPriceBtn.addEventListener("click", function () {
      ascending = !ascending;
      sortByPrice(ascending);

      // Changer l'icône du bouton
      const icon = this.querySelector("i");
      if (ascending) {
        icon.className = "fas fa-sort-amount-up";
        this.setAttribute("title", "Trier par prix croissant");
      } else {
        icon.className = "fas fa-sort-amount-down";
        this.setAttribute("title", "Trier par prix décroissant");
      }
    });
  }

  // Fonction pour afficher les détails d'un élément du menu
  const setupMenuDetails = () => {
    menuItems.forEach((item) => {
      item.addEventListener("click", function () {
        const title = this.querySelector(".menu-item-title").textContent;
        const desc = this.querySelector(".menu-item-desc").textContent;
        const price = this.querySelector(".menu-item-price").textContent;
        const imgSrc = this.querySelector(".menu-item-img").src;
        const isVegetarian = this.classList.contains("vegetarian");
        const isSpicy = this.classList.contains("spicy");

        // Créer la modal pour les détails
        const modal = document.createElement("div");
        modal.className = "menu-modal";
        modal.innerHTML = `
                  <div class="menu-modal-content">
                      <button class="modal-close">&times;</button>
                      <div class="modal-img">
                          <img src="${imgSrc}" alt="${title}">
                      </div>
                      <div class="modal-details">
                          <h3>${title}</h3>
                          <div class="modal-price">${price}</div>
                          <p>${desc}</p>
                          <div class="modal-tags">
                              ${
                                isVegetarian
                                  ? '<span class="tag tag-vegetarian">Végétarien</span>'
                                  : ""
                              }
                              ${
                                isSpicy
                                  ? '<span class="tag tag-spicy">Épicé</span>'
                                  : ""
                              }
                          </div>
                          <button class="btn btn-primary mt-3">Ajouter au panier</button>
                      </div>
                  </div>
              `;

        // Ajouter la modal au body
        document.body.appendChild(modal);
        document.body.style.overflow = "hidden";

        // Animation d'entrée
        setTimeout(() => {
          modal.classList.add("active");
        }, 10);

        // Gestionnaire pour fermer la modal
        const closeBtn = modal.querySelector(".modal-close");
        closeBtn.addEventListener("click", () => {
          modal.classList.remove("active");
          setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = "";
          }, 300);
        });

        // Fermer en cliquant en dehors du contenu
        modal.addEventListener("click", function (e) {
          if (e.target === modal) {
            modal.classList.remove("active");
            setTimeout(() => {
              document.body.removeChild(modal);
              document.body.style.overflow = "";
            }, 300);
          }
        });
      });
    });
  };

  // Appliquer des effets visuels aux éléments du menu
  const applyMenuEffects = () => {
    menuItems.forEach((item) => {
      // Effet de survol
      item.addEventListener("mouseenter", function () {
        const img = this.querySelector(".menu-item-img");
        if (img) {
          img.style.transform = "scale(1.05)";
        }
      });

      item.addEventListener("mouseleave", function () {
        const img = this.querySelector(".menu-item-img");
        if (img) {
          img.style.transform = "scale(1)";
        }
      });
    });
  };

  // Initialiser les effets du menu
  if (menuItems.length > 0) {
    applyMenuEffects();
    // setupMenuDetails(); // Commenté car non implémenté dans le HTML actuel

    // Initialiser correctement la catégorie actuelle au chargement
    const activeButton = document.querySelector(
      ".custom-filter-btn.custom-active"
    );
    if (activeButton) {
      // Initialiser la catégorie actuelle
      currentCategory = activeButton.dataset.filter;
    } else if (filterBtns.length > 0) {
      // Si aucun bouton n'est actif, activer le premier par défaut
      filterBtns[0].classList.add("custom-active");
      currentCategory = filterBtns[0].dataset.filter;
    }

    // Exécuter un filtrage initial pour s'assurer que tout est correctement affiché
    filterMenuItems();
  }
});
