// Shared helpers for the upgraded store (cart, toasts, accounts)
var BOOKS = [
  { id: 1, title: 'HTML & CSS', author: 'Jon Duckett', publisher: 'Wiley', price: 650, cat: 'Web Development', cover: '../cover1.png' },
  { id: 2, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', publisher: "O'Reilly", price: 450, cat: 'Web Development', cover: '../cover2.png' },
  { id: 3, title: 'Learning Web Design', author: 'Jennifer Robbins', publisher: "O'Reilly", price: 720, cat: 'Web Development', cover: '../cover3.png' },
  { id: 4, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', publisher: 'No Starch Press', price: 550, cat: 'Programming', cover: '../cover4.png' },
  { id: 5, title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', price: 800, cat: 'Programming', cover: '../cover5.png' },
  { id: 6, title: 'The C Programming Language', author: 'Kernighan & Ritchie', publisher: 'Pearson', price: 600, cat: 'Programming', cover: '../cover6.png' },
  { id: 7, title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', publisher: 'McGraw-Hill', price: 900, cat: 'Databases', cover: '../cover7.png' },
  { id: 8, title: 'Sams Teach Yourself SQL in 10 Minutes', author: 'Ben Forta', publisher: 'Sams', price: 420, cat: 'Databases', cover: '../cover8.png' },
  { id: 9, title: 'Computer Networking: A Top-Down Approach', author: 'Kurose & Ross', publisher: 'Pearson', price: 850, cat: 'Networking', cover: '../cover9.png' },
  { id: 10, title: 'Discrete Mathematics and Its Applications', author: 'Kenneth Rosen', publisher: 'McGraw-Hill', price: 780, cat: 'Mathematics', cover: '../cover10.png' }
];
var CATEGORIES = ['Web Development', 'Programming', 'Databases', 'Networking', 'Mathematics'];

function bookById(id) { return BOOKS.filter(function (b) { return b.id === id; })[0]; }
function read(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; } catch (e) { return fallback; } }
function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function el(tag, props, kids) {
  var n = document.createElement(tag);
  Object.keys(props || {}).forEach(function (k) { if (k === 'text') n.textContent = props[k]; else n.setAttribute(k, props[k]); });
  (kids || []).forEach(function (c) { n.appendChild(c); });
  return n;
}

// ----- Cart: [{id, qty}] -----
function getCart() { return read('store_cart', []); }
function saveCart(cart) { write('store_cart', cart); refreshTop(); }
function cartCount() { return getCart().reduce(function (n, i) { return n + i.qty; }, 0); }
function addToCart(id) {
  var cart = getCart(), item = cart.filter(function (i) { return i.id === id; })[0];
  if (item) item.qty++; else cart.push({ id: id, qty: 1 });
  saveCart(cart);
  toast(bookById(id).title + ' added to cart');
}
function setQty(id, qty) {
  var cart = getCart().map(function (i) { return i.id === id ? { id: id, qty: qty } : i; })
    .filter(function (i) { return i.qty > 0; });
  saveCart(cart);
}
function refreshTop() { try { window.parent.frames['top'].updateTop(); } catch (e) {} }

// ----- Toast message -----
function toast(msg) {
  var t = el('div', { 'class': 'toast', role: 'status', text: msg });
  document.body.appendChild(t);
  setTimeout(function () { t.classList.add('show'); }, 10);
  setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }, 2200);
}

// ----- Accounts (demo only: data stays in this browser's localStorage) -----
function getUsers() { return read('store_users', []); }
function currentUser() { return read('store_current', null); }
function logout() { try { localStorage.removeItem('store_current'); } catch (e) {} refreshTop(); }
function hashPassword(pw, email) {
  var text = email.toLowerCase() + ':' + pw;
  if (window.crypto && crypto.subtle && window.TextEncoder) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  return Promise.resolve('plain:' + text);
}
