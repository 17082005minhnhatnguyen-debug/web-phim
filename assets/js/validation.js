
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

    emailInput?.addEventListener('input', () => clearError(emailError));
    passwordInput?.addEventListener('input', () => clearError(passwordError));

    formLogin.addEventListener('submit', (e) => {
      e.preventDefault(); // Luôn chặn load lại trang để xử lý bằng JS

      let ok = true;
      ok = validateEmail(emailInput, emailError, 'Email') && ok;
      ok = validatePasswordMin6(passwordInput, passwordError, 'Mật khẩu') && ok;

      if (ok) {
        const inputEmail = emailInput.value.trim();
        const inputPass = passwordInput.value;

        // Lấy thông tin từ "Database giả lập" (Bộ nhớ trình duyệt)
        const dbEmail = localStorage.getItem("db_email");
        const dbPass = localStorage.getItem("db_password");
        const dbName = localStorage.getItem("db_fullname");

        // Kiểm tra xem nhập có đúng tài khoản đã đăng ký không
        if (inputEmail === dbEmail && inputPass === dbPass) {
            
            // LƯU TRẠNG THÁI ĐĂNG NHẬP VÀ TÊN NGƯỜI DÙNG THẬT
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", dbName); 

            alert("Đăng nhập thành công! Chào mừng " + dbName);
            window.location.href = "index.html"; // Chuyển về trang chủ
        } 
        else {
            // Nếu nhập sai email hoặc mật khẩu
            showError(passwordError, "Email hoặc mật khẩu không đúng. (Hoặc bạn chưa đăng ký!)");
        }
      }
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
      e.preventDefault(); // Chặn load lại trang

      let ok = true;
      ok = validateRequired(fullnameInput, fullnameError, 'Họ tên') && ok;
      ok = validateEmail(emailInput, emailError, 'Email') && ok;
      ok = validatePasswordMin6(passwordInput, passwordError, 'Mật khẩu') && ok;
      ok = validateConfirmPassword(passwordInput, confirmInput, confirmError, 'Mật khẩu') && ok;

      if (ok) {
        // LƯU TOÀN BỘ THÔNG TIN ĐĂNG KÝ VÀO BỘ NHỚ TRÌNH DUYỆT
        localStorage.setItem("db_fullname", fullnameInput.value.trim());
        localStorage.setItem("db_email", emailInput.value.trim());
        localStorage.setItem("db_password", passwordInput.value);

        alert("Đăng ký thành công! Hệ thống đã ghi nhớ tài khoản của bạn.");
        
        // Tự động chuyển qua tab Đăng nhập và xóa trắng form đăng ký
        document.getElementById('tab-login').click();
        formRegister.reset();
      }
    });
  }

  // Init
  wireLoginValidation();
  wireRegisterValidation();
})();

