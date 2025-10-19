<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - MNU Collection</title>
    <link rel="stylesheet" href="style.css">
</head>
<body style="background: url('https://images.pexels.com/photos/164357/pexels-photo-164357.jpeg') no-repeat center center fixed; background-size: cover;">

    <header class="header">
        <h1 class="logo">MNU Collection Admin</h1>
        <nav>
            <ul>
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="shop.html" class="nav-link">Shop</a></li>
                <li><a href="cart.html" class="nav-link">Cart</a></li>
                <li><a href="checkout.html" class="nav-link">Checkout</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <!-- Admin Login -->
        <section id="loginSection" class="admin-login">
            <h2>Admin Login</h2>
            <input type="text" id="adminUsername" placeholder="Username">
            <input type="password" id="adminPassword" placeholder="Password">
            <button onclick="loginAdmin()">Login</button>
            <p id="loginMessage"></p>
        </section>

        <!-- Admin Dashboard -->
        <section id="adminDashboard" style="display:none;">
            <h2>Welcome Admin</h2>

            <!-- Add Product -->
            <div class="admin-section">
                <h3>Add New Product</h3>
                <input type="text" id="productName" placeholder="Product Name">
                <input type="number" id="productPrice" placeholder="Price">
                <textarea id="productDescription" placeholder="Description"></textarea>
                <input type="text" id="productImage" placeholder="Image URL">
                <button onclick="addProduct()">Add Product</button>
            </div>

            <!-- Manage Products -->
            <div class="admin-section">
                <h3>Manage Products</h3>
                <div id="productList"></div>
            </div>

            <!-- Manage Orders -->
            <div class="admin-section">
                <h3>Manage Orders</h3>
                <div id="orderList"></div>
            </div>

            <button onclick="logoutAdmin()">Logout</button>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 MNU Collection. All Rights Reserved.</p>
    </footer>

    <!-- Scripts -->
    <script type="module" src="supabase.js"></script>
    <script type="module" src="script.js"></script>
    <script type="module">
        import { supabase } from './supabase.js';

        const loginSection = document.getElementById('loginSection');
        const adminDashboard = document.getElementById('adminDashboard');
        const loginMessage = document.getElementById('loginMessage');

        const PRODUCT_LIST = document.getElementById('productList');
        const ORDER_LIST = document.getElementById('orderList');

        const ADMIN_USERNAME = 'admin';
        const ADMIN_PASSWORD = 'password123';

        function loginAdmin() {
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;

            if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                loginSection.style.display = 'none';
                adminDashboard.style.display = 'block';
                loadProducts();
                loadOrders();
            } else {
                loginMessage.textContent = 'Invalid credentials!';
            }
        }

        function logoutAdmin() {
            loginSection.style.display = 'block';
            adminDashboard.style.display = 'none';
        }

        async function addProduct() {
            const name = document.getElementById('productName').value;
            const price = document.getElementById('productPrice').value;
            const description = document.getElementById('productDescription').value;
            const image = document.getElementById('productImage').value;

            const { error } = await supabase.from('products').insert([{ name, price, description, image_url: image }]);
            if (error) return console.error(error);

            loadProducts();
            alert('Product added!');
        }

        async function loadProducts() {
            const { data, error } = await supabase.from('products').select('*');
            if (error) return console.error(error);

            PRODUCT_LIST.innerHTML = '';
            data.forEach(product => {
                const div = document.createElement('div');
                div.className = 'admin-product-card';
                div.innerHTML = `
                    <p>${product.name} - ₹${product.price}</p>
                    <button onclick="deleteProduct(${product.id})">Delete</button>
                `;
                PRODUCT_LIST.appendChild(div);
            });
        }

        async function deleteProduct(id) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) return console.error(error);
            loadProducts();
        }

        async function loadOrders() {
            const { data, error } = await supabase.from('orders').select('*');
            if (error) return console.error(error);

            ORDER_LIST.innerHTML = '';
            data.forEach(order => {
                const div = document.createElement('div');
                div.className = 'admin-order-card';
                div.innerHTML = `
                    <p>${order.name} | ${order.product_id} | ${order.status}</p>
                `;
                ORDER_LIST.appendChild(div);
            });
        }
    </script>
</body>
</html>
