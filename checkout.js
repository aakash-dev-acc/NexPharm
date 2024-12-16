// Checkout page script

// Load order details from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    const tableBody = document.getElementById('checkout-table-body');
    const totalPriceElement = document.getElementById('checkout-total-price');

    if (orderDetails && orderDetails.items && tableBody && totalPriceElement) {
        // Populate the table with items
        orderDetails.items.forEach(item => {
            const row = `<tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td class="price">${item.price}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });

        // Display the total price
        totalPriceElement.textContent = `Total: $${orderDetails.total}`;
    } else {
        console.error('Failed to load order details or elements not found.');
    }
});

// Form validation
const checkoutForm = document.getElementById('checkout-form');
checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');

    let isValid = true;

    if (!name) {
        alert('Please enter your name.');
        isValid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        isValid = false;
    }
    if (!address) {
        alert('Please enter your address.');
        isValid = false;
    }
    if (!paymentMethod) {
        alert('Please select a payment method.');
        isValid = false;
    }

    if (isValid) {
        // Payment confirmation popup
        alert(`Payment successful!\n\nThank you for your purchase, ${name}.`);

        // Clear cart after successful checkout
        localStorage.removeItem('orderDetails');

        // Redirect to a success page or home page
        window.location.href = 'index.html';
    }
});
