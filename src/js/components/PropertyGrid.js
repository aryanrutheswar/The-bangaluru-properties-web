import { state } from '../state.js';

export function renderPropertyGrid() {
  const quickBarRoot = document.getElementById('quick-bar-root');
  const gridRoot = document.getElementById('property-grid-root');

  if (!gridRoot) return;

  const count = state.filteredProperties.length;

  // Render Quick Bar
  if (quickBarRoot) {
    quickBarRoot.innerHTML = `
      <div class="results-count">
        Showing <span>${count}</span> Rental Properties in Bengaluru
      </div>

      <div class="sort-container">
        <label for="sort-select" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Sort By:</label>
        <select id="sort-select" class="sort-select">
          <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Featured First</option>
          <option value="price-low" ${state.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
          <option value="price-high" ${state.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
          <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>Newest Added</option>
        </select>
      </div>
    `;

    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      state.setSortBy(e.target.value);
    });
  }

  // Handle Empty State
  if (count === 0) {
    gridRoot.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-house-circle-xmark"></i>
        </div>
        <h3 class="font-heading" style="font-size: 1.4rem; margin-bottom: 0.5rem;">No matching rental properties found</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
          Try adjusting your price range slider or clearing locality & amenity filters.
        </p>
        <button id="btn-empty-reset" class="nav-btn nav-btn-primary">
          <i class="fa-solid fa-rotate-left"></i> Reset All Filters
        </button>
      </div>
    `;
    document.getElementById('btn-empty-reset')?.addEventListener('click', () => {
      state.resetFilters();
    });
    return;
  }

  // Render Grid Cards
  gridRoot.innerHTML = state.filteredProperties.map(p => {
    const isFav = state.isFavorite(p.id);

    return `
      <article class="property-card" data-id="${p.id}">
        <div class="card-image-wrapper">
          <img class="card-image" src="${p.images[0]}" alt="${p.title}" loading="lazy" />
          
          <div class="card-badges">
            <span class="badge" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-key"></i> FOR RENT</span>
            ${p.isVerified ? `<span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> Verified</span>` : ''}
            ${p.zeroBrokerage ? `<span class="badge badge-brokerage">0% Brokerage</span>` : ''}
            ${p.isFeatured ? `<span class="badge badge-featured">★ Featured</span>` : ''}
          </div>

          <button class="fav-toggle-btn ${isFav ? 'active' : ''}" data-fav-id="${p.id}" title="${isFav ? 'Remove from Saved' : 'Save Property'}">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>

        <div class="card-content">
          <div class="card-price-row">
            <div class="card-price">
              ₹${p.price.toLocaleString('en-IN')} <span>/mo</span>
            </div>
            <div class="card-deposit">
              Dep: ₹${(p.deposit / 1000).toFixed(0)}k
            </div>
          </div>

          <h3 class="card-title" title="${p.title}">${p.title}</h3>
          
          <div class="card-locality">
            <i class="fa-solid fa-location-dot" style="color: var(--accent-emerald);"></i> ${p.locality}, Bengaluru
          </div>

          <div class="card-specs">
            <div class="spec-item">
              <i class="fa-solid fa-bed"></i> ${p.bhk}
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-ruler-combined"></i> ${p.sqft} sq ft
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-bath"></i> ${p.bathrooms} Bath
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-couch"></i> ${p.furnishing.split(' ')[0]}
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-card-secondary btn-view-details" data-prop-id="${p.id}">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            <button class="btn-card-primary btn-schedule-visit" data-prop-id="${p.id}">
              <i class="fa-solid fa-calendar-check"></i> Book Visit
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach Card Event Listeners
  gridRoot.querySelectorAll('[data-fav-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.favId;
      state.toggleFavorite(id);
    });
  });

  gridRoot.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.propId;
      const prop = state.allProperties.find(p => p.id === id);
      if (prop) state.openModal('property-details', prop);
    });
  });

  gridRoot.querySelectorAll('.btn-schedule-visit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.propId;
      const prop = state.allProperties.find(p => p.id === id);
      if (prop) state.openModal('schedule-visit', prop);
    });
  });
}
