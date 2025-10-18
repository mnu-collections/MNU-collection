// ---------------------- CART ----------------------
let cart = [];

// Add to Cart
document.querySelectorAll('.addCartBtn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const productCard = btn.closest('.product-card');
    const product = {
      name: productCard.querySelector('h3').innerText,
      price: productCard.querySelector('p').innerText,
      description: productCard.querySelectorAll('p')[1].innerText,
      image: productCard.querySelector('img').src
    };
    cart.push(product);
    alert(${product.name} added to cart!);
    updateCartUI();
  });
});

// Buy Now (go directly to checkout)
document.querySelectorAll('.buyNowBtn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const productCard = btn.closest('.product-card');
    const product = {
      name: productCard.querySelector('h3').innerText,
      price: productCard.querySelector('p').innerText,
      description: productCard.querySelectorAll('p')[1].innerText,
      image: productCard.querySelector('img').src
    };
    localStorage.setItem('checkoutProduct', JSON.stringify(product));
    window.location.href = 'checkout.html';
  });
});

// Update Cart UI (simple alert for now)
function updateCartUI() {
  console.log('Cart:', cart);
  // Can be enhanced to show cart items dynamically
}

// ---------------------- SEARCH ----------------------
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');

if(searchBtn) {
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    products.forEach(prod => {
      const name = prod.querySelector('h3').innerText.toLowerCase();
      if(name.includes(query)) {
        prod.style.display = 'block';
      } else {
        prod.style.display = 'none';
      }
    });
  });
}

// ---------------------- ADMIN PAGE PLACEHOLDER ----------------------
function addProductAdmin(name, price, desc, imageUrl) {
  // Placeholder function for admin to add products
  console.log('Admin added product:', {name, price, desc, imageUrl});
}

function removeProductAdmin(index) {
  // Placeholder function for admin to remove product
  console.log('Admin removed product at index:', index);
}
