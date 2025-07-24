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