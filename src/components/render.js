export class ProductRenderer {
  constructor(catalog) {
    this.catalog = catalog;
    this.productsList = document.getElementById('productsList');
  }

  render(products) {
    if (!this.productsList) {
      console.warn('productsList element not found');
      return;
    }

    if (products.length === 0) {
      this.renderEmptyState();
      return;
    }

    this.productsList.innerHTML = products.map(product => this.createProductCard(product)).join('');
  }

  renderEmptyState() {
    this.productsList.innerHTML = `
      <p style="text-align: center; padding: 40px; color: #666;">
        Товары не найдены
      </p>
    `;
  }

  createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card__image">
        <img src="${product.image}" 
             alt="${product.name}" 
             onerror="this.src='${this.getPlaceholderImage()}'"/>
      </div>
      <div class="product-card__content">
        <div class="product-card__name">${product.name}</div>
        <div class="product-card__footer">
          <div class="product-card__price">${product.price.toLocaleString('ru-RU')} ₽</div>
          <button class="product-card__add-to-cart" 
                  onclick="addToCart(${product.id}, '${product.name.replace(/'/g, '\\\'')}', ${product.price}, '${product.image.replace(/'/g, '\\\'')}')">
            +
          </button>
        </div>
      </div>
    </div>
  `;
}

  getPlaceholderImage() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
  }
}