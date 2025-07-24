// Хранение корзины в localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция обновления UI корзины
function updateCartUI() {
  const cartList = document.getElementById('cartList');
  const cartItemCount = document.getElementById('cartItemCount');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount'); // Счётчик в header (зелёный круг)

  cartList.innerHTML = ''; // Очистка списка
  let totalPrice = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    if (!item.deleted) {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    }

    const li = document.createElement('li');
    li.classList.add('cart-sidebar__item');
    if (item.deleted) {
      li.classList.add('deleted', 'recoverable');
    }

    li.innerHTML = `
      <img class="cart-sidebar__item-image" 
           src="${item.image || 'placeholder.jpg'}" 
           alt="${item.name || 'Товар'}" 
           onerror="this.src='placeholder.jpg';">
      <div class="cart-sidebar__item-info">
        <div class="cart-sidebar__item-name">${item.name || 'Неизвестный товар'}</div>
        <div class="cart-sidebar__item-price">${item.price ? `${item.price} руб.` : 'Цена неизвестна'}</div>
      </div>
      <div class="cart-sidebar__item-quantity">
        <button class="decrement" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="increment" data-index="${index}">+</button>
      </div>
            ${item.deleted ? 
        `<button class="cart-sidebar__item-recover" data-index="${index}">↺</button>` : 
        `<button class="cart-sidebar__item-remove" data-index="${index}">&times;</button>`}
    `;

    cartList.appendChild(li);
  });

  // Общее количество товаров для отображения
  cartItemCount.textContent = `${totalItems} ${totalItems === 1 ? 'товар' : totalItems % 10 >= 2 && totalItems % 10 <= 4 ? 'товара' : 'товаров'}`;
  cartTotal.textContent = `${totalPrice.toLocaleString('ru-RU')} руб.`;
  if (cartCount) cartCount.textContent = totalItems; // Обновление счётчика в header (общее количество)

  localStorage.setItem('cart', JSON.stringify(cart)); // Сохранение
}

// Добавление товара
export function addToCart(productId, productName, productPrice, productImage) {
  console.log('Добавлен товар с ID:', productId);
  const existingItem = cart.find(item => item.id === productId && !item.deleted);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1, deleted: false });
  }
  updateCartUI();
}

// Глобальная доступность
window.addToCart = addToCart;

// Инициализация по загрузке (без изменений)
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI(); // Начальное обновление

  const cartIcon = document.querySelector('.header__icon--cart');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeBtn = cartSidebar.querySelector('.cart-sidebar__close');
  const backdrop = cartSidebar.querySelector('.cart-sidebar__backdrop');
  const clearBtn = document.getElementById('clearCart');

  // Открытие sidebar
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      cartSidebar.classList.toggle('active');
    });
  }

  // Закрытие
  if (closeBtn) closeBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));
  if (backdrop) backdrop.addEventListener('click', () => cartSidebar.classList.remove('active'));

  // Очистка корзины
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = [];
      updateCartUI();
    });
  }

  // Делегирование событий для +/-/remove/recover
  const cartList = document.getElementById('cartList');
  if (cartList) {
    cartList.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      if (isNaN(index)) return;

      if (e.target.classList.contains('increment')) {
        if (!cart[index].deleted) cart[index].quantity++;
      } else if (e.target.classList.contains('decrement')) {
        if (!cart[index].deleted && cart[index].quantity > 1) cart[index].quantity--;
      } else if (e.target.classList.contains('cart-sidebar__item-remove')) {
        cart[index].deleted = true;
      } else if (e.target.classList.contains('cart-sidebar__item-recover')) {
        cart[index].deleted = false;
      }
      updateCartUI();
    });
  }
});