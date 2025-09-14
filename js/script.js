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
        <div class="qty-control" style="display:flex;justify-content:center;align-items:center;gap:8px;margin-bottom:10px;">
          <button class="qty-btn minus" data-id="${product.id}" style="width:32px;height:32px;font-size:1.2em;">-</button>
          <input type="number" min="1" value="1" class="qty-input" data-id="${product.id}" style="width:40px;text-align:center;">
          <button class="qty-btn plus" data-id="${product.id}" style="width:32px;height:32px;font-size:1.2em;">+</button>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">Tambahkan ke Keranjang</button>
      `;
      productGrid.appendChild(productCard);
    });

    // Event untuk tombol + dan -
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        let val = parseInt(input.value) || 1;
        if (btn.classList.contains("plus")) {
          input.value = val + 1;
        } else if (btn.classList.contains("minus")) {
          if (val > 1) input.value = val - 1;
        }
      });
    });

    // Event untuk tombol Tambahkan ke Keranjang
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        const qtyInput = document.querySelector(`.qty-input[data-id="${productId}"]`);
        const qty = Math.max(1, parseInt(qtyInput.value) || 1);
        const productToAdd = products.find((p) => p.id === productId);
        if (productToAdd) {
          addToTroli(productToAdd, qty);
        }
      });
    });
  }

  // Fungsi popup konfirmasi custom
  function showConfirmPopup(message, onYes, onNo) {
    const oldPopup = document.getElementById("custom-confirm-popup");
    if (oldPopup) oldPopup.remove();
    const popup = document.createElement("div");
    popup.id = "custom-confirm-popup";
    popup.style.position = "fixed";
    popup.style.left = "0";
    popup.style.top = "0";
    popup.style.width = "100vw";
    popup.style.height = "100vh";
    popup.style.background = "rgba(0,0,0,0.4)";
    popup.style.display = "flex";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";
    popup.style.zIndex = "9999";
    popup.innerHTML = `
      <div style="
        background: #fff;
        color: #222;
        border-radius: 12px;
        padding: 32px 24px 20px 24px;
        min-width: 280px;
        max-width: 90vw;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        text-align: center;
        font-family: 'Poppins',sans-serif;
      ">
        <div style="margin-bottom: 22px; font-size: 1.1em;">${message}</div>
        <div style="display: flex; gap: 18px; justify-content: center;">
          <button id="popup-yes-btn" style="
            background: #ff8c00;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          ">YA</button>
          <button id="popup-no-btn" style="
            background: #eee;
            color: #222;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          ">Tidak</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector("#popup-yes-btn").onclick = () => {
      popup.remove();
      if (onYes) onYes();
    };
    popup.querySelector("#popup-no-btn").onclick = () => {
      popup.remove();
      if (onNo) onNo();
    };
  }

  // Fungsi untuk menambahkan produk ke keranjang (dengan qty)
  function addToTroli(product, qty) {
    showConfirmPopup(
      "Apakah kamu yakin ingin menambahkan produk ini ke keranjang?",
      () => {
        // Cek apakah produk sudah ada di troli
        const idx = troli.findIndex((item) => item.id === product.id);
        if (idx !== -1) {
          troli[idx].qty += qty;
        } else {
          troli.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: qty,
          });
        }
        localStorage.setItem("troli", JSON.stringify(troli));
        renderTroli();
      },
      () => {}
    );
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
          <div class="item-details">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <span class="item-name">${item.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button class="troli-minus" data-id="${item.id}" style="width:28px;height:28px;">-</button>
            <span class="item-qty">${item.qty}</span>
            <button class="troli-plus" data-id="${item.id}" style="width:28px;height:28px;">+</button>
          </div>
          <span class="item-price">Rp ${(item.price * item.qty).toLocaleString("id-ID")}</span>
        `;
        troliItemsContainer.appendChild(troliItem);
        total += item.price * item.qty;
      });
    }
    if (totalPriceElement) totalPriceElement.textContent = `Rp ${total.toLocaleString("id-ID")}`;

    // Event untuk tombol + dan - di troli
    document.querySelectorAll(".troli-plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const idx = troli.findIndex((item) => item.id === id);
        if (idx !== -1) {
          troli[idx].qty += 1;
          localStorage.setItem("troli", JSON.stringify(troli));
          renderTroli();
        }
      });
    });
    document.querySelectorAll(".troli-minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const idx = troli.findIndex((item) => item.id === id);
        if (idx !== -1 && troli[idx].qty > 1) {
          troli[idx].qty -= 1;
          localStorage.setItem("troli", JSON.stringify(troli));
          renderTroli();
        } else if (idx !== -1 && troli[idx].qty === 1) {
          // Hapus produk jika qty jadi 0
          troli.splice(idx, 1);
          localStorage.setItem("troli", JSON.stringify(troli));
          renderTroli();
        }
      });
    });
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

document.addEventListener("DOMContentLoaded", () => {
  // Dapatkan elemen-elemen HTML
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const troliItemsContainer = document.getElementById("troliItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Ambil data troli dari localStorage, jika ada
  let troli = JSON.parse(localStorage.getItem("troli")) || [];

  // Fungsi untuk menampilkan produk di halaman pricelist
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
        <div class="qty-control" style="display:flex;justify-content:center;align-items:center;gap:8px;margin-bottom:10px;">
          <button class="qty-btn minus" data-id="${product.id}" style="width:32px;height:32px;font-size:1.2em;">-</button>
          <input type="number" min="1" value="1" class="qty-input" data-id="${product.id}" style="width:40px;text-align:center;">
          <button class="qty-btn plus" data-id="${product.id}" style="width:32px;height:32px;font-size:1.2em;">+</button>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">Tambahkan ke Keranjang</button>
      `;
      productGrid.appendChild(productCard);
    });

    // Event untuk tombol + dan -
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        let val = parseInt(input.value) || 1;
        if (btn.classList.contains("plus")) {
          input.value = val + 1;
        } else if (btn.classList.contains("minus")) {
          if (val > 1) input.value = val - 1;
        }
      });
    });

    // Event untuk tombol Tambahkan ke Keranjang
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        const qtyInput = document.querySelector(`.qty-input[data-id="${productId}"]`);
        const qty = Math.max(1, parseInt(qtyInput.value) || 1);
        const productToAdd = products.find((p) => p.id === productId);
        if (productToAdd) {
          addToTroli(productToAdd, qty);
        }
      });
    });
  }

  // Fungsi popup konfirmasi custom
  function showConfirmPopup(message, onYes, onNo) {
    const oldPopup = document.getElementById("custom-confirm-popup");
    if (oldPopup) oldPopup.remove();
    const popup = document.createElement("div");
    popup.id = "custom-confirm-popup";
    popup.style.position = "fixed";
    popup.style.left = "0";
    popup.style.top = "0";
    popup.style.width = "100vw";
    popup.style.height = "100vh";
    popup.style.background = "rgba(0,0,0,0.4)";
    popup.style.display = "flex";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";
    popup.style.zIndex = "9999";
    popup.innerHTML = `
      <div style="
        background: #fff;
        color: #222;
        border-radius: 12px;
        padding: 32px 24px 20px 24px;
        min-width: 280px;
        max-width: 90vw;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        text-align: center;
        font-family: 'Poppins',sans-serif;
      ">
        <div style="margin-bottom: 22px; font-size: 1.1em;">${message}</div>
        <div style="display: flex; gap: 18px; justify-content: center;">
          <button id="popup-yes-btn" style="
            background: #ff8c00;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          ">YA</button>
          <button id="popup-no-btn" style="
            background: #eee;
            color: #222;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          ">Tidak</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector("#popup-yes-btn").onclick = () => {
      popup.remove();
      if (onYes) onYes();
    };
    popup.querySelector("#popup-no-btn").onclick = () => {
      popup.remove();
      if (onNo) onNo();
    };
  }

  // Fungsi untuk menambahkan produk ke keranjang (dengan qty)
  function addToTroli(product, qty) {
    showConfirmPopup(
      "Apakah kamu yakin ingin menambahkan produk ini ke keranjang?",
      () => {
        // Cek apakah produk sudah ada di troli
        const idx = troli.findIndex((item) => item.id === product.id);
        if (idx !== -1) {
          troli[idx].qty += qty;
        } else {
          troli.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: qty,
          });
        }
        localStorage.setItem("troli", JSON.stringify(troli));
        renderTroli();
      },
      () => {}
    );
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
          <div class="item-details">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <span class="item-name">${item.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button class="troli-minus" data-id="${item.id}" style="width:28px;height:28px;">-</button>
            <span class="item-qty">${item.qty}</span>
            <button class="troli-plus" data-id="${item.id}" style="width:28px;height:28px;">+</button>
          </div>
          <span class="item-price">Rp ${(item.price * item.qty).toLocaleString("id-ID")}</span>
        `;
        troliItemsContainer.appendChild(troliItem);
        total += item.price * item.qty;
      });
    }
    if (totalPriceElement) totalPriceElement.textContent = `Rp ${total.toLocaleString("id-ID")}`;

    // Event untuk tombol + dan - di troli
    document.querySelectorAll(".troli-plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const idx = troli.findIndex((item) => item.id === id);
        if (idx !== -1) {
          troli[idx].qty += 1;
          localStorage.setItem("troli", JSON.stringify(troli));
          renderTroli();
        }
      });
    });
    document.querySelectorAll(".troli-minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const idx = troli.findIndex((item) => item.id === id);
        if (idx !== -1 && troli[idx].qty > 1) {
          troli[idx].qty -= 1;
          localStorage.setItem("troli", JSON.stringify(troli));
          renderTroli();
        } else if (idx !== -1 && troli[idx].qty === 1) {
          // Hapus produk jika qty jadi 0
          troli.splice(idx, 1);
          localStorage.setItem("troli", JSON.stringify(troli));
          renderTroli();
        }
      });
    });
  }

  // Event listener untuk tombol "Bayar"
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (troli.length > 0) {
        alert("Pembayaran berhasil! Total: " + totalPriceElement.textContent);
        troli = []; // Kosongkan troli setelah pembayaran
        localStorage.setItem("troli", JSON.stringify(troli));
        renderTroli(); // Perbarui tampilan troli
      } else {
        alert("Keranjangmu kosong. Tidak ada yang bisa dibayar.");
      }
    });
  }

  // Inisialisasi halaman saat dimuat
  if (document.querySelector(".pricelist-page")) {
    renderProducts(products); // Tampilkan produk di Pricelist
  }
  if (document.querySelector(".troli-page")) {
    renderTroli(); // Tampilkan isi troli di halaman Troli
  }

  // Event listener untuk pencarian (jika ada)
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm));
      renderProducts(filteredProducts);
    });
  }
});
