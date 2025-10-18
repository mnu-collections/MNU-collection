// --------------------------
// IMPORTANT: replace placeholders below with your Supabase info
// --------------------------
const SUPABASE_URL = 'https://adxtanejeewibwmsxgae.supabase.co' // <-- your project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE' // <-- put your anon key here

// create client (UMD exposes supabase)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Hardcoded admin credentials (change these later!)
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'mnuadmin123'

// --- Simple state
let products = []

// --- Helper: fetch products from Supabase (table: products)
async function loadProducts() {
  try{
    const { data, error } = await supabaseClient.from('products').select('*').order('id', { ascending: false })
    if (error) { console.error(error); return }
    products = data || []
    renderProductsPreview()
    renderShopProducts()
    renderAdminProducts()
  }catch(e){console.error(e)}
}

// --- Upload image to Supabase storage
async function uploadImageToStorage(file) {
  const filePath = products/${Date.now()}_${file.name}
  const { data, error } = await supabaseClient.storage.from('product-images').upload(filePath, file)
  if (error) { console.error('Upload error', error); throw error }
  // construct public URL (standard Supabase public path)
  const publicUrl = ${SUPABASE_URL}/storage/v1/object/public/product-images/${encodeURIComponent(filePath)}
  return publicUrl
}

// --- Add product to DB
async function addProduct(name, price, description, imageFile) {
  try{
    const imageUrl = await uploadImageToStorage(imageFile)
    const { data, error } = await supabaseClient.from('products').insert([{ name, price, description, image_url: imageUrl }])
    if (error) { console.error(error); return }
    await loadProducts()
  }catch(e){console.error(e)}
}

// --- Delete product (and optional remove from storage)
async function deleteProduct(id, imageUrl){
  try{
    await supabaseClient.from('products').delete().eq('id',id)
    // try to remove file from storage if we can parse path
    try{
      const path = imageUrl.split('/storage/v1/object/public/')[1]
      if (path) await supabaseClient.storage.from('product-images').remove([path])
    }catch(e){/ignore/}
    await loadProducts()
  }catch(e){console.error(e)}
}

// --- Render preview on homepage
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
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        <button class="btn" onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    `
    container.appendChild(el)
  })
}

// --- Render shop page
function renderShopProducts(){
  const shop = document.getElementById('shopProducts')
  if(!shop) return
  shop.innerHTML = ''
  products.forEach(p=>{
    const el = document.createElement('div')
    el.className = 'product-card'
    el.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>₹ ${p.price}</strong>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        <button class="btn" onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    `
    shop.appendChild(el)
  })
}

// --- Admin renders
function renderAdminProducts(){
  const list = document.getElementById('adminProductsList')
  if(!list) return
  list.innerHTML = ''
  products.forEach(p=>{
    const item = document.createElement('div')
    item.className = 'admin-item'
    // escape single quotes in URL
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

// --- Cart functions (localStorage simple)
function getCart(){
  return JSON.parse(localStorage.getItem('mnu_cart')||'[]')
}
function saveCart(c){
  localStorage.setItem('mnu_cart', JSON.stringify(c))
}
function addToCart(productId){
  const cart = getCart()
  cart.push(productId)
  saveCart(cart)
  alert('Added to cart')
}
function buyNow(productId){
  saveCart([productId])
  window.location.href = 'checkout.html'
}

// --- Checkout handling
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
  window.location.href = 'index.html'
}

// --- Admin UI events
document.addEventListener('DOMContentLoaded', ()=>{
  loadProducts()

  // admin modal controls
  const adminModal = document.getElementById('adminModal')
  const loginBtn = document.getElementById('loginBtn')
  const closeAdmin = document.getElementById('closeAdmin')
  const adminLoginBtn = document.getElementById('adminLogin')
  const adminControls = document.getElementById('adminControls')
  const adminAuth = document.getElementById('adminAuth')

  loginBtn?.addEventListener('click', ()=>{ adminModal.classList.remove('hidden') })
  closeAdmin?.addEventListener('click', ()=>{ adminModal.classList.add('hidden') })

  adminLoginBtn?.addEventListener('click', ()=>{
    const u = document.getElementById('adminUser').value
    const p = document.getElementById('adminPass').value
    if(u === ADMIN_USER && p === ADMIN_PASS){
      adminAuth.classList.add('hidden')
      adminControls.classList.remove('hidden')
      renderAdminProducts()
    } else alert('Invalid admin')
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

  document.getElementById('adminLogout')?.addEventListener('click', ()=>{
    document.getElementById('adminAuth').classList.remove('hidden')
    document.getElementById('adminControls').classList.add('hidden')
    adminModal.classList.add('hidden')
  })

  // checkout submit
  const checkoutForm = document.getElementById('checkoutForm')
  if(checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit)

  // render cart items in cart page
  const cartItemsEl = document.getElementById('cartItems')
  if(cartItemsEl){
    const cart = getCart()
    cartItemsEl.innerHTML = ''
    cart.forEach(id=>{
      const p = products.find(x=>x.id===id)
      if(p){
        const div = document.createElement('div')
        div.className='product-card'
        div.innerHTML = <img src="${p.image_url}" /><h3>${p.name}</h3><strong>₹ ${p.price}</strong>
        cartItemsEl.appendChild(div)
      }
    })
  }

})

// --- expose delete handler to global scope for inline onclick
window.handleDelete = async (id, url)=>{
  if(!confirm('Delete product?')) return
  await deleteProduct(id, url)
}

// --- expose addToCart/buyNow for inline use
window.addToCart = addToCart
window.buyNow = buyNow
