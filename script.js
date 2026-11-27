let cart = JSON.parse(localStorage.getItem("timelessCart")) || [];

// ADD TO CART
function addToCart(name, price) {
    let existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    displayCart();
     showCartPopup();
}

// DISPLAY CART AND CALCULATE TOTAL
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";
    let cartCount = document.getElementById("cart-count");

if (cartCount) {
    cartCount.innerText = cart.reduce(
        (total, item) => total + item.quantity, 0
    );
}

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: Rs. ${item.price}</p>
                <p>Quantity: ${item.quantity}</p>

                <button onclick="changeQuantity(${index}, -1)">-</button>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button onclick="removeProduct(${index})">Remove</button>
            </div>
        `;
    });
   cartTotal.innerText = total.toLocaleString("en-PK");
localStorage.setItem("timelessCart", JSON.stringify(cart));
}

// CHANGE QUANTITY
function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    displayCart();
}

// REMOVE PRODUCT
function removeProduct(index) {
    cart.splice(index, 1);
    displayCart();
}

// ADD TO CART BUTTONS
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function() {
        let name = this.dataset.name;
        let price = this.dataset.price;

        addToCart(name, price);
    });
});

// CATEGORY FILTERS
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".grid .card");

filterButtons.forEach(button => {
    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        const selectedCategory = this.dataset.filter.toLowerCase();

        productCards.forEach(card => {
            const productCategory =
                (card.dataset.category || "").toLowerCase();

            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// SHOW EMPTY CART ON PAGE LOAD
displayCart();
function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add a product first.");
        return;
    }

    window.location.href = "checkout.html";
}

let wishlist = JSON.parse(localStorage.getItem("timelessWishlist")) || [];

// ADD OR REMOVE FROM WISHLIST
function addToWishlist(button) {

    let card = button.closest(".card");
    let name = card.querySelector("h3").innerText;

    if (wishlist.includes(name)) {

        wishlist = wishlist.filter(item => item !== name);
        button.innerHTML = "♡";
        button.classList.remove("active");

        alert("Product removed from Wishlist!");

    } else {

        wishlist.push(name);
        button.innerHTML = "♥";
        button.classList.add("active");

        alert("Product added to Wishlist!");
    }

    localStorage.setItem("timelessWishlist", JSON.stringify(wishlist));

    renderWishlist();
}

// KEEP SAVED HEARTS FILLED AFTER REFRESH
document.querySelectorAll(".wishlist-btn").forEach(button => {

    let card = button.closest(".card");
    let name = card.querySelector("h3").innerText;

    if (wishlist.includes(name)) {
        button.innerHTML = "♥";
        button.classList.add("active");
    }
});

// DISPLAY WISHLIST PRODUCTS
function renderWishlist() {

    let wishlistItems = document.getElementById("wishlist-items");

    wishlistItems.innerHTML = "";
    let wishlistCount = document.getElementById("wishlist-count");

if (wishlistCount) {
    wishlistCount.innerText = wishlist.length;
}

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = "<p>Your wishlist is empty. ❤️</p>";
        return;
    }

    wishlist.forEach(name => {

        let originalCard = [...document.querySelectorAll(".grid .card")]
            .find(card => card.querySelector("h3").innerText === name);

        if (!originalCard) return;

        let image = originalCard.querySelector("img").src;
        let price = originalCard.querySelector("p").innerText;
        let productLink = originalCard.querySelector("a").getAttribute("href");
        let productPrice = originalCard.querySelector(".add-to-cart").dataset.price;

        let item = document.createElement("div");
        item.className = "wishlist-item";

        item.innerHTML = `
    <img src="${image}" alt="${name}">
    <h3>${name}</h3>
    <p>${price}</p>

    <a href="${productLink}" class="view-product-btn">
    VIEW PRODUCT →
</a>

<button class="wishlist-cart-btn">
    ADD TO CART 🛍️
</button>

<button class="remove-wishlist-btn">
    REMOVE ❤️
</button>
`;

        item.querySelector(".remove-wishlist-btn").addEventListener("click", function() {
            removeFromWishlist(name);
        });
item.querySelector(".wishlist-cart-btn").addEventListener("click", function() {
    addToCart(name, productPrice);
});
        wishlistItems.appendChild(item);
    });
}

// REMOVE PRODUCT FROM WISHLIST
function removeFromWishlist(name) {

    wishlist = wishlist.filter(item => item !== name);

    localStorage.setItem("timelessWishlist", JSON.stringify(wishlist));

    document.querySelectorAll(".wishlist-btn").forEach(button => {

        let card = button.closest(".card");

        if (card.querySelector("h3").innerText === name) {
            button.innerHTML = "♡";
            button.classList.remove("active");
        }
    });

    renderWishlist();
}

// SHOW WISHLIST ON PAGE LOAD
renderWishlist();

function showCartPopup() {
    let overlay = document.getElementById("cart-overlay");

    overlay.classList.add("show");
}



function closeCartPopup() {
    let overlay = document.getElementById("cart-overlay");

    overlay.classList.remove("show");
}
