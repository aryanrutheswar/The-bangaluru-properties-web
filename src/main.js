import { state } from './js/state.js';
import { renderHeader } from './js/components/Header.js';
import { renderHero } from './js/components/Hero.js';
import { renderFilters } from './js/components/Filters.js';
import { renderPropertyGrid } from './js/components/PropertyGrid.js';
import { renderPropertyModal } from './js/components/PropertyModal.js';
import { renderListPropertyModal } from './js/components/ListPropertyModal.js';
import { renderAuthModal } from './js/components/AuthModal.js';
import { renderCalculators } from './js/components/Calculators.js';
import { renderFooter } from './js/components/Footer.js';

function renderApp() {
  renderHeader();
  renderFilters();
  renderPropertyGrid();
  renderPropertyModal();
  renderListPropertyModal();
  renderAuthModal();
}

function init() {
  // Set initial theme attribute
  document.documentElement.setAttribute('data-theme', state.theme);

  // Render static components once
  renderHero();
  renderCalculators();
  renderFooter();

  // Render reactive components
  renderApp();

  // Subscribe to state changes for re-rendering
  state.subscribe(() => {
    renderApp();
  });
}

// Initialize on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
