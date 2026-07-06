// =============================================
//  VigorSports — Lógica de la aplicación
// =============================================

// ---- Efecto de scroll en el Navbar ----
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg', 'shadow-vigor-red/5');
    } else {
        nav.classList.remove('shadow-lg', 'shadow-vigor-red/5');
    }
});

// ---- Intersection Observer para animaciones ----
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.observer-section').forEach(section => {
    observer.observe(section);
});

// ---- Acordeón FAQ ----
function toggleFaq(button) {
    const item = button.parentElement;
    document.querySelectorAll('.faq-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
    });
    item.classList.toggle('active');
}

// ---- Formulario de contacto ----
function submitContact(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalContent = btn.innerHTML;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        event.target.reset();
        const successMsg = document.getElementById('form-success');
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 4000);
    }, 1500);
}

// ---- Carrito de compras ----
let cart = [];

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.add('open');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    updateCartUI();
    showToast(`¡${name} agregado al carrito!`);

    // Animación en el ícono del carrito
    const cartIcon = document.querySelector('.fa-cart-shopping').parentElement;
    cartIcon.classList.add('scale-125', 'text-vigor-red');
    setTimeout(() => cartIcon.classList.remove('scale-125', 'text-vigor-red'), 200);
}

function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);
        updateCartUI();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl       = document.getElementById('cart-count');
    const cartTotalEl       = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalEl.textContent = `$${totalCost.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center text-gray-500 mt-10">
                <i class="fa-solid fa-box-open text-4xl mb-3"></i>
                <p>Tu carrito está vacío.</p>
                <p class="text-sm mt-2">¡Es hora de equiparse!</p>
            </div>`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 bg-vigor-darker p-3 rounded-lg border border-gray-800">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded bg-black">
            <div class="flex-1">
                <h4 class="text-sm font-bold text-white">${item.name}</h4>
                <div class="text-vigor-orange font-bold text-sm">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="flex items-center mt-2 space-x-2">
                    <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center bg-gray-800 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">-</button>
                    <span class="text-sm w-4 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center bg-gray-800 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-gray-500 hover:text-vigor-red p-2 transition-colors">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos artículos antes de pagar.');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    alert(`¡Gracias por tu compra en VigorSports!\nTotal a pagar: $${total}`);
    cart = [];
    updateCartUI();
    toggleCart();
}
