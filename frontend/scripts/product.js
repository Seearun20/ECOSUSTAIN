document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ product.js loaded');

  // Set current date
  document.getElementById('scanDate').textContent = new Date().toLocaleDateString();

  // Animate progress bar
  setTimeout(() => {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = '100%';
    } else {
      console.error('❌ progressFill element not found');
    }
  }, 500);

  // Interactive steps
  const steps = document.querySelectorAll('.step');
  let currentStep = 0;

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.remove('active');
      if (index === stepIndex) {
        step.classList.add('active');
      }
    });
  }

  // Auto-cycle through steps
  setInterval(() => {
    showStep(currentStep);
    currentStep = (currentStep + 1) % steps.length;
  }, 3000);

  // Click interaction
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      currentStep = index;
      showStep(currentStep);
    });
  });

  // Add pulse animation to sustainability score
  const score = document.querySelector('.sustainability-score');
  if (score) {
    score.classList.add('pulse');
  } else {
    console.error('❌ sustainability-score element not found');
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for scroll animations
  document.querySelectorAll('.section, .info-card').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Function to get query parameter
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    console.log(`✅ Query param ${param}: ${value}`);
    return value;
  }

  // Fetch product details by productCode
  async function loadProductDetails() {
    const productCode = getQueryParam('code');
    if (!productCode) {
      console.error('❌ No product code provided in URL');
      document.getElementById('product-details').innerHTML = '<p class="text-red-600">No product code provided in URL.</p>';
      return;
    }

    console.log(`✅ Fetching product data for code: ${productCode}`);
    document.getElementById('product-details').innerHTML = '<p>Loading product details...</p>';

    try {
      const response = await fetch(`https://ecosustain.onrender.com/api/products/code/${productCode}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`✅ Fetch response status: ${response.status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const product = await response.json();
      console.log('✅ Product data received:', product);

      // Update page with product details
      document.getElementById('product-name').textContent = product.name || 'N/A';
      document.getElementById('product-category').textContent = product.category || 'N/A';
      document.getElementById('product-code').textContent = product.productCode || 'N/A';
      document.getElementById('sustainability-score').textContent = `${product.sustainabilityScore || 0}/100`;
      
      // Apply sustainability score color
      const scoreElement = document.getElementById('sustainability-score');
      if (scoreElement) {
        scoreElement.className = `sustainability-score ${getSustainabilityColor(product.sustainabilityScore)}`;
      } else {
        console.error('❌ sustainability-score element not found for styling');
      }

      document.getElementById('recyclability-status').textContent = product.recyclabilityStatus || 'N/A';
      document.getElementById('recyclable').textContent = product.recyclable ? 'Yes' : 'No';
      document.getElementById('ethical-sourcing').textContent = product.ethicalSourcing || 'N/A';
      document.getElementById('carbon-footprint').textContent = `${product.carbonFootprint.total || 0} kg CO2e`;
      
      // Update carbon footprint breakdown
      document.getElementById('carbon-raw-material').textContent = `${product.carbonFootprint.rawMaterial || 0} kg CO2e`;
      document.getElementById('carbon-manufacturing').textContent = `${product.carbonFootprint.manufacturing || 0} kg CO2e`;
      document.getElementById('carbon-transportation').textContent = `${product.carbonFootprint.transportation || 0} kg CO2e`;
      document.getElementById('carbon-usage').textContent = `${product.carbonFootprint.usage || 0} kg CO2e`;
      document.getElementById('carbon-end-of-life').textContent = `${product.carbonFootprint.endOfLife || 0} kg CO2e`;

      // Update product image if available
      const productImage = document.getElementById('product-image');
      if (product.image) {
        productImage.src = product.image;
        productImage.alt = product.name || 'Product Image';
      } else {
        productImage.src = 'https://via.placeholder.com/150';
        productImage.alt = 'No image available';
      }

      // Update certifications
      const certificationsList = document.getElementById('certifications');
      if (product.certifications && product.certifications.length > 0) {
        certificationsList.innerHTML = product.certifications.map(cert => `<li>${cert}</li>`).join('');
      } else {
        certificationsList.innerHTML = '<li>No certifications available</li>';
      }

      // Update date added
      document.getElementById('date-added').textContent = product.dateAdded || 'N/A';
    } catch (err) {
      console.error('❌ Error fetching product:', err.message);
      document.getElementById('product-details').innerHTML = '<p class="text-red-600">Error loading product details. Please try again.</p>';
    }
  }

  // Function to determine sustainability score color
  function getSustainabilityColor(score) {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  }

  // Load product details on page load
  console.log('✅ Initiating loadProductDetails');
  loadProductDetails();
});
