// Load and display cart items
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartCounter();
});

function displayCart() {
    const cartContainer = document.getElementById('cartContainer');
    const cartSummary = document.getElementById('cartSummary');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #666;">Your cart is empty. <a href="index.html" style="color: #0f4971; font-weight: bold;">Continue shopping</a></p>';
        cartSummary.innerHTML = '<p style="padding: 2rem; text-align: center; color: #666;">Add items to proceed</p>';
        return;
    }

    let cartHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
            <thead>
                <tr style="background-color: #f0f0f0; border-bottom: 2px solid #0f4971;">
                    <th style="padding: 15px; text-align: left;">Product Name</th>
                    <th style="padding: 15px; text-align: center;">Price</th>
                    <th style="padding: 15px; text-align: center;">Quantity</th>
                    <th style="padding: 15px; text-align: center;">Total</th>
                    <th style="padding: 15px; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalPrice = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace(/,/g, '')) || 0;
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        totalPrice += itemTotal;

        cartHTML += `
            <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 15px; font-weight: 500;">${item.name}</td>
                <td style="padding: 15px; text-align: center;">$${price.toFixed(2)}</td>
                <td style="padding: 15px; text-align: center;">
                    <input type="number" min="1" value="${quantity}" onchange="updateQuantity(${index}, this.value)" style="width: 70px; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
                </td>
                <td style="padding: 15px; text-align: center; font-weight: bold; color: #27ae60;">$${itemTotal.toFixed(2)}</td>
                <td style="padding: 15px; text-align: center;">
                    <button onclick="removeFromCart(${index})" class="danger-btn" style="padding: 6px 12px; font-size: 0.9rem;">Remove</button>
                </td>
            </tr>
        `;
    });

    cartHTML += `
            </tbody>
        </table>
    `;

    cartContainer.innerHTML = cartHTML;

    // Display summary
    const shipping = 10.00;
    const tax = totalPrice * 0.08; // 8% tax
    const grandTotal = totalPrice + shipping + tax;

    cartSummary.innerHTML = `
        <div style="background-color: #f9f9f9; padding: 1.5rem; border-radius: 8px; border: 1px solid #e0e0e0;">
            <h3 style="margin-top: 0;">Summary</h3>
            <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem;">
                    <span>Subtotal:</span>
                    <strong>$${totalPrice.toFixed(2)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.75rem;">
                    <span>Shipping:</span>
                    <strong>$${shipping.toFixed(2)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f4971; padding-bottom: 0.75rem;">
                    <span>Tax (8%):</span>
                    <strong>$${tax.toFixed(2)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.3rem; color: #27ae60;">
                    <strong>Total:</strong>
                    <strong>$${grandTotal.toFixed(2)}</strong>
                </div>
            </div>

            <button onclick="proceedToCheckout()" class="primary-btn" style="width: 100%; margin-bottom: 0.75rem; padding: 0.85rem;">
                ✓ Proceed to Checkout
            </button>
            <a href="index.html" class="secondary-btn" style="width: 100%; display: block; text-align: center; padding: 0.85rem; text-decoration: none;">
                Continue Shopping
            </a>
        </div>
    `;

    updateCartCounter();
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        SecurityUtils.showCustomAlert('Your cart is empty', 'warning', 3000);
        return;
    }
    window.location.href = 'CheckoutPage.html';
}

function updateQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    } else {
        SecurityUtils.showCustomAlert('Quantity must be at least 1', 'error', 3000);
    }
}

function removeFromCart(index) {
    if (confirm('Are you sure you want to remove this item?')) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Update cart counter
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.length;
    const counter = document.getElementById('cartCount');
    if (counter) {
        if (count > 0) {
            counter.textContent = count;
            counter.style.display = 'flex';
        } else {
            counter.style.display = 'none';
        }
    }
}

// Expose to global scope
window.proceedToCheckout = proceedToCheckout;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
