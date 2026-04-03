// Import product data
import { products } from "./ProductsData.js";

// State management
let currentProducts = [...products];
let currentFilter = "all";
let currentSort = "";
let currentSearch = "";

const productList = document.getElementById("productList");

// ====== FILTER FUNCTION ======
function filterProducts(filterString) {
    currentFilter = filterString;
    if (filterString === "all") {
        currentProducts = [...products];
    } else {
        const requiredTags = filterString.toLowerCase().split(' ');
        currentProducts = products.filter(product => {
            const productCategories = product.category.map(cat => cat.toLowerCase());
            return requiredTags.every(tag => productCategories.includes(tag));
        });
    }
    applyAllFiltersAndDisplay();
}

// ====== SEARCH FUNCTION ======
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    currentSearch = searchInput.value.toLowerCase();
    
    currentProducts = products.filter(product => {
        const name = product.name.toLowerCase();
        const description = product.description.toLowerCase();
        const category = product.category.join(' ').toLowerCase();
        
        return name.includes(currentSearch) || 
               description.includes(currentSearch) || 
               category.includes(currentSearch);
    });
    
    applyAllFiltersAndDisplay();
}

// ====== SORT FUNCTION ======
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    currentSort = sortSelect.value;
    applyAllFiltersAndDisplay();
}

// ====== APPLY ALL FILTERS AND DISPLAY ======
function applyAllFiltersAndDisplay() {
    let filtered = [...currentProducts];

    // Apply current filter
    if (currentFilter !== "all" && currentSearch === "") {
        const requiredTags = currentFilter.toLowerCase().split(' ');
        filtered = filtered.filter(product => {
            const productCategories = product.category.map(cat => cat.toLowerCase());
            return requiredTags.every(tag => productCategories.includes(tag));
        });
    }

    // Sort products
    if (currentSort) {
        filtered = sortProductsList(filtered, currentSort);
    }

    displayProducts(filtered);
}

// ====== SORT PRODUCTS LIST ======
function sortProductsList(list, sortType) {
    const sorted = [...list];
    
    switch(sortType) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sorted.sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/,/g, ''));
                const priceB = parseFloat(b.price.replace(/,/g, ''));
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            sorted.sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/,/g, ''));
                const priceB = parseFloat(b.price.replace(/,/g, ''));
                return priceB - priceA;
            });
            break;
        case 'rating':
            sorted.sort((a, b) => {
                const ratingA = getRating(a.name) || 0;
                const ratingB = getRating(b.name) || 0;
                return ratingB - ratingA;
            });
            break;
    }
    
    return sorted;
}

// ====== DISPLAY PRODUCTS ======
function displayProducts(list) {
    productList.innerHTML = "";

    if (list.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found. Try a different search or filter.</p>';
        return;
    }

    list.forEach(product => {
        const rating = getRating(product.name);
        const ratingStars = generateStars(rating);
        
        const card = `
            <div class="card">
                <img src="Image/${product.name}.jpg" alt="${product.name} image" onerror="this.src='https://via.placeholder.com/250x200?text=Product+Image'">
                <h3>${product.name}</h3>
                <div class="card-rating">${ratingStars} (${getRatingCount(product.name) || 0} reviews)</div>
                <p class="card-price">$${product.price}</p>
                <p>${product.description}</p>
                <div class="card-buttons">
                    <button class="view-btn" onclick="viewProductDetails('${product.name.replace(/'/g, "\\'")}')">View Details</button>
                    <button class="add-cart-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}')">Add to Cart</button>
                </div>
            </div>
        `;
        productList.innerHTML += card;
    });
    
    updateCartCounter();
}

// ====== GET PRODUCT RATING ======
function getRating(productName) {
    const ratings = JSON.parse(localStorage.getItem('productRatings')) || {};
    if (ratings[productName] && ratings[productName].length > 0) {
        const avg = ratings[productName].reduce((a, b) => a + b, 0) / ratings[productName].length;
        return Math.round(avg * 10) / 10;
    }
    return null;
}

function getRatingCount(productName) {
    const ratings = JSON.parse(localStorage.getItem('productRatings')) || {};
    return ratings[productName] ? ratings[productName].length : 0;
}

// ====== GENERATE STARS DISPLAY ======
function generateStars(rating) {
    if (!rating) return '⭐ No ratings yet';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalf) stars += '✨';
    return stars + ` ${rating}`;
}

// ====== ADD TO CART ======
function addToCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.name === productName);
    
    if (!product) return;
    
    const existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification('Added to cart!', 'success');
}

// ====== VIEW PRODUCT DETAILS ======
function viewProductDetails(productName) {
    // Could redirect to a details page in the future
    showNotification(`Viewing details for ${productName}`, 'info');
}

// ====== RESET FILTERS ======
function resetFilters() {
    currentFilter = "all";
    currentSearch = "";
    currentSort = "";
    document.getElementById('searchInput').value = "";
    document.getElementById('sortSelect').value = "";
    currentProducts = [...products];
    displayProducts(currentProducts);
}

// ====== NOTIFICATION SYSTEM ======
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '400px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ====== UPDATE CART COUNTER ======
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

// ====== EXPOSE FUNCTIONS TO GLOBAL SCOPE ======
window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
window.sortProducts = sortProducts;
window.resetFilters = resetFilters;
window.viewProductDetails = viewProductDetails;
window.addToCart = addToCart;

// ====== INITIALIZE ======
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(currentProducts);
    updateCartCounter();
});
