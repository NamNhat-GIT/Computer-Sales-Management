// Sample product data--------------------------------------------
import { products } from "./ProductsData.js";
//-------------------------------------------------------------

const productList = document.getElementById("productList");

// Filter function
function filterProducts(filterString) {
    if (filterString === "all") {
        displayProducts(products);
        return;
    }

    // Split the string into an array, e.g., "phones apple" becomes ["phones", "apple"]
    const requiredTags = filterString.toLowerCase().split(' ');

    const filtered = products.filter(product => {
        // Lowercase all product categories for safe comparison
        const productCategories = product.category.map(cat => cat.toLowerCase());
        
        // Check if EVERY required tag is present in the product's category list
        return requiredTags.every(tag => productCategories.includes(tag));
    });

    displayProducts(filtered);
}

function displayProducts(list) {
    productList.innerHTML = "";

    list.forEach(product => {
        const card = `
            <div class="card" style="cursor: pointer;">
                <h3>${product.name}</h3>
                <img src="Image/${product.name}.jpg" alt="${product.name} image">
                <p><strong>Price: $${product.price}</strong></p>
                <p>${product.description}</p>
                <button class="view-btn" onclick="viewProductDetails('${product.name}')">View Details</button>
                <button class="add-cart-btn" onclick="addToCart('${product.name}')">Add to Cart</button>
            </div>
        `;
        productList.innerHTML += card;
    });
// Add to Cart function
function addToCart(productName) {
    // Get cart from localStorage or initialize
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Find product by name
    const product = products.find(p => p.name === productName);
    if (!product) return;
    // Check if already in cart
    const existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
}

window.addToCart = addToCart;
}

// Function to handle the card click
function viewProductDetails(productName) {
    // You can change this to redirect to a new page later:
    // window.location.href = `ProductDetails.html?name=${encodeURIComponent(productName)}`;
}

window.filterProducts = filterProducts;
window.viewProductDetails = viewProductDetails;

// Load all at start
displayProducts(products);
