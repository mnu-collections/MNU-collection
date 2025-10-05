// ---------- FIREBASE SETUP ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQwYdtbUSM7WM25eNUzN4NxFXEvvRGN1k",
  authDomain: "mnu-collection-9282f.firebaseapp.com",
  databaseURL: "https://mnu-collection-9282f-default-rtdb.firebaseio.com",
  projectId: "mnu-collection-9282f",
  storageBucket: "mnu-collection-9282f.firebasestorage.app",
  messagingSenderId: "88757917123",
  appId: "1:88757917123:web:3b1f8f53654fee25089976",
  measurementId: "G-JW6LQER5TD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------- ADMIN LOGIN ----------
const loginForm = document.getElementById('login');
const loginDiv = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if(username === 'admin' && password === '1234'){
            loginDiv.style.display = 'none';
            adminPanel.style.display = 'block';
        } else {
            alert('Incorrect username or password');
        }
    });
}

// ---------- PRODUCT MANAGEMENT ----------
const adminForm = document.getElementById('adminForm');
const preview = document.getElementById('preview');

function displayProducts() {
    if (!preview) return;
    preview.innerHTML = '';

    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
        preview.innerHTML = '';
        snapshot.forEach((child) => {
            const product = child.val();
            const key = child.key;
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <button class="remove-btn" onclick="removeProduct('${key}')">Remove</button>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
                <p>${product.description}</p>
                <p class="timestamp">Added: ${product.time}</p>
            `;
            preview.appendChild(div);
        });
    });
}

displayProducts();

if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const description = document.getElementById('description').value;
        const imageInput = document.getElementById('image');

        const reader = new FileReader();
        reader.onload = function() {
            const image = reader.result;
            const currentTime = new Date();
            const product = { 
                name, 
                price, 
                description, 
                image, 
                time: currentTime.toLocaleString() 
            };
            const productsRef = ref(db, 'products');
            push(productsRef, product).then(() => {
                adminForm.reset();
                alert("Product added successfully!");
            });
        };
        reader.readAsDataURL(imageInput.files[0]);
    });
}

window.removeProduct = function(key) {
    if(confirm("Are you sure you want to remove this T-shirt?")) {
        remove(ref(db, 'products/' + key));
    }
}

// ---------- CART MANAGEMENT ----------
let userId = "guest"; // for demonstration
function addToCart(product) {
    const cartRef = ref(db, 'carts/' + userId);
    push(cartRef, product);
    alert(${product.name} added to cart!);
}

function buyNow(product) {
    const cartRef = ref(db, 'carts/' + userId);
    // clear cart first
    remove(cartRef).then(() => {
        push(cartRef, product).then(() => {
            window.location.href = 'checkout.html';
        });
    });
}

// ---------- FRONTEND PRODUCT LIST ----------
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const product = {
            name: card.dataset.name,
            price: parseInt(card.dataset.price),
            quantity: 1
        };
        addToCart(product);
    });
});

document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const product = {
            name: card.dataset.name,
            price: parseInt(card.dataset.price),
            quantity: 1
        };
        buyNow(product);
    });
});

// ---------- ORDER MANAGEMENT ----------
const ordersDiv = document.getElementById('orders');
function displayOrders() {
    if (!ordersDiv) return;
    let ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
        ordersDiv.innerHTML = '';
        snapshot.forEach((child, index) => {
            const order = child.val();
            const key = child.key;
            let paymentStatus = order.payment === "Cash on Delivery" ? "Cash on Delivery" : "✅ Paid";

            let productsList = '';
            order.items.forEach(item => {
                productsList += <p>${item.name} x ${item.quantity || 1} (₹${item.price})</p>;
            });

            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <h3>Order #${index + 1}</h3>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.pincode}</p>
                <p><strong>Payment:</strong> ${order.payment} (${paymentStatus})</p>
                <p><strong>Total:</strong> ₹${order.total}</p>
                <p><strong>Date:</strong> ${order.time}</p>
                <h4>Items:</h4>
                ${productsList}
                <div class="order-actions">
                    <button class="delivered" onclick="markDelivered('${key}')">Mark Delivered</button>
                    <button class="delete" onclick="deleteOrder('${key}')">Delete Order</button>
                </div>
            `;
            ordersDiv.appendChild(div);
        });
    });
}

displayOrders();

window.markDelivered = function(key) {
    const orderRef = ref(db, 'orders/' + key + '/payment');
    set(orderRef, "Cash on Delivery - Delivered ✅");
}

window.deleteOrder = function(key) {
    if(confirm("Are you sure you want to delete this order?")) {
        remove(ref(db, 'orders/' + key));
    }
}