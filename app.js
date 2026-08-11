// URL de l'API FakeStore
const API_URL = 'https://fakestoreapi.com/products';

// État de l'application (State)
let products = [];
let cart = JSON.parse(localStorage.getItem('devshop_cart')) || [];

// Éléments du DOM
const productsGrid = document.getElementById('products-grid');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const cartCount = document.getElementById('cart-count');

// 1. Récupération des données depuis l'API
async function fetchProducts() {
  try {
    loader.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erreur lors du chargement des produits');

    products = await response.json();
    renderProducts(products);
    renderCategories();
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
  }
}

// 2. Affichage des cartes produits
function renderProducts(productList) {
  productsGrid.innerHTML = '';

  if (productList.length === 0) {
    productsGrid.innerHTML = '<p>Aucun produit trouvé.</p>';
    return;
  }

  productList.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">${product.price.toFixed(2)} $</p>
      <button onclick="addToCart(${product.id})">Ajouter au panier</button>
    `;
    productsGrid.appendChild(card);
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  updateCartUI();
});