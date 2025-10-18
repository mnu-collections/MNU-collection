// ---------------------- ADMIN LOGIN ----------------------
const adminUsername = "admin"; // change if needed
const adminPassword = "123456"; // change if needed

const loginForm = document.getElementById("adminLoginForm");
const adminPanel = document.getElementById("adminPanel");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === adminUsername && password === adminPassword) {
      loginForm.style.display = "none";
      adminPanel.style.display = "block";
      loadProducts();
      loadOrders();
    } else {
      alert("Invalid credentials!");
    }
  });
}

// ---------------------- SUPABASE CLIENT ----------------------
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adxtanejeewibwmsxgae.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_API_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------- PRODUCTS ----------------------
async function loadProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  
  if (error) {
    console.error(error);
    return;
  }

  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <p>${product.description}</p>
      <button onclick="removeProduct(${product.id})">Remove</button>
    `;
    productList.appendChild(div);
  });
}

// Add Product
const addProductForm = document.getElementById("addProductForm");
if(addProductForm) {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const desc = document.getElementById("productDesc").value;
    const file = document.getElementById("productImage").files[0];

    if(!name || !price || !desc || !file) {
      alert("All fields are required!");
      return;
    }

    // Upload image to Supabase Storage
    const { data, error: uploadError } = await supabase
      .storage
      .from('products')
      .upload(images/${file.name}, file);

    if(uploadError) {
      console.error(uploadError);
      alert("Image upload failed!");
      return;
    }

    const imageUrl = https://adxtanejeewibwmsxgae.supabase.co/storage/v1/object/public/products/${file.name};

    // Insert product
    const { data: insertData, error: insertError } = await supabase
      .from('products')
      .insert([{ name, price, description: desc, image: imageUrl }]);

    if(insertError) {
      console.error(insertError);
      alert("Adding product failed!");
      return;
    }

    alert("Product added successfully!");
    addProductForm.reset();
    loadProducts();
  });
}

// Remove Product
async function removeProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if(error) {
    console.error(error);
    alert("Error removing product");
    return;
  }

  alert("Product removed!");
  loadProducts();
}

// ---------------------- ORDERS ----------------------
async function loadOrders() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*');

  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";

  if (error) {
    console.error(error);
    return;
  }

  orders.forEach((order) => {
    const div = document.createElement("div");
    div.classList.add("order-card");
    div.innerHTML = `
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.pincode}</p>
      <p><strong>Product:</strong> ${order.productName}</p>
      <p><strong>Status:</strong> ${order.status || "Pending"}</p>
    `;
    orderList.appendChild(div);
  });
}

// ---------------------- LOGOUT ----------------------
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    adminPanel.style.display = "none";
    loginForm.style.display = "block";
  });
}