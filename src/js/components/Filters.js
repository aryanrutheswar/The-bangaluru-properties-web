import { LOCALITIES } from '../../data/properties.js';
import { state } from '../state.js';

export function renderFilters() {
  const root = document.getElementById('filters-root');
  if (!root) return;

  const f = state.filters;
  const popularAmenities = ["Power Backup", "Gym", "Swimming Pool", "24/7 Security", "EV Charger", "Clubhouse", "Pet Friendly"];

  root.innerHTML = `
    <div class="filter-header">
      <div class="filter-title">
        <i class="fa-solid fa-sliders" style="color: var(--accent-emerald);"></i> Filters
      </div>
      <button id="btn-reset-all" class="btn-reset-filters">Reset All</button>
    </div>

    <!-- Keyword Search -->
    <div class="filter-group">
      <label class="filter-label">Keyword Search</label>
      <div style="position: relative;">
        <input 
          type="text" 
          id="filter-search-input" 
          placeholder="e.g. Penthouse, Toit, Lakeview..." 
          value="${f.searchQuery}"
          class="input-field-group"
          style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);"
        />
      </div>
    </div>

    <!-- Locality Pills -->
    <div class="filter-group">
      <label class="filter-label">Locality</label>
      <div class="filter-pills">
        <button class="pill-btn ${f.locality === 'All' ? 'active' : ''}" data-loc="All">All</button>
        ${LOCALITIES.map(loc => `
          <button class="pill-btn ${f.locality === loc ? 'active' : ''}" data-loc="${loc}">${loc}</button>
        `).join('')}
      </div>
    </div>

    <!-- BHK Configuration -->
    <div class="filter-group">
      <label class="filter-label">BHK Type</label>
      <div class="filter-pills">
        <button class="pill-btn ${f.bhk === 'All' ? 'active' : ''}" data-bhk="All">All</button>
        <button class="pill-btn ${f.bhk === '1bhk' ? 'active' : ''}" data-bhk="1bhk">1 BHK</button>
        <button class="pill-btn ${f.bhk === '2bhk' ? 'active' : ''}" data-bhk="2bhk">2 BHK</button>
        <button class="pill-btn ${f.bhk === '3bhk' ? 'active' : ''}" data-bhk="3bhk">3 BHK</button>
        <button class="pill-btn ${f.bhk === '4bhk' ? 'active' : ''}" data-bhk="4bhk">4+ BHK</button>
      </div>
    </div>

    <!-- Rent Price Range Slider -->
    <div class="filter-group">
      <div class="range-slider-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label class="filter-label" style="margin-bottom: 0;">Max Monthly Rent</label>
          <div class="range-value-display">₹${f.maxPrice.toLocaleString('en-IN')}/mo</div>
        </div>
        <input 
          type="range" 
          id="filter-price-slider" 
          min="15000" 
          max="150000" 
          step="5000" 
          value="${f.maxPrice}" 
          class="range-slider"
        />
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <span>₹15,000</span>
          <span>₹1.5 Lakhs+</span>
        </div>
      </div>
    </div>

    <!-- Furnishing Status -->
    <div class="filter-group">
      <label class="filter-label">Furnishing</label>
      <div class="filter-pills">
        <button class="pill-btn ${f.furnishing === 'All' ? 'active' : ''}" data-furnish="All">All</button>
        <button class="pill-btn ${f.furnishing === 'Fully Furnished' ? 'active' : ''}" data-furnish="Fully Furnished">Full</button>
        <button class="pill-btn ${f.furnishing === 'Semi-Furnished' ? 'active' : ''}" data-furnish="Semi-Furnished">Semi</button>
      </div>
    </div>

    <!-- Special Toggles -->
    <div class="filter-group">
      <label class="filter-label">Special Preferences</label>
      <label class="custom-checkbox">
        <input type="checkbox" id="chk-zero-brokerage" ${f.zeroBrokerageOnly ? 'checked' : ''} />
        <span>⚡ 0% Brokerage (Direct Owner)</span>
      </label>
      <label class="custom-checkbox">
        <input type="checkbox" id="chk-verified" ${f.verifiedOnly ? 'checked' : ''} />
        <span>🛡️ 100% Verified Properties</span>
      </label>
    </div>

    <!-- Amenities Checklist -->
    <div class="filter-group">
      <label class="filter-label">Key Amenities</label>
      ${popularAmenities.map(amenity => `
        <label class="custom-checkbox">
          <input 
            type="checkbox" 
            class="chk-amenity" 
            value="${amenity}" 
            ${f.amenities.includes(amenity) ? 'checked' : ''} 
          />
          <span>${amenity}</span>
        </label>
      `).join('')}
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('btn-reset-all')?.addEventListener('click', () => {
    state.resetFilters();
  });

  const searchInput = document.getElementById('filter-search-input');
  searchInput?.addEventListener('input', (e) => {
    state.updateFilter('searchQuery', e.target.value);
  });

  // Locality pill clicks
  root.querySelectorAll('[data-loc]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.updateFilter('locality', btn.dataset.loc);
    });
  });

  // BHK pill clicks
  root.querySelectorAll('[data-bhk]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.updateFilter('bhk', btn.dataset.bhk);
    });
  });

  // Furnish pill clicks
  root.querySelectorAll('[data-furnish]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.updateFilter('furnishing', btn.dataset.furnish);
    });
  });

  // Price slider
  document.getElementById('filter-price-slider')?.addEventListener('input', (e) => {
    state.updateFilter('maxPrice', Number(e.target.value));
  });

  // Checkbox toggles
  document.getElementById('chk-zero-brokerage')?.addEventListener('change', (e) => {
    state.updateFilter('zeroBrokerageOnly', e.target.checked);
  });

  document.getElementById('chk-verified')?.addEventListener('change', (e) => {
    state.updateFilter('verifiedOnly', e.target.checked);
  });

  root.querySelectorAll('.chk-amenity').forEach(chk => {
    chk.addEventListener('change', () => {
      state.toggleAmenity(chk.value);
    });
  });
}
