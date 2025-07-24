// Main catalog controller
import { Sort } from "./sort.js";
import { Filter } from "./filter.js";
import { ProductRenderer } from "./render.js";
import { PaintAPI } from "../data/api.js"; 

export class ProductCatalog {
  constructor() {
    this.products = [];
    this.filteredProducts = [];

    // инициализируем
    this.sortManager = new Sort(this);
    this.filterManager = new Filter(this);
    this.renderer = new ProductRenderer(this);
  }

  async init() {
     try {
      // Загружаем данные из API
      this.products = await this.fetchProducts();
      this.filteredProducts = [...this.products];
      // Применяем дефолтную сортировку сразу после загрузки
      this.applySorting(this.sortManager.currentSort);
    } catch (error) {
      console.error('Ошибка инициализации каталога:', error);
    }
  }

  async fetchProducts() {
    const rawProducts = await PaintAPI.getAllPaints();
    // Преобразуем типы в булевы флаги
    return rawProducts.map(product => ({
      ...product,
      image: product.images?.[0] || '',
      price: parseFloat(product.price) || 0, // преобразуем в число
      isNew: product.type?.includes("new")|| false,
      inStock: product.type?.includes("inStock") || false,
      contract: product.type?.includes("contract") || false,
      exclusive: product.type?.includes("exclusive") || false,
      sale: product.type?.includes("sale") || false,
    }));
  }

  applySorting(sortType) {
    this.filteredProducts = this.sortManager.sortProducts(
      this.filteredProducts,
      sortType
    );
    this.renderProducts();
  }

  applyFilters(filters) {
    // Сначала применяем фильтры к оригинальным продуктам
    this.filteredProducts = this.filterManager.filterProducts(
      this.products,
      filters
    );

    // Затем применяем текущую сортировку
    this.filteredProducts = this.sortManager.sortProducts(
      this.filteredProducts
    );

    this.renderProducts();
  }

  renderProducts() {
    this.renderer.render(this.filteredProducts);
  }

  // API методы
  getProducts() {
    return this.products;
  }

  getFilteredProducts() {
    return this.filteredProducts;
  }
}