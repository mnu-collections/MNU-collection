/* General */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

body {
    background-color: #000;
    color: #fff;
}

/* Header */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    background-color: #000;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.logo {
    font-size: 28px;
    font-weight: 700;
}

nav ul {
    display: flex;
    list-style: none;
}

nav ul li {
    margin-left: 30px;
}

nav ul li a {
    text-decoration: none;
    color: #fff;
    font-weight: 500;
    transition: color 0.3s;
}

nav ul li a:hover {
    color: #f5c518;
}

/* Hero Section */
.hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 100px 50px;
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('hero.jpg') no-repeat center center/cover;
}

.hero-text h1 {
    font-size: 50px;
    margin-bottom: 20px;
}

.hero-text p {
    font-size: 18px;
    margin-bottom: 30px;
}

.btn {
    background-color: #f5c518;
    color: #000;
    padding: 12px 25px;
    text-decoration: none;
    font-weight: 700;
    border-radius: 5px;
    transition: background 0.3s;
}

.btn:hover {
    background-color: #fff;
}

/* Featured Products */
.featured-products {
    padding: 80px 50px;
    text-align: center;
}

.featured-products h2 {
    font-size: 36px;
    margin-bottom: 50px;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.product-card {
    background-color: #111;
    padding: 20px;
    border-radius: 10px;
    transition: transform 0.3s;
}

.product-card img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 15px;
}

.product-card h3 {
    margin-bottom: 10px;
}

.product-card p {
    margin-bottom: 15px;
}

.product-card .btn {
    display: inline-block;
}

/* Hover effect */
.product-card:hover {
    transform: translateY(-10px);
}

/* Footer */
footer {
    text-align: center;
    padding: 30px;
    background-color: #000;
    border-top: 1px solid #333;
}
