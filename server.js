// ---------- SERVER SETUP ----------
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, remove } from "firebase/database";
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ---------- FIREBASE CONFIG ----------
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

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ---------- ROUTES ----------

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Shop page
app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

// Cart page
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// Checkout page
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Add product (from admin form)
app.post('/add-product', (req, res) => {
    const product = req.body;
    product.time = new Date().toLocaleString();
    const productsRef = ref(db, 'products');
    push(productsRef, product)
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false, error: err }));
});

// Remove product
app.post('/remove-product', (req, res) => {
    const { key } = req.body;
    const productRef = ref(db, 'products/' + key);
    remove(productRef)
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false, error: err }));
});

// Add order (from checkout)
app.post('/add-order', (req, res) => {
    const order = req.body;
    order.time = new Date().toLocaleString();
    const ordersRef = ref(db, 'orders');
    push(ordersRef, order)
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false, error: err }));
});

// Remove order
app.post('/remove-order', (req, res) => {
    const { key } = req.body;
    const orderRef = ref(db, 'orders/' + key);
    remove(orderRef)
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false, error: err }));
});

// Start server
app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
});