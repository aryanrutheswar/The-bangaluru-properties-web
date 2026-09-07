import { state } from '../state.js';
import { showToast } from './Toast.js';

export function renderAuthModal() {
  if (state.activeModal !== 'auth-signin') return;

  const root = document.getElementById('modal-root');
  if (!root) return;

  const isEmailPassTab = state.authTab === 'email-pass';
  const isSignIn = state.userAuthMode === 'signin';
  const isOtpStep = state.authStep === 'otp-verify';

  root.innerHTML = `
    <div class="modal-overlay" id="modal-backdrop">
      <div class="modal-card" style="max-width: 480px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 24px; padding: 2rem; box-shadow: var(--shadow-lg);">
        <button class="modal-close-btn" id="btn-close-modal" style="top: 18px; right: 18px;">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 60px; height: 60px; border-radius: 18px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2)); border: 1px solid var(--accent-emerald); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--accent-emerald); margin: 0 auto 1rem auto;">
            <i class="${isEmailPassTab ? (isSignIn ? 'fa-solid fa-user-lock' : 'fa-solid fa-user-plus') : 'fa-brands fa-whatsapp'}"></i>
          </div>
          <h2 class="font-heading" style="font-size: 1.6rem; margin-bottom: 0.25rem;">
            ${isEmailPassTab ? (isSignIn ? 'Sign In to Your Account' : 'Create New Account') : 'WhatsApp Quick Login'}
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            ${isEmailPassTab ? (isSignIn ? 'Enter your email and password to sign in.' : 'Register with your email and create a password.') : 'Enter your mobile number to received verification OTP.'}
          </p>
        </div>

        <!-- Main Authentication Tabs: Email/Password vs WhatsApp -->
        <div style="display: flex; background: var(--bg-input); padding: 4px; border-radius: 14px; border: 1px solid var(--border-color); margin-bottom: 1.25rem;">
          <button id="tab-email-pass" style="flex: 1; padding: 0.6rem; border-radius: 10px; border: none; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; ${isEmailPassTab ? 'background: var(--accent-emerald); color: #ffffff; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);' : 'background: transparent; color: var(--text-muted);'}">
            <i class="fa-solid fa-envelope"></i> Email & Password
          </button>
          <button id="tab-whatsapp" style="flex: 1; padding: 0.6rem; border-radius: 10px; border: none; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; ${!isEmailPassTab ? 'background: #25D366; color: #ffffff; box-shadow: 0 2px 6px rgba(37, 211, 102, 0.4);' : 'background: transparent; color: var(--text-muted);'}">
            <i class="fa-brands fa-whatsapp" style="font-size: 1.1rem;"></i> WhatsApp OTP
          </button>
        </div>

        ${isEmailPassTab ? `
          <!-- Sub-toggle for Sign In vs Register -->
          <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
            <button id="btn-switch-signin" style="background: none; border: none; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: ${isSignIn ? 'var(--accent-emerald)' : 'var(--text-muted)'}; border-bottom: 2px solid ${isSignIn ? 'var(--accent-emerald)' : 'transparent'}; padding-bottom: 4px;">
              <i class="fa-solid fa-right-to-bracket"></i> Sign In
            </button>
            <button id="btn-switch-register" style="background: none; border: none; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: ${!isSignIn ? 'var(--accent-emerald)' : 'var(--text-muted)'}; border-bottom: 2px solid ${!isSignIn ? 'var(--accent-emerald)' : 'transparent'}; padding-bottom: 4px;">
              <i class="fa-solid fa-user-plus"></i> Create Account
            </button>
          </div>

          ${isSignIn ? `
            <!-- Sign In Form -->
            <form id="form-user-login" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="input-field-group" style="text-align: left;">
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="user-login-email" 
                  placeholder="Enter your email" 
                  required 
                  style="width: 100%; padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem;"
                />
              </div>

              <div class="input-field-group" style="text-align: left;">
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                  Password
                </label>
                <input 
                  type="password" 
                  id="user-login-pass" 
                  placeholder="Enter your password" 
                  required 
                  style="width: 100%; padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem;"
                />
              </div>

              <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.25rem;">
                <i class="fa-solid fa-right-to-bracket"></i> Sign In
              </button>
            </form>
          ` : `
            <!-- Register / Create Account Form -->
            <form id="form-user-register" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="input-field-group" style="text-align: left;">
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="user-reg-name" 
                  placeholder="Enter your full name" 
                  required 
                  style="width: 100%; padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem;"
                />
              </div>

              <div class="input-field-group" style="text-align: left;">
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="user-reg-email" 
                  placeholder="Enter your email" 
                  required 
                  style="width: 100%; padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem;"
                />
              </div>

              <div class="input-field-group" style="text-align: left;">
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                  Create Password
                </label>
                <input 
                  type="password" 
                  id="user-reg-pass" 
                  placeholder="Create a password" 
                  required 
                  minlength="6"
                  style="width: 100%; padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem;"
                />
              </div>

              <div class="input-field-group" style="text-align: left;">
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  id="user-reg-confirm" 
                  placeholder="Confirm your password" 
                  required 
                  minlength="6"
                  style="width: 100%; padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem;"
                />
              </div>

              <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.25rem;">
                <i class="fa-solid fa-user-plus"></i> Create Account & Sign In
              </button>
            </form>
          `}
        ` : `
          ${!isOtpStep ? `
            <!-- WhatsApp Mobile Number Form -->
            <form id="form-whatsapp-otp" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="input-field-group">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                  <i class="fa-brands fa-whatsapp" style="color: #25D366;"></i> WhatsApp Mobile Number
                </label>
                <div style="display: flex; gap: 0.5rem;">
                  <span style="padding: 0.8rem 0.9rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem;">
                    🇮🇳 +91
                  </span>
                  <input 
                    type="tel" 
                    id="auth-phone-input" 
                    placeholder="98765 43210" 
                    required 
                    pattern="[0-9]{10}"
                    maxlength="10"
                    style="flex: 1; padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 600; letter-spacing: 0.5px;"
                  />
                </div>
              </div>

              <button type="submit" class="nav-btn" style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 1rem; background: #25D366; color: #ffffff; border-radius: 12px; font-weight: 700; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i> Send OTP on WhatsApp
              </button>
            </form>
          ` : `
            <!-- OTP Verification Form -->
            <form id="form-verify-otp" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; display: block; text-align: center;">
                  Enter 6-Digit Code
                </label>
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.75rem;">
                  ${[0, 1, 2, 3, 4, 5].map(idx => `
                    <input 
                      type="text" 
                      class="otp-digit-input" 
                      data-idx="${idx}" 
                      maxlength="1" 
                      pattern="[0-9]*" 
                      inputmode="numeric" 
                      style="width: 45px; height: 50px; text-align: center; font-size: 1.4rem; font-weight: 800; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: #25D366;" 
                    />
                  `).join('')}
                </div>
              </div>

              <button type="submit" class="nav-btn" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; background: #25D366; color: #ffffff; border-radius: 12px; font-weight: 700;">
                <i class="fa-solid fa-circle-check"></i> Verify OTP & Sign In
              </button>
            </form>
          `}
        `}
      </div>
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('tab-email-pass')?.addEventListener('click', () => {
    state.authTab = 'email-pass';
    state.notify();
  });

  document.getElementById('tab-whatsapp')?.addEventListener('click', () => {
    state.authTab = 'whatsapp';
    state.notify();
  });

  document.getElementById('btn-switch-signin')?.addEventListener('click', () => {
    state.userAuthMode = 'signin';
    state.notify();
  });

  document.getElementById('btn-switch-register')?.addEventListener('click', () => {
    state.userAuthMode = 'register';
    state.notify();
  });

  // User Sign In Submit
  document.getElementById('form-user-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('user-login-email')?.value || '';
    const pass = document.getElementById('user-login-pass')?.value || '';
    const res = state.loginUser(email, pass);
    if (res.success) {
      if (res.isAdmin) {
        showToast('⚡ Logged in as Proprietor Admin!');
      } else {
        showToast(`🎉 Welcome back, ${res.user.name}!`);
      }
    } else {
      showToast(`❌ ${res.message}`);
    }
  });

  // User Registration Submit
  document.getElementById('form-user-register')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('user-reg-name')?.value || '';
    const email = document.getElementById('user-reg-email')?.value || '';
    const pass = document.getElementById('user-reg-pass')?.value || '';
    const confirm = document.getElementById('user-reg-confirm')?.value || '';

    if (pass !== confirm) {
      showToast('⚠️ Passwords do not match! Please check again.');
      return;
    }

    const res = state.registerUser({ name, email, password: pass });
    if (res.success) {
      showToast(`🎉 Account created! Welcome, ${res.user.name}.`);
    } else {
      showToast(`❌ ${res.message}`);
    }
  });

  // WhatsApp OTP Submit
  document.getElementById('form-whatsapp-otp')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneInput = document.getElementById('auth-phone-input');
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!phone || phone.length !== 10) {
      showToast('⚠️ Please enter a valid 10-digit mobile number.');
      return;
    }

    const otp = state.sendWhatsAppOTP(phone);
    showToast(`💬 WhatsApp opening with verification OTP: ${otp}`);
  });

  // OTP Digit auto-advance & paste handler
  const otpInputs = root.querySelectorAll('.otp-digit-input');
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  // Verify OTP Form Submit
  document.getElementById('form-verify-otp')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredCode = Array.from(root.querySelectorAll('.otp-digit-input')).map(i => i.value.trim()).join('');
    if (enteredCode.length !== 6) {
      showToast('⚠️ Please enter all 6 digits of the OTP code.');
      return;
    }
    const verified = state.verifyOTP(enteredCode);
    if (verified) {
      showToast('🎉 Signed in successfully!');
    } else {
      showToast('❌ Invalid verification OTP! Please check again.');
    }
  });

  // Modal Close Listeners
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    state.closeModal();
    state.authStep = 'input-step';
  });

  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      state.closeModal();
      state.authStep = 'input-step';
    }
  });
}
