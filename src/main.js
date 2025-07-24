// Main initialization file
import { ProductCatalog } from "./components/catalog.js";
import "./components/cart.js";

// Initialize catalog when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {  // Добавьте async для await
  window.catalog = new ProductCatalog();
  await window.catalog.init();  // Теперь init() вызывается здесь асинхронно
});

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.slider', {  // Ваш .slider как контейнер
    // Основные опции
    slidesPerView: 1,  // Один слайд за раз
    spaceBetween: 0,   // Без пробелов между слайдами
    loop: true,        // Бесконечный цикл
    lazy: true,        // Lazy-loading изображений

    // Автопрокрутка (аналог вашей)
    autoplay: {
      delay: 3000,     // 3 секунды
      disableOnInteraction: false,  // Не останавливать при взаимодействии (но пауза на hover встроена)
    },

    // Пагинация (точки)
    pagination: {
      el: '.swiper-pagination',  // Ваш .slider__indicators
      clickable: true,           // Кликабельные
      bulletClass: 'swiper-pagination-bullet',  // Для ваших стилей
      bulletActiveClass: 'swiper-pagination-bullet-active',
    },

    // Навигация (стрелки)
    navigation: {
      nextEl: '.swiper-button-next',  // Ваша .slider__arrow--next
      prevEl: '.swiper-button-prev',  // Ваша .slider__arrow--prev
    },
  });
});

// Добавьте этот код в ваш основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const dropdown = document.querySelector('.header__dropdown');
    
    if (menuToggle && dropdown) {
        menuToggle.addEventListener('click', function() {
            // Переключаем класс active для кнопки (анимация иконки)
            menuToggle.classList.toggle('active');
            
            // Переключаем класс active для выпадающего меню
            dropdown.classList.toggle('active');
        });
    }
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !dropdown.contains(e.target)) {
            menuToggle.classList.remove('active');
            dropdown.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('filterModal');
  const content = modal.querySelector('.filter-modal__content');
  const handle = modal.querySelector('.filter-modal__handle');
  const backdrop = modal.querySelector('.filter-modal__backdrop');

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  // Функции открытия/закрытия — используем методы из экземпляра Filter (доступен через window.catalog)
  const openModal = () => {
    // Сброс inline-стилей перед открытием
    content.style.removeProperty('transform');
    content.style.removeProperty('transition');
    window.catalog.filterManager.openModal(); // Исправлено: вызов через window.catalog
  };

  const closeModal = () => {
    window.catalog.filterManager.closeModal(); // Исправлено: вызов через window.catalog
    // Сброс inline-стилей после анимации
    setTimeout(() => {
      content.style.removeProperty('transform');
      content.style.removeProperty('transition');
    }, 300); // Совпадает с вашим transition time
  };

  // Обработчики для свайпа
  const startDrag = (e) => {
    if (!modal.classList.contains('active')) return;
    // Игнорируем, если тач на input или label (чтобы чекбоксы работали)
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'LABEL') return;
    startY = e.touches[0].clientY;
    isDragging = true;
    content.style.transition = 'none'; // Отключаем анимацию во время драга
  };

  const drag = (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    if (deltaY > 0) { // Только downward swipe
      content.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    content.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Восстанавливаем анимацию

    const deltaY = currentY - startY;
    if (deltaY > 100) { // Порог для закрытия (можно изменить)
      closeModal();
    } else {
      content.style.transform = 'translateY(0)'; // Возврат в позицию
      // Сброс после анимации возврата
      setTimeout(() => {
        content.style.removeProperty('transform');
        content.style.removeProperty('transition');
      }, 300);
    }
  };

  // Прикрепляем события только к handle (не к content, чтобы избежать конфликтов с чекбоксами)
  handle.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', endDrag);

  // Закрытие по клику на backdrop (ваше уже есть, но на всякий случай)
  backdrop.addEventListener('click', closeModal);

  // Закрытие по кнопке (ваше уже есть, но на всякий случай)
  const closeButton = document.getElementById('closeFilterModal');
  closeButton.addEventListener('click', closeModal);

  // Открытие по кнопке "ФИЛЬТРЫ" (ваше уже есть в классе, но если нужно отдельно)
  const openButton = document.querySelector('.button--filter');
  if (openButton) {
    openButton.addEventListener('click', openModal);
  }
});

// class ProductCatalog {
//   constructor() {
//     this.products = [...mockProducts];
//     this.filteredProducts = [...this.products];
//     this.currentSort = 'price-desc';
//     this.activeFilters = [];

//     this.productsList = document.getElementById('productsList');
//     this.sortButton = document.getElementById('sortButton');
//     this.sortDropdown = document.getElementById('sortDropdown');
//     this.filterButton = document.querySelector('.button--filter');
//     this.filterModal = document.getElementById('filterModal');
//     this.closeFilterModalBtn = document.getElementById('closeFilterModal');
//     this.filterBackdrop = document.querySelector('.filter-modal__backdrop');

//     this.init();
//   }

//   init() {
//     this.bindEvents();
//     this.renderProducts();
//   }

//   bindEvents() {
//     // Sort dropdown
//     this.sortButton?.addEventListener('click', (e) => {
//       e.stopPropagation();
//       this.toggleSortDropdown();
//     });

//     // Sort options
//     this.sortDropdown?.addEventListener('click', (e) => {
//       if (e.target.closest('.dropdown__option')) {
//         const option = e.target.closest('.dropdown__option');
//         const sortValue = option.textContent.trim();

