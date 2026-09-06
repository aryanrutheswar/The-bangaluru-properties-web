import { state } from './js/state.js';
import { renderHeader } from './js/components/Header.js';
import { renderHero } from './js/components/Hero.js';
import { renderFilters } from './js/components/Filters.js';
import { renderPropertyGrid } from './js/components/PropertyGrid.js';
import { renderPropertyModal } from './js/components/PropertyModal.js';
import { renderListPropertyModal } from './js/components/ListPropertyModal.js';
import { renderAuthModal } from './js/components/AuthModal.js';
import { renderAdminPortal } from './js/components/AdminPortal.js';
import { renderFooter } from './js/components/Footer.js';

function renderApp() {
  // Save active input focus and cursor position before re-render
  const activeEl = document.activeElement;
  let activeId = null;
  let selStart = 0;
  let selEnd = 0;

  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl.id) {
    activeId = activeEl.id;
    try {
      selStart = activeEl.selectionStart;
      selEnd = activeEl.selectionEnd;
    } catch (e) {
      // Ignore if input type doesn't support selection range
    }
  }

  renderHeader();
  renderHero();
  renderFilters();
  renderPropertyGrid();
  renderPropertyModal();
  renderListPropertyModal();
  renderAuthModal();
  renderAdminPortal();
  renderFooter();

  // Restore focus and cursor selection position after re-render
  if (activeId) {
    const elToFocus = document.getElementById(activeId);
    if (elToFocus) {
      elToFocus.focus();
      try {
        elToFocus.setSelectionRange(selStart, selEnd);
      } catch (e) {
        // Ignore if input type doesn't support selection range
      }
    }
  }
}

function checkAdminRoute() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase();
  if (path === '/admin' || hash === '#admin') {
    const isAdmin = state.isAdminLoggedIn && state.currentUser?.email === 'vramanarentals@gmail.com';
    if (isAdmin && state.activeModal !== 'admin-portal') {
      state.openModal('admin-portal');
    }
  }
}

function init() {
  // Set initial theme attribute
  document.documentElement.setAttribute('data-theme', state.theme);

  // Check if route matches /admin
  checkAdminRoute();

  // Listen for browser back/forward navigation or hash changes
  window.addEventListener('popstate', checkAdminRoute);
  window.addEventListener('hashchange', checkAdminRoute);

  // Render reactive components
  renderApp();

  // Floating call button listener
  document.getElementById('floating-btn-book-call')?.addEventListener('click', () => {
    state.openModal('book-call');
  });

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
