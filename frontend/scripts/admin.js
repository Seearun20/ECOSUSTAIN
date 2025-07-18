document.addEventListener('DOMContentLoaded', () => {

  console.log('✅ DOM fully loaded. Initializing Admin Dashboard...');

  lucide.createIcons();

  let products = [];
  let editingProduct = null;
  let searchTerm = '';
  let selectedCategory = 'all';

  // DOM elements
  const productModal = document.getElementById('product-modal');
  const qrModal = document.getElementById('qr-modal');
  const productTableBody = document.getElementById('products-table-body');
  const noProductsMessage = document.getElementById('no-products-message');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const addProductBtn = document.getElementById('add-product-btn');
  const closeProductModal = document.getElementById('close-product-modal');
  const cancelProductBtn = document.getElementById('cancel-product-btn');
  const saveProductBtn = document.getElementById('save-product-btn');
  const closeQRModal = document.getElementById('close-qr-modal');
  const downloadQRBtn = document.getElementById('download-qr-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const generateCodeBtn = document.getElementById('generate-code-btn');

  // Form inputs
  const productCodeInput = document.getElementById('product-code');
  const productNameInput = document.getElementById('product-name');
  const productCategoryInput = document.getElementById('product-category');
  const productImageInput = document.getElementById('product-image');
  const sustainabilityScoreInput = document.getElementById('sustainability-score');
  const recyclabilityStatusInput = document.getElementById('recyclability-status');
  const recyclableInput = document.getElementById('recyclable');
  const ethicalSourcingInput = document.getElementById('ethical-sourcing');
  const carbonRawMaterialInput = document.getElementById('carbon-raw-material');
  const carbonManufacturingInput = document.getElementById('carbon-manufacturing');
  const carbonTransportationInput = document.getElementById('carbon-transportation');
  const carbonUsageInput = document.getElementById('carbon-usage');
  const carbonEndOfLifeInput = document.getElementById('carbon-end-of-life');
  const carbonTotalInput = document.getElementById('carbon-total');
  const productModalTitle = document.getElementById('product-modal-title');

  function calculateTotalFootprint(footprint) {
    return (
      (parseFloat(footprint.rawMaterial) || 0) +
      (parseFloat(footprint.manufacturing) || 0) +
      (parseFloat(footprint.transportation) || 0) +
      (parseFloat(footprint.usage) || 0) +
      (parseFloat(footprint.endOfLife) || 0)
    );
  }

  function generateProductCode(category) {
    const prefix = category ? category.substring(0, 3).toUpperCase() : 'PRD';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }

  function generateQRCode(productCode) {
    // ✅ IMPORTANT: Replace with your LAN IP or hosted domain
    const baseURL = 'https://ecosustain.onrender.com'; // Replace with your actual Render URL // Replace with your local IP or public URL
    const productURL = `${baseURL}/product.html?code=${productCode}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(productURL)}`;
  }

  function getSustainabilityColor(score) {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  }

  function updateStats() {
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('recyclable-products').textContent = products.filter(p => p.recyclable).length;
    document.getElementById('avg-sustainability').textContent = products.length > 0
      ? Math.round(products.reduce((sum, p) => sum + p.sustainabilityScore, 0) / products.length)
      : 0;
    document.getElementById('qr-codes').textContent = products.length;
  }

  function renderProducts() {
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    productTableBody.innerHTML = '';

    filteredProducts.forEach(product => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12">
              <div class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <i data-lucide="package" class="h-5 w-5 text-gray-400"></i>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${product.name}</div>
              <div class="text-sm text-gray-500">${product.category}</div>
              <div class="text-xs text-gray-400 font-mono">${product.productCode}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="sustainability-badge ${getSustainabilityColor(product.sustainabilityScore)}">
            ${product.sustainabilityScore}/100
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            ${product.recyclable ? '<i data-lucide="recycle" class="h-4 w-4 text-green-600 mr-2"></i>' : ''}
            <span class="text-sm text-gray-900">${product.recyclabilityStatus || 'N/A'}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${product.carbonFootprint.total} kg CO2e</div>
          <div class="text-xs text-gray-500">Total footprint</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex space-x-2">
            <button class="text-purple-600 hover:text-purple-900 qr-btn" data-id="${product._id}" title="Generate QR Code">
              <i data-lucide="qr-code" class="h-4 w-4"></i>
            </button>
            <button class="text-blue-600 hover:text-blue-900 edit-btn" data-id="${product._id}" title="Edit Product">
              <i data-lucide="edit" class="h-4 w-4"></i>
            </button>
            <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${product._id}" title="Delete Product">
              <i data-lucide="trash-2" class="h-4 w-4"></i>
            </button>
          </div>
        </td>
      `;
      productTableBody.appendChild(row);
    });

    noProductsMessage.classList.toggle('hidden', filteredProducts.length > 0);
    if (filteredProducts.length === 0) {
      noProductsMessage.querySelector('p').textContent = searchTerm || selectedCategory !== 'all'
        ? 'Try adjusting your search or filter criteria.'
        : 'Get started by adding your first product.';
    }

    lucide.createIcons();
  }

  function resetProductForm() {
    productCodeInput.value = '';
    productNameInput.value = '';
    productCategoryInput.value = '';
    productImageInput.value = '';
    sustainabilityScoreInput.value = '';
    recyclabilityStatusInput.value = '';
    recyclableInput.checked = false;
    ethicalSourcingInput.value = '';
    carbonRawMaterialInput.value = '';
    carbonManufacturingInput.value = '';
    carbonTransportationInput.value = '';
    carbonUsageInput.value = '';
    carbonEndOfLifeInput.value = '';
    carbonTotalInput.value = '';
  }

  addProductBtn.addEventListener('click', () => {
    editingProduct = null;
    productModalTitle.textContent = 'Add New Product';
    saveProductBtn.querySelector('span').textContent = 'Save Product';
    resetProductForm();
    productModal.classList.add('active');
  });

  closeProductModal.addEventListener('click', () => {
    productModal.classList.remove('active');
    resetProductForm();
  });

  cancelProductBtn.addEventListener('click', () => {
    productModal.classList.remove('active');
    resetProductForm();
  });

  generateCodeBtn.addEventListener('click', () => {
    productCodeInput.value = generateProductCode(productCategoryInput.value);
  });

  saveProductBtn.addEventListener('click', async () => {
    console.log('✅ Save button clicked!');
    if (!productNameInput.value.trim() || !productCategoryInput.value.trim()) {
      alert('Please enter product name and category.');
      return;
    }

    if (!productCodeInput.value.trim()) {
      productCodeInput.value = generateProductCode(productCategoryInput.value);
    }

    const productCode = productCodeInput.value;

    const newProduct = {
      productCode,
      name: productNameInput.value,
      image: productImageInput.value,
      recyclable: recyclableInput.checked,
      sustainabilityScore: parseInt(sustainabilityScoreInput.value) || 0,
      recyclabilityStatus: recyclabilityStatusInput.value,
      carbonFootprint: {
        rawMaterial: parseFloat(carbonRawMaterialInput.value) || 0,
        manufacturing: parseFloat(carbonManufacturingInput.value) || 0,
        transportation: parseFloat(carbonTransportationInput.value) || 0,
        usage: parseFloat(carbonUsageInput.value) || 0,
        endOfLife: parseFloat(carbonEndOfLifeInput.value) || 0,
        total: calculateTotalFootprint({
          rawMaterial: carbonRawMaterialInput.value,
          manufacturing: carbonManufacturingInput.value,
          transportation: carbonTransportationInput.value,
          usage: carbonUsageInput.value,
          endOfLife: carbonEndOfLifeInput.value
        })
      },
      ethicalSourcing: ethicalSourcingInput.value,
      category: productCategoryInput.value,
      qrCodeUrl: generateQRCode(productCode),
      dateAdded: editingProduct ? editingProduct.dateAdded : new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch(
        editingProduct ? `/api/products/${editingProduct._id}` : '/api/products',
        {
          method: editingProduct ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        }
      );

      console.log('✅ Sent request, waiting for response...');

      if (!response.ok) {
        const data = await response.json();
        alert(`Error: ${data.error || response.statusText}`);
        return;
      }

      const savedProduct = await response.json();
      console.log('✅ Saved product:', savedProduct);

      if (editingProduct) {
        products = products.map(p => p._id === savedProduct._id ? savedProduct : p);
      } else {
        products.push(savedProduct);
      }

      updateStats();
      renderProducts();
      productModal.classList.remove('active');
      resetProductForm();
    } catch (err) {
      console.error(err);
      alert('Network error while saving product.');
    }
  });

  searchInput.addEventListener('input', e => {
    searchTerm = e.target.value;
    renderProducts();
  });

  categoryFilter.addEventListener('change', e => {
    selectedCategory = e.target.value;
    renderProducts();
  });

  productTableBody.addEventListener('click', async e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.classList.contains('qr-btn')) {
      const product = products.find(p => p._id === id);
      document.getElementById('qr-modal-title').textContent = `QR Code for ${product.name}`;
      document.getElementById('qr-code-image').src = product.qrCodeUrl;
      document.getElementById('qr-product-code').textContent = product.productCode;
      qrModal.classList.add('active');
    } else if (btn.classList.contains('edit-btn')) {
      editingProduct = products.find(p => p._id === id);
      productModalTitle.textContent = 'Edit Product';
      saveProductBtn.querySelector('span').textContent = 'Update Product';
      productCodeInput.value = editingProduct.productCode;
      productNameInput.value = editingProduct.name;
      productCategoryInput.value = editingProduct.category;
      productImageInput.value = editingProduct.image;
      sustainabilityScoreInput.value = editingProduct.sustainabilityScore;
      recyclabilityStatusInput.value = editingProduct.recyclabilityStatus;
      recyclableInput.checked = editingProduct.recyclable;
      ethicalSourcingInput.value = editingProduct.ethicalSourcing;
      carbonRawMaterialInput.value = editingProduct.carbonFootprint.rawMaterial;
      carbonManufacturingInput.value = editingProduct.carbonFootprint.manufacturing;
      carbonTransportationInput.value = editingProduct.carbonFootprint.transportation;
      carbonUsageInput.value = editingProduct.carbonFootprint.usage;
      carbonEndOfLifeInput.value = editingProduct.carbonFootprint.endOfLife;
      carbonTotalInput.value = editingProduct.carbonFootprint.total;
      productModal.classList.add('active');
    } else if (btn.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this product?')) {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        products = products.filter(p => p._id !== id);
        updateStats();
        renderProducts();
      }
    }
  });

  [carbonRawMaterialInput, carbonManufacturingInput, carbonTransportationInput,
    carbonUsageInput, carbonEndOfLifeInput].forEach(input => {
    input.addEventListener('input', () => {
      carbonTotalInput.value = calculateTotalFootprint({
        rawMaterial: carbonRawMaterialInput.value,
        manufacturing: carbonManufacturingInput.value,
        transportation: carbonTransportationInput.value,
        usage: carbonUsageInput.value,
        endOfLife: carbonEndOfLifeInput.value
      }).toFixed(1);
    });
  });

  closeQRModal.addEventListener('click', () => {
    qrModal.classList.remove('active');
  });

  downloadQRBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = document.getElementById('qr-code-image').src;
    link.download = `qr-code-${document.getElementById('qr-product-code').textContent}.png`;
    link.click();
  });

  copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('qr-product-code').textContent);
    alert('Product code copied to clipboard!');
  });

  async function loadProductsFromServer() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      products = data;
      updateStats();
      renderProducts();
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }

  updateStats();
  renderProducts();
  loadProductsFromServer();

});