//         // Определяем тип сортировки по тексту
//         if (sortValue.includes('дорогие')) {
//           this.currentSort = 'price-desc';
//         } else if (sortValue.includes('недорогие')) {
//           this.currentSort = 'price-asc';
//         } else if (sortValue.includes('Популярные')) {
//           this.currentSort = 'popular';
//         } else if (sortValue.includes('Новые')) {
//           this.currentSort = 'new';
//         }

//         this.updateSortButton();
//         this.sortProducts();
//         this.renderProducts();
//         this.closeSortDropdown();
//       }
//     });

//     // Filter modal
//     this.filterButton?.addEventListener('click', () => {
//       this.openFilterModal();
//     });

//     // ИСПРАВЛЕНО: Обработчик для кнопки закрытия
//     this.closeFilterModalBtn?.addEventListener('click', () => {
//       this.closeFilterModal();
//     });

//     // ИСПРАВЛЕНО: Обработчик для клика по фону
//     this.filterBackdrop?.addEventListener('click', () => {
//       this.closeFilterModal();
//     });

//     // Filter actions
//     document.getElementById('applyFilters')?.addEventListener('click', () => {
//       this.applyFilters();
//     });

//     document.getElementById('resetFilters')?.addEventListener('click', () => {
//       this.resetFilters();
//     });

//     // Close sort dropdown on outside click
//     document.addEventListener('click', (e) => {
//       if (!e.target.closest('.dropdown--sort')) {
//         this.closeSortDropdown();
//       }
//     });

//     // Prevent modal close when clicking inside content
//     document.querySelector('.filter-modal__content')?.addEventListener('click', (e) => {
//       e.stopPropagation();
//     });

//     // ДОБАВЛЕНО: Закрытие по Escape
//     document.addEventListener('keydown', (e) => {
//       if (e.key === 'Escape' && this.filterModal?.classList.contains('active')) {
//         this.closeFilterModal();
//       }
//     });
//   }

//   // Filter Modal Methods
//   openFilterModal() {
//     this.filterModal?.classList.add('active');
//     document.body.style.overflow = 'hidden';
//   }

//   closeFilterModal() {
//     this.filterModal?.classList.remove('active');
//     document.body.style.overflow = '';
//   }

//   // Sort Methods
//   toggleSortDropdown() {
//     this.sortDropdown?.classList.toggle('active');
//   }

//   closeSortDropdown() {
//     this.sortDropdown?.classList.remove('active');
//   }

//   updateSortButton() {
//     const sortTexts = {
//       'price-desc': 'СНАЧАЛА ДОРОГИЕ ↓',
//       'price-asc': 'СНАЧАЛА НЕДОРОГИЕ ↑',
//       'popular': 'ПОПУЛЯРНЫЕ ★',
//       'new': 'НОВЫЕ ✨'
//     };

//     if (this.sortButton) {
//       this.sortButton.textContent = sortTexts[this.currentSort];
//     }
//   }

//   sortProducts() {
//     switch (this.currentSort) {
//       case 'price-desc':
//         this.filteredProducts.sort((a, b) => b.price - a.price);
//         break;
//       case 'price-asc':
//         this.filteredProducts.sort((a, b) => a.price - b.price);
//         break;
//       case 'popular':
//         this.filteredProducts.sort((a, b) => b.popularity - a.popularity);
//         break;
//       case 'new':
//         this.filteredProducts.sort((a, b) => {
//           if (a.isNew && !b.isNew) return -1;
//           if (!a.isNew && b.isNew) return 1;
//           return b.popularity - a.popularity;
//         });
//         break;
//     }
//   }

//   // Filter Methods
//   applyFilters() {
//     // Собираем активные фильтры из переключателей
//     const activeToggles = Array.from(document.querySelectorAll('.toggle-switch input:checked'));
//     this.activeFilters = activeToggles.map(toggle => toggle.value);

//     // Фильтруем продукты
//     this.filteredProducts = this.products.filter(product => {
//       if (this.activeFilters.length === 0) return true;

//       return this.activeFilters.every(filter => {
//         switch (filter) {
//           case 'new':
//             return product.isNew;
//           case 'inStock':
//             return product.inStock;
//           case 'contract':
//             return product.contract;
//           case 'exclusive':
//             return product.exclusive;
//           case 'sale':
//             return product.sale;
//           default:
//             return true;
//         }
//       });
//     });

//     this.sortProducts();
//     this.renderProducts();
//     this.closeFilterModal();
//   }

//   resetFilters() {
//     // Сброс всех переключателей
//     document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(input => {
//       input.checked = false;
//     });

//     this.activeFilters = [];
//     this.filteredProducts = [...this.products];
//     this.sortProducts();
//     this.renderProducts();
//   }

//   renderProducts() {
//     if (!this.productsList) return;

//     if (this.filteredProducts.length === 0) {
//       this.productsList.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Товары не найдены</p>';
//       return;
//     }

//     this.productsList.innerHTML = this.filteredProducts.map(product => `
//       <div class="product-card" data-id="${product.id}">
//         <div class="product-card__image">
//           <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'"/>
//         </div>
//         <div class="product-card__content">
//           <div class="product-card__name">${product.name}</div>
//           <div class="product-card__price">${product.price.toLocaleString('ru-RU')} ₽</div>
//           <button class="product-card__add-to-cart" onclick="addToCart(${product.id})">
//             Добавить в корзину
//           </button>
//         </div>
//       </div>
//     `).join('');
//   }
// }

// // Инициализация каталога
// document.addEventListener('DOMContentLoaded', () => {
//   new ProductCatalog();
// });

// // Функция добавления в корзину (заглушка)
// function addToCart(productId) {
//   console.log('Добавлен товар с ID:', productId);
//   // Здесь будет логика добавления в корзину
// }
