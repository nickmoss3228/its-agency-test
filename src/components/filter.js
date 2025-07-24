// Filter functionality manager
export class Filter {
  constructor(catalog) {
    this.catalog = catalog;
    this.activeFilters = [];
    this.filterButton = document.querySelector(".button--filter");
    this.filterModal = document.getElementById("filterModal");
    this.closeFilterModalBtn = document.getElementById("closeFilterModal");
    this.filterBackdrop = document.querySelector(".filter-modal__backdrop");

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Открыть модальное окно
    this.filterButton?.addEventListener("click", () => {
      this.openModal();
    });

    // Кнопка закрытия модалки
    this.closeFilterModalBtn?.addEventListener("click", () => {
      this.closeModal();
    });

    // Закрыть при нажатии на фон
    this.filterBackdrop?.addEventListener("click", () => {
      this.closeModal();
    });

    // Евентлистенер для кнопок фильтрации
    document.getElementById("applyFilters")?.addEventListener("click", () => {
      this.applyFilters();
    });

    document.getElementById("resetFilters")?.addEventListener("click", () => {
      this.resetFilters();
    });
      
    // Привязываем события к чекбоксам в sidebar
    const sidebarCheckboxes = document.querySelectorAll('.filters-sidebar .toggle-switch input[type="checkbox"]');
    sidebarCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.applySidebarFilters();
      });
    });

    // Привязываем события к чекбоксам в модалке (для реального времени)
    const modalCheckboxes = document.querySelectorAll('.filter-modal .toggle-switch input[type="checkbox"]');
    modalCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.applyModalFilters();
      });
    });
      
    document
      .querySelector(".filter-modal__content")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
      });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.filterModal?.classList.contains("active")
      ) {
        this.closeModal();
      }
    });
  }
    
  // Сайдбар метод
  applySidebarFilters() {
    // Собираем активные фильтры из sidebar чекбоксов
    const activeToggles = Array.from(
      document.querySelectorAll('.filters-sidebar .toggle-switch input[type="checkbox"]:checked')
    );
    this.activeFilters = activeToggles.map((toggle) => toggle.value);

    console.log('Applying sidebar filters:', this.activeFilters);

    this.catalog.applyFilters(this.activeFilters);
    
    // Синхронизируем состояние модальных чекбоксов с sidebar
    this.syncModalWithSidebar();
  }

  // Новый метод для модалки (применение в реальном времени)
  applyModalFilters() {
    // Собираем активные фильтры из модальных чекбоксов
    const activeToggles = Array.from(
      document.querySelectorAll('.filter-modal .toggle-switch input[type="checkbox"]:checked')
    );
    this.activeFilters = activeToggles.map((toggle) => toggle.value);

    console.log('Applying modal filters in real-time:', this.activeFilters);

    this.catalog.applyFilters(this.activeFilters);
    
    // Синхронизируем состояние sidebar с модалкой
    this.syncSidebarWithModal();
  }
    
  // Синхронизация между модалкой мобильного и сайдбаром
  syncModalWithSidebar() {
    const sidebarCheckboxes = document.querySelectorAll('.filters-sidebar .toggle-switch input[type="checkbox"]');
    const modalCheckboxes = document.querySelectorAll('.filter-modal .toggle-switch input[type="checkbox"]');
    
    sidebarCheckboxes.forEach(sidebarCheckbox => {
      const modalCheckbox = Array.from(modalCheckboxes).find(modal => modal.value === sidebarCheckbox.value);
      if (modalCheckbox) {
        modalCheckbox.checked = sidebarCheckbox.checked;
      }
    });
  }

  openModal() {
    this.syncModalWithSidebar();
    this.filterModal?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.filterModal?.classList.remove("active");
    document.body.style.overflow = "";
  }

  applyFilters() {
    // Собираем активные фильтры из переключателей (модалки)
    const activeToggles = Array.from(
      document.querySelectorAll(".filter-modal .toggle-switch input:checked")
    );
    this.activeFilters = activeToggles.map((toggle) => toggle.value);

    console.log('Applying modal filters (via button):', this.activeFilters);  

    this.catalog.applyFilters(this.activeFilters);
    this.syncSidebarWithModal();
    this.closeModal();
  }
    
  // Синхронизация обратная
  syncSidebarWithModal() {
    const sidebarCheckboxes = document.querySelectorAll('.filters-sidebar .toggle-switch input[type="checkbox"]');
    const modalCheckboxes = document.querySelectorAll('.filter-modal .toggle-switch input[type="checkbox"]');
    
    modalCheckboxes.forEach(modalCheckbox => {
      const sidebarCheckbox = Array.from(sidebarCheckboxes).find(sidebar => sidebar.value === modalCheckbox.value);
      if (sidebarCheckbox) {
        sidebarCheckbox.checked = modalCheckbox.checked;
      }
    });
  }

  resetFilters() {
    // Сброс всех переключателей в модалке
    document
      .querySelectorAll('.filter-modal .toggle-switch input[type="checkbox"]')
      .forEach((input) => {
        input.checked = false;
      });

    // Сброс всех переключателей в sidebar
    document
      .querySelectorAll('.filters-sidebar .toggle-switch input[type="checkbox"]')
      .forEach((input) => {
        input.checked = false;
      });

    this.activeFilters = [];
    this.catalog.applyFilters(this.activeFilters);
    this.closeModal(); 
  }

  filterProducts(products, filters = this.activeFilters) {
    if (filters.length === 0) return products;

    return products.filter((product) => {
      return filters.every((filter) => {
        switch (filter) {
          case "new":
            return product.isNew;
          case "inStock":
            return product.inStock;
          case "contract":
            return product.contract;
          case "exclusive":
            return product.exclusive;
          case "sale":
            return product.sale;
          default:
            return false;
        }
      });
    });
  }
}