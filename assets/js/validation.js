
(function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }

  function clearError(errorEl) {
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }

  function isBlank(value) {
    return String(value ?? '').trim().length === 0;
  }

  function validateRequired(inputEl, errorEl, label) {
    if (isBlank(inputEl.value)) {
      showError(errorEl, `${label} không được để trống.`);
      return false;
    }
    clearError(errorEl);
    return true;
  }

  function validateEmail(inputEl, errorEl, label) {
    if (!validateRequired(inputEl, errorEl, label)) return false;
    if (!emailRegex.test(inputEl.value.trim())) {
      showError(errorEl, `${label} không đúng định dạng email.`);
      return false;
    }
    clearError(errorEl);
    return true;
  }

  function validatePasswordMin6(inputEl, errorEl, label) {
    if (!validateRequired(inputEl, errorEl, label)) return false;
    const pwd = inputEl.value;
    if (String(pwd).length < 6) {
      showError(errorEl, `${label} phải có ít nhất 6 ký tự.`);
      return false;
    }
    clearError(errorEl);
    return true;
  }

  function validateConfirmPassword(pwdEl, confirmEl, errorEl, label) {
    // confirmEl required + match
    if (!validateRequired(confirmEl, errorEl, `Nhập lại ${label}`)) return false;
    if (pwdEl.value !== confirmEl.value) {
      showError(errorEl, `Mật khẩu nhập lại không khớp.`);
      return false;
    }
    clearError(errorEl);
    return true;
  }

  function wireLoginValidation() {
    const formLogin = document.getElementById('form-login');
    if (!formLogin) return;

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const emailError = document.getElementById('error-login-email');
    const passwordError = document.getElementById('error-login-password');

    // Clear error on input
    emailInput?.addEventListener('input', () => clearError(emailError));
    passwordInput?.addEventListener('input', () => clearError(passwordError));

    formLogin.addEventListener('submit', (e) => {
      let ok = true;

      ok = validateEmail(emailInput, emailError, 'Email') && ok;
      ok = validatePasswordMin6(passwordInput, passwordError, 'Mật khẩu') && ok;

      if (!ok) e.preventDefault();
    });
  }

  function wireRegisterValidation() {
    const formRegister = document.getElementById('form-register');
    if (!formRegister) return;

    const fullnameInput = document.getElementById('register-fullname');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmInput = document.getElementById('register-confirm-password');

    const fullnameError = document.getElementById('error-register-fullname');
    const emailError = document.getElementById('error-register-email');
    const passwordError = document.getElementById('error-register-password');
    const confirmError = document.getElementById('error-register-confirm-password');

    fullnameInput?.addEventListener('input', () => clearError(fullnameError));
    emailInput?.addEventListener('input', () => clearError(emailError));
    passwordInput?.addEventListener('input', () => clearError(passwordError));
    confirmInput?.addEventListener('input', () => clearError(confirmError));

    formRegister.addEventListener('submit', (e) => {
      let ok = true;

      ok = validateRequired(fullnameInput, fullnameError, 'Họ tên') && ok;
      ok = validateEmail(emailInput, emailError, 'Email') && ok;
      ok = validatePasswordMin6(passwordInput, passwordError, 'Mật khẩu') && ok;
      ok = validateConfirmPassword(passwordInput, confirmInput, confirmError, 'Mật khẩu') && ok;

      if (!ok) e.preventDefault();
    });
  }

  // Init
  wireLoginValidation();
  wireRegisterValidation();
})();

