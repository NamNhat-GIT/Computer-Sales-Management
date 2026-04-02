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
        // We use the 'card' class here. 
        // Note: I removed 'products-grid' from here because it's meant for the parent container.
        const card = `
            <div class="card" onclick="viewProductDetails('${product.name}')" style="cursor: pointer;">
                <h3>${product.name}</h3>
                <img src="Image/${product.name}.jpg" alt="${product.name} image">
                <p><strong>Price: $${product.price}</strong></p>
                <p>${product.description}</p>
                <button class="view-btn">View Details</button>
            </div>
        `;
        productList.innerHTML += card;
    });
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
