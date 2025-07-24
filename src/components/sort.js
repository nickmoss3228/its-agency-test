// Сортировка
export class Sort {
  constructor(catalog) {
    this.catalog = catalog;
    this.sortContainer = document.querySelector(".dropdown--sort");
    this.currentSort = "price-desc";
    this.sortButton = document.getElementById("sortButton");
    this.sortDropdown = document.getElementById("sortDropdown");
    this.isDropdownOpen = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateSortButton();
  }

  bindEvents() {
    this.sortButton?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // опции сортировки
    this.sortDropdown?.addEventListener("click", (e) => {
      const option = e.target.closest(".dropdown__option");
      if (option) {
        const sortValue = option.textContent.trim();
        this.handleSortSelection(sortValue);
      }
    });

    // закрыть меню кликая вне окна
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown--sort") && this.isDropdownOpen) {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  openDropdown() {
    this.sortContainer?.classList.add("active");
    this.isDropdownOpen = true;
  }

  closeDropdown() {
    this.sortContainer?.classList.remove("active");
    this.isDropdownOpen = false;
  }

    handleSortSelection(sortValue) {
    // Определяем тип сортировки по тексту
    if (sortValue.includes("Сначала дорогие")) {
      this.currentSort = "price-desc";
    } else if (sortValue.includes("Сначала недорогие")) {
      this.currentSort = "price-asc";
    } else if (sortValue.includes("Популярные")) {
      this.currentSort = "popular";
    } else if (sortValue.includes("Новые")) {
      this.currentSort = "new";
    }

    this.updateSortButton();
    this.catalog.applySorting(this.currentSort);
    this.closeDropdown();
  }

  updateSortButton() {
    const sortTexts = {
      "price-desc": "СНАЧАЛА ДОРОГИЕ ↓",
      "price-asc": "СНАЧАЛА НЕДОРОГИЕ ↑",
      popular: "ПОПУЛЯРНЫЕ",
      new: "НОВЫЕ",
    };

    if (this.sortButton) {
      this.sortButton.textContent = sortTexts[this.currentSort];
    }
  }

  sortProducts(products, sortType = this.currentSort) {
    const sorted = [...products];

    switch (sortType) {
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "popular":
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case "new":
        return sorted.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.popularity - a.popularity;
        });
      default:
        return sorted;
    }
  }
}
