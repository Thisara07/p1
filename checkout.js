function handlePayment(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    if (name && address && payment) {
        alert(`Thank you for your purchase, ${name}! Your order will be delivered soon.`);
    }
}

//loading the table
document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tableBody = document.getElementById('checkout-table').querySelector('tbody');
    const totalPriceElement = document.getElementById('total-price');

    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${subtotal.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    totalPriceElement.textContent = total.toFixed(2);
});