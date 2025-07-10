// js/category.js

// DOM Elements
const productNameInput = document.getElementById("addProductName");
const productCategoryInput = document.getElementById("addCategory");
const productCodeInput = document.getElementById("addProductCode");
const productStockInput = document.getElementById("addProductStock");
const addProductBtn = document.getElementById("addProductBtn");
const modal = document.getElementById("addProductModal");
const categoryContainer = document.getElementById("categoriesContainer");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

// ✅ Get category from URL query string
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category")?.toLowerCase() || null;
}

// 🔄 Load products on page load
window.addEventListener("DOMContentLoaded", async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    window.location.href = "index.html";
    return;
  }
  loadProducts();
});

// ➕ Add Product
addProductBtn.addEventListener("click", async () => {
  const name = productNameInput.value.trim();
  const category = productCategoryInput.value;
  const code = productCodeInput.value.trim();
  

  // Check if code is unique
  const { data: existingProducts, error: codeCheckError } = await supabase
    .from("products")
    .select("id")
    .eq("part_number", code);

  if (codeCheckError) {
    alert("Error checking Part Number: " + codeCheckError.message);
    return;
  }

  if (existingProducts && existingProducts.length > 0) {
    alert("Part Number already exists. Please enter a unique Part Number.");
    return;
  }
  const stock = productStockInput.value.trim();

  if (!name || !category || !stock || !code) {
    alert("Please fill required fields.");
    return;
  }

  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  const { error: insertError } = await supabase.from("products").insert({
    name,
    category,
    part_number: code,
    stock,
    created_by: userId,
  });

  if (insertError) {
    alert("Product insert failed: " + insertError.message);
    return;
  }

  // Reset form
  productNameInput.value = "";
  productCodeInput.value = "";
  productStockInput.value = "";
  productCategoryInput.value = "";
  modal.classList.add("hidden");

  loadProducts();
});

// 🔎 Search Filter
searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = allProducts.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const category = item.category?.toLowerCase() || "";
    return (
      name.includes(keyword) ||
      category.includes(keyword)
    );
  });

  if (filtered.length === 0) {
    categoryContainer.innerHTML = "<p style='color: white; text-align: center;'>No results found.</p>";
  } else {
    // Render as table
    let tableHtml = `
    <div class="table-wrapper">
      <table class="search-table">
      <thead>
        <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Part Number</th>
        <th>Stock</th>
        </tr>
      </thead>
      <tbody>
    `;
    filtered.forEach(item => {
      tableHtml += `
      <tr class="search-row" data-id="${item.id}">
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.part_number || "0"}</td>
        <td>${item.stock}</td>
      </tr>
      `;
    });
    tableHtml += "</tbody></table>";
    categoryContainer.innerHTML = tableHtml;

    // Create popup container for edit controls
    let popup = document.getElementById("edit-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.style.display = "none";
      popup.innerHTML = `
        <div class="edit-container" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
        <strong>Name:</strong> <span id="popup-name"></span><br>
        <strong>Category:</strong> <span id="popup-category"></span><br>
        <strong>Part Number:</strong> <span id="popup-part-number"></span>
          </div>
          <div class="edit-stock-controls" style="display: flex;flex-direction: column; align-items: center; gap: 10px;">
            <span style="min-width: 80px;">Stock: <span id="popup-stock"></span></span>
            <div class="popup-save-close">
                    <button id="popup-minus-btn">-</button>
        <button id="popup-plus-btn">+</button>
            </div>
        <div class="popup-save-close">
          <button id="popup-save-btn">Save</button>
        <button id="popup-close-btn" style="margin-left: 20px;">Close</button>
        </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
        
           
          </div>
        </div>
      `;
      document.body.appendChild(popup);
    }

    let currentEditItem = null;
    let tempStock = 0;

    // Add click event to each row
    filtered.forEach(item => {
      const row = categoryContainer.querySelector(`.search-row[data-id="${item.id}"]`);
      row.addEventListener("click", () => {
        currentEditItem = item;
        tempStock = parseInt(item.stock);
        popup.querySelector("#popup-name").textContent = item.name || "";
        popup.querySelector("#popup-category").textContent = item.category || "";
        popup.querySelector("#popup-part-number").textContent = item.part_number || "";
        popup.querySelector("#popup-stock").textContent = tempStock;
        popup.style.display = "";
      });
    });

    // Popup button events
    popup.querySelector("#popup-minus-btn").onclick = (e) => {
      e.stopPropagation();
      if (tempStock > 0) tempStock--;
      popup.querySelector("#popup-stock").textContent = tempStock;
    };
    popup.querySelector("#popup-plus-btn").onclick = (e) => {
      e.stopPropagation();
      tempStock++;
      popup.querySelector("#popup-stock").textContent = tempStock;
    };
    popup.querySelector("#popup-save-btn").onclick = async (e) => {
      e.stopPropagation();
      if (!currentEditItem) return;
      const { error } = await supabase
        .from("products")
        .update({ stock: tempStock })
        .eq("id", currentEditItem.id);

      if (!error) {
        currentEditItem.stock = tempStock;
        // Update the table row stock cell
        const row = categoryContainer.querySelector(`.search-row[data-id="${currentEditItem.id}"]`);
        if (row) row.querySelector("td:last-child").textContent = tempStock;
        popup.style.display = "none";
      } else {
        alert("Failed to update stock: " + error.message);
      }
    };
    popup.querySelector("#popup-close-btn").onclick = (e) => {
      e.stopPropagation();
      popup.style.display = "none";
    };
  }
});

// 📦 Load Products
async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error loading products:", error.message);
    return;
  }

  allProducts = data;

  const selectedCategory = getCategoryFromURL();
  if (selectedCategory) {
    const filtered = allProducts.filter(
      (item) => item.category?.toLowerCase().trim() === selectedCategory
    );
    renderProducts(filtered);
  } else {
    renderProducts(allProducts);
  }
}

// 🔁 Render Products
function renderProducts(data) {
  const grouped = data.reduce((acc, item) => {
    const categoryKey = item.category?.trim().toLowerCase();
    if (!acc[categoryKey]) acc[categoryKey] = [];
    acc[categoryKey].push(item);
    return acc;
  }, {});
  let html = "";
  Object.keys(grouped).forEach(category => {
    html += `
    <div class="table-wrapper">
      <table class="search-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Part Number</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
    `;
    grouped[category].forEach(item => {
      html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.part_number || "0"}</td>
          <td>${item.stock}</td>
        </tr>
      `;
    });
    html += `
        </tbody>
      </table>
    </div>
    `;
  });
  categoryContainer.innerHTML = html || "<p style='color: white; text-align: center;'>No products found.</p>";
  
}

// 🚪 Logout Button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });
}
