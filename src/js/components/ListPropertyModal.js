import { LOCALITIES } from '../../data/properties.js';
import { state } from '../state.js';
import { showToast } from './Toast.js';

export function renderListPropertyModal() {
  if (state.activeModal !== 'list-property') return;

  const root = document.getElementById('modal-root');
  if (!root) return;

  root.innerHTML = `
    <div class="modal-overlay" id="modal-backdrop">
      <div class="modal-card" style="max-width: 650px;">
        <button class="modal-close-btn" id="btn-close-modal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--accent-indigo-light); color: var(--accent-indigo); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              <i class="fa-solid fa-house-medical"></i>
            </div>
            <div>
              <h3 class="font-heading" style="font-size: 1.5rem;">List Your Property in Bengaluru</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Post your 0% brokerage rental listing & connect with 45,000+ verified tenants instantly.</p>
            </div>
          </div>

          <form id="form-list-property" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div class="input-field-group">
              <label>Property Name / Headline</label>
              <input type="text" id="lp-title" placeholder="e.g. Prestige Lakeview Spacious 2BHK" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="input-field-group">
                <label>Locality</label>
                <select id="lp-locality" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  ${LOCALITIES.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                </select>
              </div>

              <div class="input-field-group">
                <label>BHK Type</label>
                <select id="lp-bhk" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  <option value="1bhk">1 BHK / Studio</option>
                  <option value="2bhk" selected>2 BHK Apartment</option>
                  <option value="3bhk">3 BHK Luxury</option>
                  <option value="4bhk">4+ BHK / Villa</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="input-field-group">
                <label>Monthly Rent Expected (₹)</label>
                <input type="number" id="lp-price" placeholder="45000" min="5000" step="1000" required />
              </div>

              <div class="input-field-group">
                <label>Security Deposit (₹)</label>
                <input type="number" id="lp-deposit" placeholder="180000" min="10000" step="5000" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="input-field-group">
                <label>Built-up Area (Sq Ft)</label>
                <input type="number" id="lp-sqft" placeholder="1250" required />
              </div>

              <div class="input-field-group">
                <label>Furnishing Status</label>
                <select id="lp-furnishing" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished" selected>Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="input-field-group">
                <label>Your Full Name</label>
                <input type="text" id="lp-owner-name" placeholder="Owner Name" required />
              </div>

              <div class="input-field-group">
                <label>Contact Phone Number</label>
                <input type="tel" id="lp-owner-phone" placeholder="+91 98450 99887" required />
              </div>
            </div>

            <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem;">
              <i class="fa-solid fa-paper-plane"></i> Publish 0% Brokerage Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('form-list-property')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('lp-title').value;
    const locality = document.getElementById('lp-locality').value;
    const bhkType = document.getElementById('lp-bhk').value;
    const bhkText = bhkType === '1bhk' ? '1 BHK' : bhkType === '2bhk' ? '2 BHK' : bhkType === '3bhk' ? '3 BHK' : '4+ BHK';
    const price = Number(document.getElementById('lp-price').value);
    const deposit = Number(document.getElementById('lp-deposit').value);
    const sqft = Number(document.getElementById('lp-sqft').value);
    const furnishing = document.getElementById('lp-furnishing').value;
    const ownerName = document.getElementById('lp-owner-name').value;
    const ownerPhone = document.getElementById('lp-owner-phone').value;

    state.addProperty({
      title,
      locality,
      address: `${locality}, Bengaluru`,
      price,
      deposit,
      bhk: bhkText,
      bhkType,
      type: 'Apartment',
      furnishing,
      sqft,
      bathrooms: 2,
      floor: '3rd of 8',
      facing: 'East Facing',
      availableFrom: 'Immediate',
      preferredTenants: 'Any',
      amenities: ['Power Backup', 'Lift', 'Car Parking', '24/7 Security'],
      description: `Newly listed ${bhkText} apartment in prime ${locality}. Directly posted by property owner with 0% brokerage fees.`,
      ownerName,
      ownerPhone,
      ownerType: 'Direct Owner'
    });

    state.closeModal();
    showToast(`✨ Property "${title}" in ${locality} successfully published!`);
  });

  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    state.closeModal();
  });

  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      state.closeModal();
    }
  });
}
