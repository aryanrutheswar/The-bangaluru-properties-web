import { state } from '../state.js';

export function renderHeader() {
  const root = document.getElementById('header-root');
  if (!root) return;

  const favCount = state.favorites.length;
  const isDark = state.theme === 'dark';

  root.innerHTML = `
    <header class="header-nav">
      <div class="header-container">
        <a href="#" class="brand-logo">
          <div class="brand-icon">
            <i class="fa-solid fa-city"></i>
          </div>
          <div>
            The Bangalore <span class="brand-text-highlight">Properties</span>
            <div style="font-size: 0.65rem; color: #10b981; font-weight: 700; letter-spacing: 0.5px; margin-top: 2px;">
              <i class="fa-solid fa-key"></i> 100% VERIFIED RENTAL PROPERTIES ONLY
            </div>
          </div>
        </a>

        <div class="header-actions">
          <button id="btn-contact-card" class="nav-btn" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #f59e0b;" title="Contact Proprietor V. RAMANA">
            <i class="fa-solid fa-address-card"></i>
            <span>V. RAMANA (+91 80504 07710)</span>
          </button>

          <button id="btn-theme-toggle" class="nav-btn" title="Toggle Light/Dark Theme">
            <i class="fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}"></i>
            <span>${isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button id="btn-view-favorites" class="nav-btn" title="View Saved Homes">
            <i class="fa-solid fa-heart" style="color: #ef4444;"></i>
            <span>Saved</span>
            <span class="fav-badge">${favCount}</span>
          </button>

          <button id="btn-list-property" class="nav-btn nav-btn-primary">
            <i class="fa-solid fa-plus-circle"></i>
            <span>List Property</span>
          </button>

          ${state.currentUser ? `
            <div style="position: relative; display: inline-block;">
              <button id="btn-user-menu" class="nav-btn" style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); padding: 0.35rem 0.75rem; border-radius: 30px; display: flex; align-items: center; gap: 0.5rem;">
                <img src="${state.currentUser.avatar}" alt="${state.currentUser.name}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;" />
                <span style="font-weight: 700; font-size: 0.85rem; color: var(--accent-emerald);">${state.currentUser.name}</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-muted);"></i>
              </button>

              <div id="user-dropdown-menu" style="display: none; position: absolute; right: 0; top: 110%; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 14px; box-shadow: var(--shadow-lg); min-width: 220px; z-index: 100; padding: 0.75rem; color: var(--text-primary);">
                <div style="padding-bottom: 0.65rem; margin-bottom: 0.65rem; border-bottom: 1px solid var(--border-color);">
                  <div style="font-weight: 800; font-size: 0.9rem;">${state.currentUser.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); word-break: break-all;">${state.currentUser.email}</div>
                  <span style="display: inline-block; background: rgba(99,102,241,0.15); color: var(--accent-indigo); font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-top: 4px;">
                    ${state.currentUser.provider}
                  </span>
                </div>

                <button id="btn-logout-user" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem; border-radius: 8px; border: none; background: rgba(239,68,68,0.1); color: #ef4444; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                  <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
              </div>
            </div>
          ` : `
            <button id="btn-header-signin" class="nav-btn" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; border: none; font-weight: 700; box-shadow: 0 4px 12px rgba(16,185,129,0.3);" title="Sign In with Google or Gmail OTP">
              <i class="fa-solid fa-right-to-bracket"></i>
              <span>Sign In</span>
            </button>
          `}
        </div>
      </div>
    </header>
  `;

  // Attach Event Listeners
  document.getElementById('btn-header-signin')?.addEventListener('click', () => {
    state.openModal('auth-signin');
  });

  const userMenuBtn = document.getElementById('btn-user-menu');
  const userDropdown = document.getElementById('user-dropdown-menu');
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      if (userDropdown) userDropdown.style.display = 'none';
    });
  }

  document.getElementById('btn-logout-user')?.addEventListener('click', () => {
    state.logout();
  });

  document.getElementById('btn-contact-card')?.addEventListener('click', () => {
    state.openModal('contact-us');
  });
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    state.toggleTheme();
  });

  document.getElementById('btn-list-property')?.addEventListener('click', () => {
    state.openModal('list-property');
  });

  document.getElementById('btn-view-favorites')?.addEventListener('click', () => {
    // Filter by favorites
    if (state.favorites.length === 0) {
      alert('You have not saved any properties yet! Click the heart icon on any listing card to save it.');
      return;
    }
    const favProps = state.allProperties.filter(p => state.favorites.includes(p.id));
    state.filteredProperties = favProps;
    state.notify();
  });
}
