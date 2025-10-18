// --------------------------
// IMPORTANT: replace placeholders with your Supabase info
// --------------------------
const SUPABASE_URL = 'https://adxtanejeewibwmsxgae.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE' // replace with your anon key

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Hardcoded admin credentials
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'mnuadmin123'

let products = []

// Fetch products
async function loadProducts() {
  const { data, error } = await supabaseClient.from('products').select('*').order('id', { ascending: false })
  if(error){ console.error(error); return }
  products = data || []
  renderProductsPreview()
  renderShopProducts()
  renderAdminProducts()
}

// Upload image to Supabase storage
async function uploadImageToStorage(file) {
  const filePath = products/${Date.now()}_${file.name}
  const { data, error } = await supabaseClient.storage.from('product-images').upload(filePath, file)
  if(error){ console.error(error); throw error }
  return ${SUPABASE_URL}/storage/v1/object/public/product-images/${encodeURIComponent(filePath)}
}

// Add product
async function addProduct(name, price, desc, file){
  try{
    const imageUrl = await uploadImageToStorage(file)
    await supabaseClient.from('products').insert([{ name, price, description: desc, image_url: imageUrl }])
    await loadProducts()
  }catch(e){console.error(e)}
}

// Delete product
async function deleteProduct(id, imageUrl){
  try{
    await supabaseClient.from('products').delete().eq('id', id)
    try{
      const path = imageUrl.split('/storage/v1/object/public/')[1]
      if(path) await supabaseClient.storage.from('product-images').remove([path])
    }catch(e){}
    await loadProducts()
  }catch(e){console.error(e)}
}

// Render products
function renderProductsPreview(){
  const container = document.getElementById('productsPreview')
  if(!container) return
  container.innerHTML = ''
  products.slice(0,6).forEach(p=>{
    const el = document.createElement('div')
    el.className = 'product-card'
    el.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="product-actions">
        <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        <button class="btn" onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    `
    container.appendChild(el)
  })
}

// Render shop page products
function renderShopProducts(){
  const shop = document.getElementById('shopProducts')
  if(!shop) return
  shop.innerHTML = ''
  products.forEach(p=>{
    const el = document.createElement('div')
    el.className='product-card'
    el.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>₹ ${p.price}</strong>
      <div class="product-actions">
        <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        <button class="btn" onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    `
    shop.appendChild(el)
  })
}

// Admin renders
function renderAdminProducts(){
  const list = document.getElementById('adminProductsList')
  if(!list) return
  list.innerHTML = ''
  products.forEach(p=>{
    const item = document.createElement('div')
    item.className='admin-item'
    const safeUrl = p.image_url.replace(/'/g, "\\'")
    item.innerHTML = `
      <div style="flex:1">${p.name} — ₹${p.price}</div>
      <div style="display:flex;gap:8px">
        <button onclick="handleDelete(${p.id}, '${safeUrl}')" class="btn small danger">Delete</button>
      </div>
    `
    list.appendChild(item)
  })
}

// Cart functions
function getCart(){ return JSON.parse(localStorage.getItem('mnu_cart')||'[]') }
function saveCart(c){ localStorage.setItem('mnu_cart', JSON.stringify(c)) }
function addToCart(productId){ const cart=getCart(); cart.push(productId); saveCart(cart); alert('Added to cart') }
function buyNow(productId){ saveCart([productId]); window.location.href='checkout.html' }

// Checkout
async function handleCheckoutSubmit(e){
  e.preventDefault()
  const order = {
    name: document.getElementById('cName').value,
    phone: document.getElementById('cPhone').value,
    email: document.getElementById('cEmail').value,
    street: document.getElementById('cStreet').value,
    landmark: document.getElementById('cLandmark').value,
    city: document.getElementById('cCity').value,
    pincode: document.getElementById('cPincode').value,
    address_notes: document.getElementById('cAddress').value,
    items: JSON.stringify(getCart()),
    payment_status: 'pending'
  }
  const { data, error } = await supabaseClient.from('orders').insert([order])
  if(error){alert('Order failed'); console.error(error); return}
  localStorage.removeItem('mnu_cart')
  alert('Order placed!')
  window.location.href='index.html'
}

// DOM Ready
document.addEventListener('DOMContentLoaded', ()=>{
  loadProducts()

  const adminBtn = document.getElementById('adminBtn')
  const adminModal = document.getElementById('adminModal')
  const closeAdmin = document.getElementById('closeAdmin')
  const adminLogout = document.getElementById('adminLogout')

  adminBtn?.addEventListener('click', ()=>{
    adminModal.classList.remove('hidden')
  })
  closeAdmin?.addEventListener('click', ()=>{
    adminModal.classList.add('hidden')
  })
  adminLogout?.addEventListener('click', ()=>{
    adminModal.classList.add('hidden')
  })

  document.getElementById('addProductBtn')?.addEventListener('click', async ()=>{
    const name = document.getElementById('pName').value
    const price = document.getElementById('pPrice').value
    const desc = document.getElementById('pDesc').value
    const file = document.getElementById('pImage').files[0]
    if(!name||!price||!desc||!file){ alert('Fill all fields'); return }
    await addProduct(name, price, desc, file)
    document.getElementById('pName').value=''
    document.getElementById('pPrice').value=''
    document.getElementById('pDesc').value=''
    document.getElementById('pImage').value=''
  })

  const checkoutForm = document.getElementById('checkoutForm')
  if(checkout
