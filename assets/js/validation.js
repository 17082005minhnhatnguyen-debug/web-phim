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
    if (!validateRequired(confirmEl, errorEl, `Nhập lại ${label}`)) return false;
    if (pwdEl.value !== confirmEl.value) {
      showError(errorEl, `Mật khẩu nhập lại không khớp.`);
      return false;
    }
    clearError(errorEl);
    return true;
  }

  // Hàm helper lấy danh sách User hoặc khởi tạo dữ liệu mẫu nếu chưa có
  function getDbAllUsers() {
    let users = JSON.parse(localStorage.getItem("db_all_users"));
    if (!users) {
      users = [
        { id: 1, fullname: "Quản trị viên", email: "anhtoiday@gmail.com", password: "admin.123", role: "admin" },
        { id: 2, fullname: "Trần Thị B", email: "tranthib@example.com", password: "123456", role: "user" },
        { id: 3, fullname: "Lê Văn C", email: "levanc@example.com", password: "123456", role: "user" }
      ];
      localStorage.setItem("db_all_users", JSON.stringify(users));
    }
    return users;
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
      e.preventDefault();

      let ok = true;
      ok = validateEmail(emailInput, emailError, 'Email') && ok;
      ok = validatePasswordMin6(passwordInput, passwordError, 'Mật khẩu') && ok;

      if (ok) {
        const inputEmail = emailInput.value.trim();
        const inputPass = passwordInput.value;

        // Lấy danh sách toàn bộ User trong hệ thống để kiểm tra
        const allUsers = getDbAllUsers();
        
        // Tìm tài khoản trùng khớp cả email và password
        const foundUser = allUsers.find(u => u.email === inputEmail && u.password === inputPass);

        if (foundUser) {
          // Lưu trạng thái phiên đăng nhập của tài khoản tìm thấy
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userName", foundUser.fullname); 
          localStorage.setItem("userRole", foundUser.role);

          // Đồng bộ với các key đơn lẻ để trang profile.html không bị lỗi
          localStorage.setItem("db_fullname", foundUser.fullname);
          localStorage.setItem("db_email", foundUser.email);

          if (foundUser.role === "admin") {
            alert("Đăng nhập quyền Admin thành công! Chuyển hướng đến Dashboard...");
            window.location.href = "admin/index.html";
          } else {
            alert("Đăng nhập thành công! Chào mừng " + foundUser.fullname);
            window.location.href = "index.html";
          }
        } else {
          showError(passwordError, "Email hoặc mật khẩu không đúng, hoặc tài khoản không tồn tại!");
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
      e.preventDefault();

      let ok = true;
      ok = validateRequired(fullnameInput, fullnameError, 'Họ tên') && ok;
      ok = validateEmail(emailInput, emailError, 'Email') && ok;
      ok = validatePasswordMin6(passwordInput, passwordError, 'Mật khẩu') && ok;
      ok = validateConfirmPassword(passwordInput, confirmInput, confirmError, 'Mật khẩu') && ok;

      if (ok) {
        const allUsers = getDbAllUsers();
        const newEmail = emailInput.value.trim();

        // Kiểm tra xem email này đã tồn tại trong mảng chưa
        const isExist = allUsers.some(u => u.email.toLowerCase() === newEmail.toLowerCase());
        if (isExist) {
          showError(emailError, "Email này đã được đăng ký bởi một tài khoản khác!");
          return;
        }

        // Tạo đối tượng người dùng mới và push vào mảng công dồn ID
        const newUser = {
          id: allUsers.length + 1,
          fullname: fullnameInput.value.trim(),
          email: newEmail,
          password: passwordInput.value,
          role: "user" // Mặc định tài khoản mới tạo luôn là thành viên (user)
        };

        allUsers.push(newUser);
        
        // Lưu mảng mới cập nhật lại vào localStorage
        localStorage.setItem("db_all_users", JSON.stringify(allUsers));

        alert("Đăng ký thành công! Hệ thống đã ghi nhớ tài khoản của bạn.");
        
        document.getElementById('tab-login').click();
        formRegister.reset();
      }
    });
  }

  // Khởi chạy
  wireLoginValidation();
  wireRegisterValidation();
})();