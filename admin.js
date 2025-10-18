import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://adxtanejeewibwmsxgae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkeHRhbmVqZWV3aWJ3bXN4Z2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjYyMzIsImV4cCI6MjA3NjIwMjIzMn0.qSzNYPrUFOG90-SRQmOT1MTWaELO_At8diBZiwzgCgU';
const supabase = createClient(supabaseUrl, supabaseKey);

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

function loginAdmin() {
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;

  if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    loadProducts();
    loadOrders();
  } else {
    alert('Invalid username or password!');
  }
}

function logoutAdmin() {
  loginSection.style.display = 'block';
  dashboardSection.style.display = 'none';
}

// ----------------- PRODUCTS -----------------
const productsList = document.getElementById('productsList');

async function loadProducts() {
  const { data: products, error } = await supabase.from('products').select('*');
  if(error) return console.error(error);

  productsList.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <div>
        <strong>${product.name}</strong> - ₹${product.price}<br>
        ${product.description}
      </div>
      <button onclick="deleteProduct('${product.id}')">Delete</button>
    `;
    productsList.appendChild(div);
  });
}

async function addProduct() {
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const description = document.getElementById('productDescription').value;
  const image_url = document.getElementById('productImage').value;

  const { data, error } = await supabase.from('products').insert([{ name, price, description, image_url }]);
  if(error) return alert('Error adding product: ' + error.message);

  alert('Product added!');
  document.getElementById('productName').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productDescription').value = '';
  document.getElementById('productImage').value = '';
  loadProducts();
}

async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if(error) return alert('Error deleting product: ' + error.message);
  loadProducts();
}

// ----------------- ORDERS -----------------
const ordersList = document.getElementById('ordersList');

async function loadOrders() {
  const { data: orders, error } = await supabase.from('orders').select('*');
  if(error) return console.error(error);

  ordersList.innerHTML = '';
  orders.forEach(order => {
    const div = document.createElement('div');
    div.classList.add('order-card');
    div.innerHTML = `
      <div>
        <strong>${order.name}</strong> - ${order.email}<br>
        ${order.phone}, ${order.street}, ${order.landmark}, ${order.city} - ${order.pincode}<br>
        Status: ${order.status}
      </div>
      <button onclick="updateOrderStatus('${order.id}')">Mark as Completed</button>
    `;
    ordersList.appendChild(div);
  });
}

async function updateOrderStatus(id) {
  const { error } = await supabase.from('orders').update({ status: 'Completed' }).eq('id', id);
  if(error) return alert('Error updating status: ' + error.message);
  loadOrders();
}
