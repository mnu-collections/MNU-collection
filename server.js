// ---------------------- IMPORT SUPABASE ----------------------
import { createClient } from '@supabase/supabase-js'

// Supabase credentials (hardcoded for now)
const supabaseUrl = 'https://adxtanejeewibwmsxgae.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_API_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------- PRODUCTS ----------------------
// Add product
export async function addProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product]);
  if(error) {
    console.error('Add product error:', error);
    return null;
  }
  return data;
}

// Get all products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  if(error) {
    console.error('Get products error:', error);
    return [];
  }
  return data;
}

// Remove product by id
export async function removeProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if(error) {
    console.error('Remove product error:', error);
    return null;
  }
  return data;
}

// ---------------------- ORDERS ----------------------
// Add order
export async function addOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order]);
  if(error) {
    console.error('Add order error:', error);
    return null;
  }
  return data;
}

// Get all orders
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*');
  if(error) {
    console.error('Get orders error:', error);
    return [];
  }
  return data;
}

// ---------------------- EXAMPLE USAGE ----------------------
// (Uncomment to test independently)
// const testProduct = {
//   name: 'Test T-Shirt',
//   price: '999',
//   description: 'Stylish test product',
//   image: 'https://via.placeholder.com/250'
// };

// addProduct(testProduct).then(res => console.log('Product added:', res));
// getProducts().then(res => console.log('All products:', res));
