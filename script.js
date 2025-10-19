// script.js
import { supabase } from './supabase.js';

// Use a fixed user id for now
const USER_ID = 'guest';

// Add product to cart
export async function addToCart(productId) {
  try {
    const { data, error } = await supabase
      .from('cart')
      .insert([{ user_id: USER_ID, product_id: productId, quantity: 1 }]);

    if (error) throw error;
    alert('Product added to cart');
    renderCart();
  } catch (err) {
    console.error(err);
    alert('Failed to add product');
  }
}

// Remove product from cart
export async function removeFromCart(cartId) {
  try {
    const { data, error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartId);

    if (error) throw error;
    alert('Product removed from cart');
    renderCart();
  } catch (err) {
    console.error(err);
    alert('Failed to remove product');
  }
}

// Fetch and render cart
export async function renderCart() {
  try {
    const { data, error } = await supabase
      .from('cart')
      .select('id, product_id, quantity, products(name, price, image_url)')
      .eq('user_id', USER_ID);

    if (error) throw error;

    const container = document.getElementById('cartContainer');
    if (!container) return;
    container.innerHTML = '';

    let total = 0;
    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.products.image_url}" alt="${item.products.name}" width="100">
        <div>
          <h3>${item.products.name}</h3>
          <p>₹${item.products.price} x ${item.quantity}</p>
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;
      container.appendChild(div);
      total += item.products.price * item.quantity;
    });

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '₹' + total;
  } catch (err) {
    console.error(err);
  }
}

// Buy Now (single product)
export async function buyNow(productId) {
  try {
    // Clear current cart
    await supabase.from('cart').delete().eq('user_id', USER_ID);
    // Add only this product
    await addToCart(productId);
    // Redirect to checkout
    window.location.href = 'checkout.html';
  } catch (err) {
    console.error(err);
    alert('Failed to buy now');
  }
}

// Expose globally for buttons
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.renderCart = renderCart;
window.buyNow = buyNow;

// Auto-render cart if container exists
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});