// ------------------ ADMIN LOGIN ------------------
const loginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        // Show admin panel and hide login form
        loginForm.style.display = 'none';
        adminPanel.style.display = 'block';
    } else {
        alert('Incorrect username or password!');
    }
});

// ------------------ LOGOUT ------------------
logoutBtn.addEventListener('click', () => {
    adminPanel.style.display = 'none';
    loginForm.style.display = 'block';
    loginForm.reset();
});
