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

    // Theme Mode (Default to Light Mode)
    const savedTheme = localStorage.getItem('tbp_theme') || 'light';
    this.theme = 'light';

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

    const savedRegUsers = localStorage.getItem('tbp_registered_users');
    this.registeredUsers = savedRegUsers ? JSON.parse(savedRegUsers) : [];

    this.authStep = 'input-step'; // 'input-step' | 'otp-verify'
    this.authTab = 'email-pass'; // 'email-pass' | 'whatsapp'
    this.userAuthMode = 'signin'; // 'signin' | 'register'
    this.pendingEmail = '';
    this.pendingPhone = '';
    this.generatedOTP = '';
    this.isSendingOTP = false;
    this.otpSentRealStatus = false;

    // Active Modals state
    this.activeModal = null; // null, 'property-details', 'schedule-visit', 'list-property', 'contact-us', 'auth-signin', 'admin-portal'
    this.activeProperty = null;

    // Admin Portal State
    const savedAdminAuth = localStorage.getItem('tbp_admin_auth') === 'true';
    this.isAdminLoggedIn = savedAdminAuth;
    this.adminTab = 'dashboard'; // 'dashboard' | 'properties' | 'add-property' | 'leads' | 'settings'

    // Tenant Leads / Inquiries
    const savedLeads = localStorage.getItem('tbp_leads');
    this.leads = savedLeads ? JSON.parse(savedLeads) : [
      {
        id: "lead-101",
        tenantName: "Rajesh Kumar",
        tenantPhone: "+91 98860 12345",
        propertyTitle: "Skyline Zenith Luxury 3BHK Penthouse",
        locality: "Indiranagar",
        date: "2026-09-03",
        status: "New",
        notes: "Looking to move in by next month. Prefers fully furnished."
      },
      {
        id: "lead-102",
        tenantName: "Priya Sharma",
        tenantPhone: "+91 97420 54321",
        propertyTitle: "Prestige Cyber Heights 2BHK",
        locality: "Whitefield",
        date: "2026-09-02",
        status: "Contacted",
        notes: "Scheduled weekend site visit."
      },
      {
        id: "lead-103",
        tenantName: "Anand Verma",
        tenantPhone: "+91 99001 88776",
        propertyTitle: "Murugeshpalaya Commercial Godown Space",
        locality: "Murugeshpalaya",
        date: "2026-09-01",
        status: "Scheduled",
        notes: "Requires 3-phase power for warehouse logistics."
      }
    ];

    this.listeners = [];
  }

  // Auth Methods: WhatsApp OTP & EmailJS Gmail OTP & Google OAuth
  sendWhatsAppOTP(phone) {
    const rawDigits = phone.replace(/\D/g, '');
    const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
    
    this.pendingPhone = phone;
    this.pendingEmail = '';
    this.authTab = 'whatsapp';
    this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    this.authStep = 'otp-verify';
    this.notify();

    // Trigger WhatsApp web / app link with prefilled OTP message
    const msg = `🔐 Your Verification OTP for The Bangalore Properties is: ${this.generatedOTP}\n\nUse this code to complete your login. Valid for 10 minutes.`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    return this.generatedOTP;
  }

  async sendEmailOTP(email) {
    this.pendingEmail = email;
    this.pendingPhone = '';
    this.authTab = 'email';
    // Generate a secure 6-digit OTP
    this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    this.authStep = 'otp-verify';
    this.isSendingOTP = true;
    this.otpSentRealStatus = false;
    this.notify();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_gmail_otp';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_otp_code';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      if (window.emailjs && publicKey) {
        window.emailjs.init(publicKey);
        await window.emailjs.send(serviceId, templateId, {
          to_email: email,
          otp_code: this.generatedOTP,
          site_name: 'The Bangalore Properties'
        });
        this.otpSentRealStatus = true;
      } else {
        // Attempt direct EmailJS REST API dispatch
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey || 'public_key_demo',
            template_params: {
              to_email: email,
              otp_code: this.generatedOTP,
              site_name: 'The Bangalore Properties'
            }
          })
        });
        this.otpSentRealStatus = res.ok;
      }
    } catch (err) {
      console.warn('EmailJS sending info:', err);
      this.otpSentRealStatus = false;
    } finally {
      this.isSendingOTP = false;
      this.notify();
    }

    return this.generatedOTP;
  }

  verifyOTP(enteredCode) {
    if (enteredCode === this.generatedOTP) {
      const identifier = this.authTab === 'whatsapp' ? this.pendingPhone : this.pendingEmail;
      const formattedName = this.authTab === 'whatsapp' 
        ? `Member (${this.pendingPhone})` 
        : (this.pendingEmail.split('@')[0].charAt(0).toUpperCase() + this.pendingEmail.split('@')[0].slice(1));
      
      const user = {
        id: `usr-${Date.now()}`,
        name: formattedName,
        email: this.pendingEmail || `${this.pendingPhone}@whatsapp.user`,
        phone: this.pendingPhone,
        provider: this.authTab === 'whatsapp' ? 'WhatsApp OTP' : 'Gmail OTP',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formattedName}`
      };
      this.currentUser = user;
      localStorage.setItem('tbp_user', JSON.stringify(user));
      this.activeModal = null;
      this.authStep = 'input-step';
      this.pendingEmail = '';
      this.pendingPhone = '';
      this.generatedOTP = '';
      this.notify();
      return true;
    }
    return false;
  }

  handleGoogleCredential(credentialResponse) {
    try {
      // Decode Google ID Token JWT payload
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const payload = JSON.parse(jsonPayload);

      const user = {
        id: `usr-google-${payload.sub}`,
        name: payload.name || payload.given_name || payload.email.split('@')[0],
        email: payload.email,
        provider: 'Google Account',
        avatar: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      this.currentUser = user;
      localStorage.setItem('tbp_user', JSON.stringify(user));
      this.activeModal = null;
      this.authStep = 'email-input';
      this.notify();
      return user;
    } catch (e) {
      console.error('Failed to parse Google OAuth credential:', e);
      return this.loginWithGoogle();
    }
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
    this.isAdminLoggedIn = false;
    localStorage.removeItem('tbp_user');
    localStorage.removeItem('tbp_admin_auth');
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

  // User Registration & Login Methods
  registerUser({ name, email, password }) {
    if (!name || !email || !password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'vramanarentals@gmail.com') {
      return { success: false, message: 'This email is reserved for Admin login.' };
    }

    const existing = this.registeredUsers.find(u => u.email === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: cleanPass,
      provider: 'Email & Password',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    };

    this.registeredUsers.push(newUser);
    localStorage.setItem('tbp_registered_users', JSON.stringify(this.registeredUsers));

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      provider: newUser.provider,
      avatar: newUser.avatar
    };
    this.currentUser = userSession;
    localStorage.setItem('tbp_user', JSON.stringify(userSession));

    this.closeModal();
    this.notify();
    return { success: true, user: userSession };
  }

  loginUser(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check if credentials match admin email
    if (cleanEmail === 'vramanarentals@gmail.com') {
      const regUser = this.registeredUsers.find(u => u.email === cleanEmail && u.password === cleanPass);
      if (cleanPass === 'ramana rentals' || regUser) {
        this.isAdminLoggedIn = true;
        localStorage.setItem('tbp_admin_auth', 'true');
        const adminSession = {
          id: regUser ? regUser.id : 'usr-admin',
          name: regUser ? regUser.name : 'V. RAMANA (Proprietor)',
          email: 'vramanarentals@gmail.com',
          provider: 'Admin Account',
          avatar: regUser ? regUser.avatar : 'https://api.dicebear.com/7.x/avataaars/svg?seed=VRamana',
          isAdmin: true
        };
        this.currentUser = adminSession;
        localStorage.setItem('tbp_user', JSON.stringify(adminSession));
        // Automatically open Admin Portal upon admin login!
        this.activeModal = 'admin-portal';
        this.notify();
        return { success: true, user: adminSession, isAdmin: true };
      }
    }

    // Check registered users
    const user = this.registeredUsers.find(u => u.email === cleanEmail && u.password === cleanPass);
    if (user) {
      this.isAdminLoggedIn = false;
      localStorage.removeItem('tbp_admin_auth');
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        isAdmin: false
      };
      this.currentUser = userSession;
      localStorage.setItem('tbp_user', JSON.stringify(userSession));
      this.closeModal();
      this.notify();
      return { success: true, user: userSession, isAdmin: false };
    }

    return { success: false, message: 'Invalid email or password!' };
  }

  // Admin Portal Methods
  adminLogin(email, password) {
    if (!email || !password) return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    if (cleanEmail === 'vramanarentals@gmail.com' && cleanPass === 'ramana rentals') {
      this.isAdminLoggedIn = true;
      localStorage.setItem('tbp_admin_auth', 'true');
      const adminSession = {
        id: 'usr-admin',
        name: 'V. RAMANA (Proprietor)',
        email: 'vramanarentals@gmail.com',
        provider: 'Admin Account',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VRamana',
        isAdmin: true
      };
      this.currentUser = adminSession;
      localStorage.setItem('tbp_user', JSON.stringify(adminSession));
      this.activeModal = 'admin-portal';
      this.notify();
      return true;
    }
    return false;
  }

  adminLogout() {
    this.isAdminLoggedIn = false;
    localStorage.removeItem('tbp_admin_auth');
    this.notify();
  }

  setAdminTab(tab) {
    this.adminTab = tab;
    this.notify();
  }

  deleteProperty(propertyId) {
    this.allProperties = this.allProperties.filter(p => p.id !== propertyId);
    this.notify();
  }

  togglePropertyFlag(propertyId, flagName) {
    const prop = this.allProperties.find(p => p.id === propertyId);
    if (prop) {
      prop[flagName] = !prop[flagName];
      this.notify();
    }
  }

  updateLeadStatus(leadId, newStatus) {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
      this.notify();
    }
  }

  deleteLead(leadId) {
    this.leads = this.leads.filter(l => l.id !== leadId);
    localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
    this.notify();
  }

  addLead(newLead) {
    const leadObj = {
      id: `lead-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      ...newLead
    };
    this.leads.unshift(leadObj);
    localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
    this.notify();
  }

  updateContactInfo(newInfo) {
    this.contactInfo = { ...this.contactInfo, ...newInfo };
    this.notify();
  }
}

export const state = new AppState();
