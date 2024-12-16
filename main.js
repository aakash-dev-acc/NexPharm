// Get the reference to the product container
let listProductHTML = document.querySelector('.listProduct');

// Load data from the JSON file
function loadData() {
    fetch('products.json')
        .then(rep => rep.json())
        .then((data) => {
            addDatatoHtml(data); // Render all products
            loadCart(); // Load cart from localStorage on page load
        })
        .catch(err => {
            console.error("Error loading products:", err);
        });
}

// Add all products to the HTML
function addDatatoHtml(products) {
    listProductHTML.innerHTML = ''; // Clear existing content

    products.forEach((product) => {
        // Create a div for each product
        let productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img class="item-img" src="${product.image}" alt="${product.name}">
            <div class="text">
                <h3>${product.name}</h3>
                <h4>${product.category}</h4>
                <div class="price">$${product.price}.00</div>
                <label for="item">Quantity: </label>
                <input type="number" min="0" value="0" class="item"
                    data-id="${product.id}" 
                    data-name="${product.name}" 
                    data-price="${product.price}" />
            </div>
        `;

        listProductHTML.appendChild(productDiv); // Append the product to the container
    });

    attachListeners(); // Attach event listeners after products are added
}

// Initialize the app
loadData();

// Attach event listeners to dynamically created inputs
function attachListeners() {
    const items = document.getElementsByClassName('item');
    for (let item of items) {
        item.removeEventListener('input', updateOrderSummary); // Remove any existing listeners to avoid duplicates
        item.addEventListener('input', updateOrderSummary); // Attach the listener
    }
}

// Update the order summary dynamically
function updateOrderSummary() {
    const tableBody = document.getElementById('order-table-body');
    tableBody.innerHTML = ''; // Clear the current summary

    const items = document.getElementsByClassName('item');
    let total = 0;

    for (let item of items) {
        const quantity = parseInt(item.value, 10);
        if (quantity > 0) {
            const name = item.dataset.name;
            const price = parseFloat(item.dataset.price);
            const rowPrice = price * quantity;

            // Add row to the table
            const row = `<tr><td>${name}</td><td>${quantity}</td><td class="price">${rowPrice.toFixed(2)}</td></tr>`;
            tableBody.innerHTML += row;

            total += rowPrice; // Add the price to the total
        }
    }

    calculateTotal(total); // Update the total price
    saveCartToLocalStorage(); // Save cart to localStorage every time it's updated
}

// Calculate the total price of the order
function calculateTotal(total) {
    document.getElementById('total-price').textContent = total.toFixed(2);
}

// Save cart data to localStorage
function saveCartToLocalStorage() {
    const items = document.getElementsByClassName('item');
    const cart = [];

    for (let item of items) {
        const quantity = parseInt(item.value, 10);
        if (quantity > 0) {
            cart.push({
                id: item.dataset.id,
                name: item.dataset.name,
                price: parseFloat(item.dataset.price),
                quantity: quantity
            });
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

// Load cart from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart && cart.length > 0) {
        cart.forEach(item => {
            const productInput = document.querySelector(`.item[data-id="${item.id}"]`);
            if (productInput) {
                productInput.value = item.quantity; // Set the saved quantity
            }
        });
        updateOrderSummary(); // Update the summary and total price after loading the cart
    }
}

// Function to save to favourites
const favouritesKey = 'favouriteOrder';
function saveToFavourites() {
    const tableBody = document.getElementById('order-table-body');
    const rows = Array.from(tableBody.getElementsByTagName('tr'));
    const favourites = rows.map(row => {
        const columns = row.getElementsByTagName('td');
        return {
            name: columns[0].textContent,
            quantity: columns[1].textContent,
            price: columns[2].textContent
        };
    });
    localStorage.setItem(favouritesKey, JSON.stringify(favourites));
    alert('Order saved to favourites!');
}

// Apply favourites function
function applyFavourites() {
    const favourites = JSON.parse(localStorage.getItem(favouritesKey));
    if (!favourites) {
        alert('No favourites found!');
        return;
    }

    const tableBody = document.getElementById('order-table-body');
    tableBody.innerHTML = '';
    favourites.forEach(item => {
        const row = `<tr><td>${item.name}</td><td>${item.quantity}</td><td class="price">${item.price}</td></tr>`;
        tableBody.innerHTML += row;
    });

    calculateTotal(); // Recalculate the total based on the applied favourites
    saveCartToLocalStorage();
}

document.getElementById('add-to-favourites').addEventListener('click', saveToFavourites);
document.getElementById('apply-favourites').addEventListener('click', applyFavourites);

// Checkout function
document.getElementById('checkout').addEventListener('click', navigateToCheckout);

function navigateToCheckout() {
    const orderTableBody = document.getElementById('order-table-body');
    const totalPriceElement = document.getElementById('total-price');

    if (orderTableBody && totalPriceElement) {
        const orderDetails = {
            items: [],
            total: totalPriceElement.textContent.trim()
        };

        const rows = orderTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const name = row.cells[0]?.textContent.trim();
            const quantity = row.cells[1]?.textContent.trim();
            const price = row.cells[2]?.textContent.trim();

            if (name && quantity && price) {
                orderDetails.items.push({ name, quantity, price });
            }
        });

        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        window.location.href = 'checkout.html';
    } else {
        console.error('Order table or total price element not found.');
    }
}

// Clear Cart function
function clearCart() {
    // Clear the localStorage
    localStorage.removeItem('cart');
    // Clear the displayed cart in the table
    const tableBody = document.getElementById('order-table-body');
    tableBody.innerHTML = ''; // Clear the table
    const items = document.getElementsByClassName('item');
    for (let item of items) {
        item.value = 0; // Reset all input fields to 0
    }
    calculateTotal(0); // Set total to 0
}

// Attach clear cart functionality to the button
document.getElementById('clear-cart').addEventListener('click', clearCart);
