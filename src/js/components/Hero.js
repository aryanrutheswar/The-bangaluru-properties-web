import { LOCALITIES } from '../../data/properties.js';
import { state } from '../state.js';

export function renderHero() {
  const root = document.getElementById('hero-root');
  if (!root) return;

  const c = state.contactInfo;

  root.innerHTML = `
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge" style="background: linear-gradient(90deg, rgba(245,158,11,0.2), rgba(16,185,129,0.2)); border: 1px solid rgba(245,158,11,0.4); color: var(--text-primary); font-weight: 700;">
          <i class="fa-solid fa-crown" style="color: #f59e0b;"></i> ${c.slogan}
        </div>
        <h1 class="hero-title">
          Discover Verified <span>Rental Properties</span> in Bangalore
        </h1>
        <p class="hero-subtitle">
          Directly managed by <strong>${c.proprietor} (${c.role})</strong> — Exclusively featuring verified Residential Rentals, Office Space Rentals & Godown Space Rentals across Bengaluru.
        </p>

        <!-- Service Offerings Banner -->
        <div class="service-pills-bar" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem;">
          ${c.services.map(s => `
            <span style="background: rgba(255, 255, 255, 0.08); border: 1px solid var(--border-color); padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #f59e0b; letter-spacing: 0.5px;">
              ${s}
            </span>
          `).join('')}
        </div>

        <div class="hero-search-box">
          <div class="search-field">
            <label class="search-label">
              <i class="fa-solid fa-location-dot"></i> Select Locality
            </label>
            <select id="hero-locality-select" class="search-select">
              <option value="All">All Bangalore Localities</option>
              ${LOCALITIES.map(loc => `<option value="${loc}" ${state.filters.locality === loc ? 'selected' : ''}>${loc}</option>`).join('')}
            </select>
          </div>

          <div class="search-field">
            <label class="search-label">
              <i class="fa-solid fa-bed"></i> BHK / Property Type
            </label>
            <select id="hero-bhk-select" class="search-select">
              <option value="All" ${state.filters.bhk === 'All' ? 'selected' : ''}>All Types</option>
              <option value="1bhk" ${state.filters.bhk === '1bhk' ? 'selected' : ''}>1 BHK / Studio</option>
              <option value="2bhk" ${state.filters.bhk === '2bhk' ? 'selected' : ''}>2 BHK Apartment</option>
              <option value="3bhk" ${state.filters.bhk === '3bhk' ? 'selected' : ''}>3 BHK / Office Space</option>
              <option value="4bhk" ${state.filters.bhk === '4bhk' ? 'selected' : ''}>4+ BHK / Villa / Godown</option>
            </select>
          </div>

          <div class="search-field">
            <label class="search-label">
              <i class="fa-solid fa-indian-rupee-sign"></i> Max Rent / Budget
            </label>
            <select id="hero-price-select" class="search-select">
              <option value="150000" ${state.filters.maxPrice >= 150000 ? 'selected' : ''}>Any Budget</option>
              <option value="30000" ${state.filters.maxPrice === 30000 ? 'selected' : ''}>Up to ₹30,000</option>
              <option value="50000" ${state.filters.maxPrice === 50000 ? 'selected' : ''}>Up to ₹50,000</option>
              <option value="80000" ${state.filters.maxPrice === 80000 ? 'selected' : ''}>Up to ₹80,000</option>
              <option value="120000" ${state.filters.maxPrice === 120000 ? 'selected' : ''}>Up to ₹1.2 Lakhs</option>
            </select>
          </div>

          <button id="hero-search-btn" class="btn-search">
            <i class="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </div>

        <!-- Direct Proprietor Contact Banner -->
        <div class="hero-contact-card" style="margin-top: 1.5rem; background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9)); border: 1px solid rgba(245,158,11,0.5); padding: 1.25rem 1.5rem; border-radius: 16px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div style="display: flex; align-items: center; gap: 1rem; text-align: left;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(245,158,11,0.4);">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: 0.5px;">${c.proprietor} <span style="font-size: 0.8rem; background: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 8px; border-radius: 4px; font-weight: 600; margin-left: 6px;">${c.role}</span></div>
              <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 2px;">
                <i class="fa-solid fa-location-dot" style="color: #f59e0b;"></i> ${c.address}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="tel:${c.phoneRaw}" class="nav-btn" style="background: #10b981; color: #fff; font-weight: 700; border: none; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-phone"></i> ${c.phone}
            </a>
            <a href="https://wa.me/${c.whatsapp.replace('+', '')}?text=Hello%20V.%20Ramana,%20I%20am%20interested%20in%20your%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="background: #25D366; color: #fff; font-weight: 700; border: none; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
            <button id="hero-btn-view-card" class="nav-btn" style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b; font-weight: 700; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-id-card"></i> View Contact Card
            </button>
          </div>
        </div>

        <div class="hero-stats" style="margin-top: 1.5rem;">
          <div class="stat-item">
            <div class="stat-value">15,000+</div>
            <div class="stat-label">Verified Rental Properties</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">0% Brokerage</div>
            <div class="stat-label">Direct Owner Listings Available</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">4.9 ★</div>
            <div class="stat-label">Over 45,000+ Happy Tenants</div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Attach search button listener
  document.getElementById('hero-search-btn')?.addEventListener('click', () => {
    const loc = document.getElementById('hero-locality-select').value;
    const bhk = document.getElementById('hero-bhk-select').value;
    const maxPrice = Number(document.getElementById('hero-price-select').value);

    state.updateFilter('locality', loc);
    state.updateFilter('bhk', bhk);
    state.updateFilter('maxPrice', maxPrice);
  });

  document.getElementById('hero-btn-view-card')?.addEventListener('click', () => {
    state.openModal('contact-us');
  });
}
