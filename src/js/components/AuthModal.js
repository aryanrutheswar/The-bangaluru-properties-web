import { state } from '../state.js';
import { showToast } from './Toast.js';

export function renderAuthModal() {
  if (state.activeModal !== 'auth-signin') return;

  const root = document.getElementById('modal-root');
  if (!root) return;

  const isOtpStep = state.authStep === 'otp-verify';

  root.innerHTML = `
    <div class="modal-overlay" id="modal-backdrop">
      <div class="modal-card" style="max-width: 480px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px; padding: 2rem; box-shadow: var(--shadow-lg);">
        <button class="modal-close-btn" id="btn-close-modal" style="top: 15px; right: 15px;">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(245, 158, 11, 0.2)); border: 1px solid rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--accent-emerald); margin: 0 auto 1rem auto;">
            <i class="fa-solid ${isOtpStep ? 'fa-shield-halved' : 'fa-user-lock'}"></i>
          </div>
          <h2 class="font-heading" style="font-size: 1.6rem; margin-bottom: 0.25rem;">
            ${isOtpStep ? 'Verify Gmail OTP' : 'Sign In / Register'}
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            ${isOtpStep ? `Enter the 6-digit verification code sent to <strong>${state.pendingEmail}</strong>` : 'Access your saved rental homes, direct owner contacts & listing manager.'}
          </p>
        </div>

        ${!isOtpStep ? `
          <!-- Google Sign-In Option -->
          <div style="margin-bottom: 1.5rem;">
            <button id="btn-google-signin" class="btn-google-login" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: #ffffff; color: #1f2937; border: 1px solid #e5e7eb; padding: 0.8rem 1rem; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="flex-grow: 1; height: 1px; background: var(--border-color);"></div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">OR Sign In with Email OTP</span>
            <div style="flex-grow: 1; height: 1px; background: var(--border-color);"></div>
          </div>

          <!-- Email Input Form -->
          <form id="form-email-otp" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div class="input-field-group">
              <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                <i class="fa-solid fa-envelope" style="color: var(--accent-emerald);"></i> Your Gmail / Email Address
              </label>
              <input 
                type="email" 
                id="auth-email-input" 
                placeholder="name@gmail.com" 
                required 
                style="width: 100%; padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem;"
              />
            </div>

            <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem;">
              <i class="fa-solid fa-paper-plane"></i> Send OTP to Gmail
            </button>
          </form>
        ` : `
          <!-- OTP Verification Form -->
          <form id="form-verify-otp" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; display: block; text-align: center;">
                Enter 6-Digit Code
              </label>
              
              <!-- 6 OTP Input Boxes -->
              <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.75rem;">
                ${[0, 1, 2, 3, 4, 5].map(idx => `
                  <input 
                    type="text" 
                    class="otp-digit-input" 
                    data-idx="${idx}" 
                    maxlength="1" 
                    pattern="[0-9]*" 
                    inputmode="numeric" 
                    style="width: 45px; height: 50px; text-align: center; font-size: 1.4rem; font-weight: 800; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--accent-emerald);" 
                  />
                `).join('')}
              </div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.8rem; color: var(--text-secondary); text-align: center;">
              <i class="fa-solid fa-circle-info" style="color: var(--accent-emerald);"></i> Demo OTP Sent: <strong style="color: var(--accent-emerald); font-size: 1rem;">${state.generatedOTP}</strong>
            </div>

            <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem;">
              <i class="fa-solid fa-circle-check"></i> Verify OTP & Sign In
            </button>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; margin-top: 0.5rem;">
              <button type="button" id="btn-resend-otp" style="color: var(--accent-amber); font-weight: 600; cursor: pointer; border: none; background: none;">
                <i class="fa-solid fa-rotate"></i> Resend OTP
              </button>
              <button type="button" id="btn-change-email" style="color: var(--text-muted); font-weight: 600; cursor: pointer; border: none; background: none;">
                <i class="fa-solid fa-pen"></i> Change Email
              </button>
            </div>
          </form>
        `}
      </div>
    </div>
  `;

  // Attach Event Listeners
  if (!isOtpStep) {
    // Google Sign in click
    document.getElementById('btn-google-signin')?.addEventListener('click', () => {
      const user = state.loginWithGoogle('user.google@gmail.com', 'Alex Sharma');
      showToast(`🎉 Logged in with Google as ${user.name} (${user.email})`);
    });

    // Email OTP Form submit
    document.getElementById('form-email-otp')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email-input').value.trim();
      if (!email) return;

      const otpCode = state.sendEmailOTP(email);
      showToast(`📩 Verification OTP sent to ${email}! (Code: ${otpCode})`);
    });
  } else {
    // Auto-focus logic for 6 OTP boxes
    const inputs = root.querySelectorAll('.otp-digit-input');
    inputs.forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        if (e.target.value && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          inputs[idx - 1].focus();
        }
      });
    });

    // Auto-fill first box on paste
    if (inputs.length > 0) {
      inputs[0].focus();
      inputs[0].addEventListener('paste', (e) => {
        const pasteData = e.clipboardData.getData('text').trim();
        if (pasteData.length === 6 && !isNaN(pasteData)) {
          inputs.forEach((inp, i) => {
            inp.value = pasteData[i] || '';
          });
          e.preventDefault();
        }
      });
    }

    // Submit OTP verification
    document.getElementById('form-verify-otp')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredOTP = Array.from(inputs).map(inp => inp.value).join('');

      if (enteredOTP.length !== 6) {
        showToast('⚠️ Please enter the complete 6-digit OTP code.');
        return;
      }

      const success = state.verifyOTP(enteredOTP);
      if (success) {
        showToast(`🎉 Login Successful! Welcome back ${state.currentUser.name}.`);
      } else {
        showToast('❌ Invalid OTP code. Please check your Gmail or resend code.');
      }
    });

    // Resend OTP
    document.getElementById('btn-resend-otp')?.addEventListener('click', () => {
      const newOtp = state.sendEmailOTP(state.pendingEmail);
      showToast(`🔄 New OTP sent to ${state.pendingEmail}! (Code: ${newOtp})`);
    });

    // Change Email
    document.getElementById('btn-change-email')?.addEventListener('click', () => {
      state.authStep = 'email-input';
      state.notify();
    });
  }

  // Backdrop click & Close button
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    state.closeModal();
    state.authStep = 'email-input';
  });

  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      state.closeModal();
      state.authStep = 'email-input';
    }
  });
}
