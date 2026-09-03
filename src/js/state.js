import { PROPERTIES_DATA } from '../data/properties.js';

class AppState {
  constructor() {
    this.allProperties = [...PROPERTIES_DATA];
    this.filteredProperties = [...PROPERTIES_DATA];
    
    this.filters = {
      searchQuery: '',
      locality: 'All',
      bhk: 'All',
      maxPrice: 150000,
      minPrice: 15000,
      furnishing: 'All',
      tenantType: 'All',
      zeroBrokerageOnly: false,
      verifiedOnly: false,
      amenities: []
    };

    this.sortBy = 'featured'; // 'featured', 'price-low', 'price-high', 'newest'
    this.viewMode = 'grid'; // 'grid' or 'list'
    
    // Local Storage Favorites
    const savedFavs = localStorage.getItem('tbp_favorites');
    this.favorites = savedFavs ? JSON.parse(savedFavs) : ['prop-101', 'prop-104'];

    // Theme Mode
    const savedTheme = localStorage.getItem('tbp_theme') || 'dark';
    this.theme = savedTheme;

    // Business Contact Details (V. RAMANA / The Bangalore Properties)
    this.contactInfo = {
      name: "The Bangalore Properties",
      proprietor: "V. RAMANA",
      role: "Proprietor",
      phone: "+91 80504 07710",
      phoneRaw: "+918050407710",
      whatsapp: "+918050407710",
      email: "ramuramana92@gmail.com",
      address: "Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017",
      locality: "Murugeshpalaya",
      slogan: "YOUR PROPERTY, OUR PRIORITY.",
      services: ["RESIDENTIAL RENT", "COMMERCIAL RENT", "OFFICE SPACE RENT", "GODOWN SPACE RENT", "LONG TERM LEASE RENT"]
    };

    // Authentication State
    const savedUser = localStorage.getItem('tbp_user');
    this.currentUser = savedUser ? JSON.parse(savedUser) : null;
    this.authStep = 'email-input'; // 'email-input' | 'otp-verify'
    this.pendingEmail = '';
    this.generatedOTP = '';

    // Active Modals state
    this.activeModal = null; // null, 'property-details', 'schedule-visit', 'list-property', 'contact-us', 'auth-signin'
    this.activeProperty = null;

    this.listeners = [];
  }

  // Auth Methods
  sendEmailOTP(email) {
    this.pendingEmail = email;
    // Generate a random 6-digit OTP
    this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    this.authStep = 'otp-verify';
    this.notify();
    return this.generatedOTP;
  }

  verifyOTP(enteredCode) {
    if (enteredCode === this.generatedOTP) {
      const nameFromEmail = this.pendingEmail.split('@')[0];
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      const user = {
        id: `usr-${Date.now()}`,
        name: formattedName,
        email: this.pendingEmail,
        provider: 'Gmail (OTP)',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formattedName}`
      };
      this.currentUser = user;
      localStorage.setItem('tbp_user', JSON.stringify(user));
      this.activeModal = null;
      this.authStep = 'email-input';
      this.pendingEmail = '';
      this.generatedOTP = '';
      this.notify();
      return true;
    }
    return false;
  }

  loginWithGoogle(email = 'user.google@gmail.com', name = 'Google User') {
    const user = {
      id: `usr-google-${Date.now()}`,
      name: name,
      email: email,
      provider: 'Google Account',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    this.currentUser = user;
    localStorage.setItem('tbp_user', JSON.stringify(user));
    this.activeModal = null;
    this.authStep = 'email-input';
    this.notify();
    return user;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('tbp_user');
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.applyFilters();
    this.listeners.forEach(listener => listener(this));
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('tbp_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  toggleFavorite(propertyId) {
    if (this.favorites.includes(propertyId)) {
      this.favorites = this.favorites.filter(id => id !== propertyId);
    } else {
      this.favorites.push(propertyId);
    }
    localStorage.setItem('tbp_favorites', JSON.stringify(this.favorites));
    this.notify();
  }

  isFavorite(propertyId) {
    return this.favorites.includes(propertyId);
  }

  updateFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  toggleAmenity(amenityName) {
    const index = this.filters.amenities.indexOf(amenityName);
    if (index > -1) {
      this.filters.amenities.splice(index, 1);
    } else {
      this.filters.amenities.push(amenityName);
    }
    this.notify();
  }

  resetFilters() {
    this.filters = {
      searchQuery: '',
      locality: 'All',
      bhk: 'All',
      maxPrice: 150000,
      minPrice: 15000,
      furnishing: 'All',
      tenantType: 'All',
      zeroBrokerageOnly: false,
      verifiedOnly: false,
      amenities: []
    };
    this.sortBy = 'featured';
    this.notify();
  }

  setSortBy(sortVal) {
    this.sortBy = sortVal;
    this.notify();
  }

  openModal(modalType, propertyData = null) {
    this.activeModal = modalType;
    this.activeProperty = propertyData;
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.activeProperty = null;
    this.notify();
  }

  addProperty(newProp) {
    const propertyWithId = {
      id: `prop-custom-${Date.now()}`,
      isVerified: true,
      isFeatured: true,
      zeroBrokerage: true,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
      ],
      ...newProp
    };
    this.allProperties.unshift(propertyWithId);
    this.notify();
  }

  applyFilters() {
    let result = [...this.allProperties];

    // Search query (title, address, locality)
    if (this.filters.searchQuery.trim() !== '') {
      const q = this.filters.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.bhk.toLowerCase().includes(q)
      );
    }

    // Locality
    if (this.filters.locality !== 'All') {
      result = result.filter(p => p.locality === this.filters.locality);
    }

    // BHK
    if (this.filters.bhk !== 'All') {
      result = result.filter(p => p.bhkType === this.filters.bhk);
    }

    // Price range
    result = result.filter(p => p.price <= this.filters.maxPrice);

    // Furnishing
    if (this.filters.furnishing !== 'All') {
      result = result.filter(p => p.furnishing === this.filters.furnishing);
    }

    // Zero Brokerage
    if (this.filters.zeroBrokerageOnly) {
      result = result.filter(p => p.zeroBrokerage);
    }

    // Verified
    if (this.filters.verifiedOnly) {
      result = result.filter(p => p.isVerified);
    }

    // Amenities
    if (this.filters.amenities.length > 0) {
      result = result.filter(p => 
        this.filters.amenities.every(a => p.amenities.includes(a))
      );
    }

    // Sorting
    if (this.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'newest') {
      result.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else { // 'featured'
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    this.filteredProperties = result;
  }
}

export const state = new AppState();
