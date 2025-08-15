document.addEventListener('DOMContentLoaded', function () {
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptCookies = document.getElementById('acceptCookies');

  if (!localStorage.getItem('cookieConsent')) {
    cookieConsent.style.display = 'block';
  }

  acceptCookies.addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'true');
    cookieConsent.style.display = 'none';
  });

  const brandFilter = document.getElementById('brandFilter');
  const sortOrder = document.getElementById('sortOrder');
  const productsGrid = document.getElementById('productsGrid');
  let products = Array.from(productsGrid.querySelectorAll('.card'));

  function filterProducts() {
    const selectedBrand = brandFilter.value;
    const sort = sortOrder.value;

    let filteredProducts = products.filter(product => {
      return selectedBrand === 'all' || product.dataset.brand === selectedBrand;
    });

    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);
      return sort === 'asc' ? priceA - priceB : priceB - priceA;
    });

    productsGrid.innerHTML = '';
    filteredProducts.forEach(product => productsGrid.appendChild(product));
  }

  brandFilter.addEventListener('change', filterProducts);
  sortOrder.addEventListener('change', filterProducts);

  const cartIcon = document.getElementById('cartIcon');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalValue = document.getElementById('cartTotalValue');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartCount = document.getElementById('cartCount');

  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  updateCartUI();

  cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
  });

  closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == cartModal) {
      cartModal.style.display = 'none';
    }
  });

  productsGrid.addEventListener('click', function (event) {
    if (event.target.classList.contains('buy-btn')) {
      const productArticle = event.target.closest('.card');
      const productId = productArticle.querySelector('.card-title').textContent;
      const productName = productArticle.querySelector('.card-title').textContent;
      const productPrice = parseFloat(productArticle.dataset.price);

      if (cart[productId]) {
        cart[productId].quantity++;
      } else {
        cart[productId] = {
          name: productName,
          price: productPrice,
          quantity: 1
        };
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    }
  });

  function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    for (const productId in cart) {
      const item = cart[productId];
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalItems += item.quantity;

      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <span>${item.name} x ${item.quantity}</span>
        <span>${itemTotal.toFixed(2)} ₽</span>
      `;
      cartItemsContainer.appendChild(cartItem);
    }

    cartTotalValue.textContent = total.toFixed(2);
    cartCount.textContent = totalItems;
  }

  checkoutBtn.addEventListener('click', () => {
    const isRegistered = localStorage.getItem('registeredUser') === 'true';
    if (!isRegistered) {
      alert('Пожалуйста, зарегистрируйтесь, чтобы оформить заказ.');
      window.location.href = 'registration.html';
      return;
    }

    alert('Заказ оформлен, спасибо!');
    cart = {};
    localStorage.removeItem('cart');
    updateCartUI();
    cartModal.style.display = 'none';
  });

  // Перемещаем обработчик очистки корзины внутрь DOMContentLoaded
  const clearCartBtn = document.getElementById('clearCartBtn');
  clearCartBtn.addEventListener('click', () => {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  });
});
