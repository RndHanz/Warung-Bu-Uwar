document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const troliItemsContainer = document.getElementById("troliItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let troli = JSON.parse(localStorage.getItem("troli")) || [];

  // Fungsi untuk menampilkan produk
  function renderProducts(filteredProducts) {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">Rp ${product.price.toLocaleString("id-ID")}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Tambahkan ke Keranjang</button>
            `;
      productGrid.appendChild(productCard);
    });

    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        const productToAdd = products.find((p) => p.id === productId);
        if (productToAdd) {
          addToTroli(productToAdd);
        }
      });
    });
  }

  // Fungsi untuk menambahkan produk ke keranjang
  function addToTroli(product) {
    troli.push(product);
    localStorage.setItem("troli", JSON.stringify(troli));
    alert(`${product.name} telah ditambahkan ke keranjang!`);
  }

  // Fungsi untuk menampilkan isi keranjang
  function renderTroli() {
    if (!troliItemsContainer) return;
    troliItemsContainer.innerHTML = "";
    let total = 0;
    if (troli.length === 0) {
      troliItemsContainer.innerHTML = "<p>Keranjangmu kosong.</p>";
    } else {
      troli.forEach((item) => {
        const troliItem = document.createElement("div");
        troliItem.classList.add("troli-item");
        troliItem.innerHTML = `
                    <span>${item.name}</span>
                    <span>Rp ${item.price.toLocaleString("id-ID")}</span>
                `;
        troliItemsContainer.appendChild(troliItem);
        total += item.price;
      });
    }
    totalPriceElement.textContent = `Rp ${total.toLocaleString("id-ID")}`;
  }

  // Pencarian real-time
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm));
      renderProducts(filteredProducts);
    });
  }

  // Tombol Bayar
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (troli.length > 0) {
        alert("Pembayaran berhasil! Total: " + totalPriceElement.textContent);
        troli = [];
        localStorage.setItem("troli", JSON.stringify(troli));
        renderTroli();
      } else {
        alert("Keranjangmu kosong. Tidak ada yang bisa dibayar.");
      }
    });
  }

  // Inisialisasi halaman
  if (productGrid) {
    renderProducts(products); // Tampilkan semua produk saat halaman Pricelist dimuat
  }
  if (troliItemsContainer) {
    renderTroli(); // Tampilkan keranjang saat halaman Troli dimuat
  }

  // Hamburger menu logic
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navActions = document.querySelector(".nav-actions");
  if (hamburger && navLinks && navActions) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("mobile-active");
      navActions.classList.toggle("mobile-active");
    });
    // Optional: close menu on link click (mobile)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("mobile-active");
        navActions.classList.remove("mobile-active");
      });
    });
  }
});
