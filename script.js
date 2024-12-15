const cart = [];
let allMedicines = []; // Store all medicines globally

// Fetch the medicines and populate the UI
window.addEventListener("load", getData);
function getData() {
    fetch('medicine.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load medicine.json");        
            }
            return response.json();
        })
        .then(data => {
            allMedicines = data.medicines; // Store medicines data globally
            renderMedicines(allMedicines); // Initial render

            // Add event listener to all quantity inputs
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('input', (event) => {
                    const inputElement = event.target;
                    const name = inputElement.dataset.name;
                    const price = parseFloat(inputElement.dataset.price);
                    const quantity = parseInt(inputElement.value);

                    updateCart(name, price, quantity);
                });
            });
        

            // Add event listener for the search button
            document.getElementById('search-button').addEventListener('click', () => {
                const query = document.getElementById('search-input').value.trim().toLowerCase();
                if (query === "") {
                    renderMedicines(allMedicines); // If no query, show all medicines
                } else {
                    const filteredMedicines = allMedicines.map(category => ({
                        ...category,
                        items: category.items.filter(medicine =>
                            medicine.name.toLowerCase().includes(query)
                        )
                    })).filter(category => category.items.length > 0);

                    renderMedicines(filteredMedicines); // Display filtered medicines
                }
            });
        })
        .catch(error => {
            console.error("Error loading medicines:", error);
        });

    }
// Render medicines (called on page load and when search/filtering)
function renderMedicines(medicines) {
    medicines.forEach(category => {
        const section = document.getElementById(`medicine-section-${category.category.toLowerCase()}`);
        const container = section.querySelector('.scroll-container');
        container.innerHTML = ""; // Clear existing items

        category.items.forEach(medicine => {
            const card = document.createElement('div');
            card.className = 'medicine-card';

            card.innerHTML = `
                <img src="${medicine.image}" alt="${medicine.name}" class="medicine-image">
                <label for="${medicine.id}">${medicine.name}</label>
                <input type="number" id="${medicine.id}" class="quantity-input" 
                       placeholder="Quantity" data-name="${medicine.name}" 
                       data-price="${medicine.price}">
            `;

            container.appendChild(card);
        });
    });
}

// Update  table whenever quantity changes
const table = JSON.parse(localStorage.getItem('cart')) || [];
function updateCart(name, price, quantity) {
    if (isNaN(quantity) || quantity <= 0) {
        // Remove item if quantity is invalid or 0
        const index = cart.findIndex(item => item.name === name);
        if (index !== -1) {
            cart.splice(index, 1);
        }
    } else {
        // Add or update item in cart
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.totalPrice = quantity * price;
        } else {
            cart.push({ name, quantity, price, totalPrice: quantity * price });
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        
    }

    // Update the cart table
    updateCartTable();
}

function updateCartTable() {
    const cartItems = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");

    cartItems.innerHTML = ''; // Clear existing rows
    let totalPrice = 0;

    // Populate table with cart items
    cart.forEach(item => {
        totalPrice += item.totalPrice;
        const row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${item.totalPrice.toFixed(2)}</td>
            </tr>
        `;
        cartItems.innerHTML += row;
    });

    totalPriceEl.textContent = totalPrice.toFixed(2); // Update total price
}

// Handle "Buy Now" button
const buyNowButton = document.getElementById('buy-now-button');
buyNowButton.addEventListener('click', buyNow);

function buyNow() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    localStorage.setItem("orderDetails", JSON.stringify(cart));
    window.location.href = "checkout.html";
}

// Handle "Save Favorites" button
const saveFavBtn = document.getElementById('save-favorites-button');
saveFavBtn.addEventListener('click', saveFavorites);

function saveFavorites() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    localStorage.setItem("favorites", JSON.stringify(cart));
    alert("Favorites saved successfully!");
}

// Handle "Apply Favorites" button
const applyFavBtn = document.getElementById('apply-favorites-button');
applyFavBtn.addEventListener('click', applyFavorites);

function applyFavorites() {
    const favorites = localStorage.getItem("favorites");
    if (!favorites) {
        alert("No favorites found!");
        return;
    }

    const favoriteItems = JSON.parse(favorites);
    cart.length = 0;
    cart.push(...favoriteItems);
    updateCart();
    alert("Favorites applied successfully!");
}

// Add event listener for Remove Favorites button
const clearFavBtn = document.getElementById('clear-favorites-button');
clearFavBtn.addEventListener('click', clearFavorites);

// Function to remove favorites from localStorage
function clearFavorites() {
    if (localStorage.getItem("favorites")) {
        localStorage.removeItem("favorites"); // Remove the favorites key
        alert("Favorites have been cleared from local storage");
    } else {
        alert("No favorites to remove!");
    }
}

// Filter button functionality
const filterBtn = document.querySelectorAll('.filter-button');
const sections = document.querySelectorAll('.medicine-section');

filterBtn.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');

        // If "All" is clicked, show all sections
        if (category === "all") {
            sections.forEach(section => section.style.display = "block");
        } else {
            // Show the selected section, hide the rest
            sections.forEach(section => {
                if (section.id === `medicine-section-${category}`) {
                    section.style.display = "block";
                } else {
                    section.style.display = "none";
                }
            });
        }
    });
});


const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
        const orderDetailsDiv = document.getElementById("order-details");

        if (!orderDetails || orderDetails.length === 0) {
            orderDetailsDiv.textContent = "No items in the cart.";
        } else {
            orderDetails.forEach(item => {
                const div = document.createElement("div");
                div.textContent = `${item.name} - Quantity: ${item.quantity}, Total: $${item.totalPrice.toFixed(2)}`;
               
            });
        }

        function handlePayment(event) {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const payment = document.getElementById("payment").value;

            if (name && address && payment) {
                alert(`Thank you for your purchase, ${name}! Your order will be delivered soon.`);
            } else {
                alert("Please fill all fields.");
            }
        }
