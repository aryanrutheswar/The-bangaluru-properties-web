export function renderCalculators() {
  const calcRoot = document.getElementById('calculator-root');

  if (calcRoot) {
    calcRoot.innerHTML = `
      <div class="section-box">
        <div class="section-header">
          <h2 class="section-title font-heading">
            <i class="fa-solid fa-calculator" style="color: var(--accent-emerald);"></i> Rent & Move-in Deposit Calculator
          </h2>
          <p class="section-subtitle">
            Estimate your total upfront move-in capital required for renting in Bangalore (Security Deposit + First Month Rent + Agreement).
          </p>
        </div>

        <div class="calc-grid">
          <div class="calc-inputs">
            <div class="input-field-group">
              <label>Monthly Rent Amount (₹)</label>
              <input type="number" id="calc-rent" value="45000" step="1000" min="5000" />
            </div>

            <div class="input-field-group">
              <label>Security Deposit (Months of Rent)</label>
              <select id="calc-months" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                <option value="4">4 Months (Standard Direct Owner)</option>
                <option value="5" selected>5 Months (Bangalore Average)</option>
                <option value="6">6 Months (Gated Societies)</option>
                <option value="10">10 Months (Luxury Villas)</option>
              </select>
            </div>

            <div class="input-field-group">
              <label>Monthly Maintenance Fee (₹)</label>
              <input type="number" id="calc-maint" value="3500" step="500" />
            </div>
          </div>

          <div class="calc-results" id="calc-results-box">
            <h4 class="font-heading" style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--accent-emerald);">
              <i class="fa-solid fa-file-invoice-dollar"></i> Upfront Move-in Cost Breakdown
            </h4>

            <div class="result-row">
              <span>First Month Rent:</span>
              <strong id="res-rent">₹45,000</strong>
            </div>

            <div class="result-row">
              <span>Security Deposit (Refundable):</span>
              <strong id="res-deposit">₹2,25,000</strong>
            </div>

            <div class="result-row">
              <span>First Month Maintenance:</span>
              <strong id="res-maint">₹3,500</strong>
            </div>

            <div class="result-row">
              <span>Agreement Stamp Duty & e-Notary:</span>
              <strong>₹1,500</strong>
            </div>

            <div class="result-row">
              <span>Total Move-in Capital Required:</span>
              <strong id="res-total">₹2,75,000</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    // Dynamic calculator calculation function
    const calculate = () => {
      const rent = Number(document.getElementById('calc-rent')?.value || 0);
      const months = Number(document.getElementById('calc-months')?.value || 5);
      const maint = Number(document.getElementById('calc-maint')?.value || 0);
      const stampDuty = 1500;

      const deposit = rent * months;
      const total = rent + deposit + maint + stampDuty;

      document.getElementById('res-rent').textContent = `₹${rent.toLocaleString('en-IN')}`;
      document.getElementById('res-deposit').textContent = `₹${deposit.toLocaleString('en-IN')}`;
      document.getElementById('res-maint').textContent = `₹${maint.toLocaleString('en-IN')}`;
      document.getElementById('res-total').textContent = `₹${total.toLocaleString('en-IN')}`;
    };

    document.getElementById('calc-rent')?.addEventListener('input', calculate);
    document.getElementById('calc-months')?.addEventListener('change', calculate);
    document.getElementById('calc-maint')?.addEventListener('input', calculate);
  }
}
