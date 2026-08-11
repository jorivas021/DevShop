// URL de l'API FakeStore
const API_URL = 'https://fakestoreapi.com/products';

// Clé pour le LocalStorage
const STORAGE_KEY = 'devshop_cart_data';

// État global de l'application (State)
let products = [];
// Récupération du panier sauvegardé ou tableau vide par défaut
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let selectedCategory = 'all';
let searchQuery = '';

// Éléments du DOM - Niveau 1 & 2
const productsGrid = document.getElementById('products-grid');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const categoriesContainer = document.getElementById('categories-container');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');

// Éléments du DOM - Niveau 3 (Tiroir Panier)
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// ==========================================
// 1. Récupération des données (API)
// ==========================================
async function fetchProducts() {
  showLoader(true);
  hideError();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erreur réseau (${response.status}) : Impossible de charger les produits.`);
    }

    products = await response.json();

    if (products.length === 0) {
      showError("Aucun produit n'a été trouvé.");
      return;
    }

    renderCategories();
    applyFilters();

  } catch (error) {
    console.error('Erreur fetch :', error);
    showError(error.message || 'Une erreur inattendue est survenue.');
  } finally {
    showLoader(false);
  }
}

// ==========================================
// 2. Logique de Filtrage et Recherche
// ==========================================
function applyFilters() {
  let filteredList = [...products];

  if (selectedCategory !== 'all') {
    filteredList = filteredList.filter(p => p.category === selectedCategory);
  }

  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    filteredList = filteredList.filter(p => p.title.toLowerCase().includes(query));
  }

  renderProducts(filteredList);
}

function renderCategories() {
  const categories = ['all', ...new Set(products.map(p => p.category))];
  categoriesContainer.innerHTML = '';

  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.classList.add('category-btn');
    if (category === selectedCategory) btn.classList.add('active');

    btn.textContent = category === 'all' ? 'Tous' : category;
    btn.dataset.category = category;

    btn.addEventListener('click', () => {
      selectedCategory = category;
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });

    categoriesContainer.appendChild(btn);
  });
}

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  applyFilters();
});

// ==========================================
// 3. Affichage des produits
// ==========================================
function renderProducts(list) {
  productsGrid.innerHTML = '';

  if (list.length === 0) {
    productsGrid.innerHTML = '<p class="no-results">Aucun produit ne correspond à votre recherche.</p>';
    return;
  }

  list.forEach(product => {
    const card = document.createElement('article');
    card.classList.add('product-card');

    card.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" alt="${escapeHtml(product.title)}" loading="lazy">
      </div>
      <div class="card-content">
        <span class="category-badge">${escapeHtml(product.category)}</span>
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
        <p class="product-price">${product.price.toFixed(2)} $</p>
        <button class="add-to-cart-btn" data-id="${product.id}">
          Ajouter au panier
        </button>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

productsGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart-btn')) {
    const productId = parseInt(e.target.dataset.id, 10);
    addToCart(productId);
  }
});

// ==========================================
// 4. Logique du Panier & Persistance (Niveau 3)
// ==========================================

/**
 * Sauvegarde le panier dans le localStorage et met à jour toute l'UI du panier
 */
function saveAndRenderCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveAndRenderCart();
  openCartDrawer(); // Ouvre automatiquement le tiroir lors de l'ajout
}

function changeQuantity(productId, delta) {
  const item = cart.find(p => p.id === productId);
  if (!item) return;

  item.quantity += delta;

  // Si la quantité descend à 0, on supprime l'article
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveAndRenderCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveAndRenderCart();
}

/**
 * Génère le contenu HTML du tiroir panier latéral
 */
function renderCartDrawer() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Votre panier est vide.</p>';
    cartTotalElement.textContent = '0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');

    itemElement.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}">
      <div class="cart-item-info">
        <h4>${escapeHtml(item.title)}</h4>
        <p class="cart-item-price">${item.price.toFixed(2)} $</p>
        <div class="cart-item-qty">
          <button class="qty-btn decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-id="${item.id}">&times;</button>
    `;

    cartItemsContainer.appendChild(itemElement);
  });

  cartTotalElement.textContent = total.toFixed(2);
}

// Event Delegation pour la gestion des boutons (+, -, suppr) dans le panier
cartItemsContainer.addEventListener('click', (e) => {
  const id = parseInt(e.target.dataset.id, 10);
  if (!id) return;

  if (e.target.classList.contains('increase')) {
    changeQuantity(id, 1);
  } else if (e.target.classList.contains('decrease')) {
    changeQuantity(id, -1);
  } else if (e.target.classList.contains('remove-btn')) {
    removeFromCart(id);
  }
});

function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;
}

// ==========================================
// 5. Ouverture / Fermeture du Tiroir Panier
// ==========================================
function openCartDrawer() {
  cartDrawer.classList.add('open');
  overlay.classList.add('active');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCartDrawer);
closeCartBtn.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', closeCartDrawer);

// ==========================================
// 6. Utilitaires UI
// ==========================================
function showLoader(isLoading) {
  if (isLoading) {
    loader.classList.remove('hidden');
    productsGrid.innerHTML = '';
  } else {
    loader.classList.add('hidden');
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  saveAndRenderCart(); // Restaure le panier du localStorage à l'affichage
});

// ==========================================
// 7. SYSTÈME DE NOTIFICATION TOAST
// ==========================================
const toastContainer = document.getElementById('toast-container');

function showToast(message) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  // Auto-suppression après 3 secondes avec animation de disparition
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 2700);
}

// Mise à jour de addToCart pour déclencher le Toast
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveAndRenderCart();
  
  // Notification Toast
  showToast(`"${product.title.substring(0, 20)}..." ajouté au panier !`);
}

// ==========================================
// 8. GESTION DU MODE SOMBRE (DARK MODE)
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('theme-icon-sun');
const moonIcon = document.getElementById('theme-icon-moon');

// Vérifier la préférence sauvegardée
const savedTheme = localStorage.getItem('devshop_theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  sunIcon.classList.remove('hidden');
  moonIcon.classList.add('hidden');
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');

  // Mise à jour des icônes
  if (isDark) {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
    localStorage.setItem('devshop_theme', 'dark');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
    localStorage.setItem('devshop_theme', 'light');
  }
});