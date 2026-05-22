document.addEventListener("DOMContentLoaded", function() {
    // 1. Lấy thông tin đăng nhập và vai trò (role) từ localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole"); // Lấy thêm vai trò (admin hoặc user)

    // 2. Tìm nút "Đăng nhập" màu đỏ trên thanh Menu
    const loginButton = document.querySelector('a[href="login.html"]');

    // 3. Nếu người dùng đã đăng nhập thành công
    if (isLoggedIn === "true" && loginButton) {
        
        // Bước 3.1: Kiểm tra vai trò để tạo các tùy chọn menu tương ứng
        let menuItemsHTML = `
            <li><a class="dropdown-item" href="profile.html"><i class="fas fa-id-card me-2"></i>Thông tin tài khoản</a></li>
            <li><a class="dropdown-item" href="saved-movies.html"><i class="fas fa-heart me-2"></i>Phim đã lưu</a></li>
            <li><hr class="dropdown-divider"></li>
        `;
        
        // CHỈ KHI LÀ ADMIN MỚI CÓ TÙY CHỌN VÀO TRANG QUẢN TRỊ
       if (userRole === "admin") {
            menuItemsHTML += `
                <li><a class="dropdown-item" href="admin/index.html"><i class="fas fa-tachometer-alt me-2"></i>Trang quản trị Admin</a></li>
                <li><hr class="dropdown-divider"></li>
            `;
        }
        
        // TÙY CHỌN ĐĂNG XUẤT NẰM CUỐI CÙNG
        menuItemsHTML += `
            <li><a class="dropdown-item text-danger" href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
        `;
        document.addEventListener("DOMContentLoaded", function() {
    // 1. Xử lý chức năng Thêm phim
    const formAddMovie = document.getElementById('form-add-movie');
    if (formAddMovie) {
        formAddMovie.addEventListener('submit', function(e) {
            e.preventDefault(); 
            alert('Đã thêm phim mới thành công!');
            const modalElement = document.getElementById('addMovieModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            formAddMovie.reset();
        });
    }

    // 2. Xử lý chức năng ĐĂNG XUẤT ở khu vực Admin
    const adminLogoutBtn = document.querySelector('.admin-sidebar-link.logout');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn hành vi chuyển trang ngay lập tức của thẻ <a>
            
            // Xóa sạch trạng thái đăng nhập trong bộ nhớ
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userName");
            localStorage.removeItem("userRole");
            
            alert("Đã đăng xuất khỏi tài khoản Admin an toàn!");
            window.location.href = "../index.html"; // Đẩy về trang chủ bên ngoài
        });
    }
});
        // TÀI KHOẢN NÀO CŨNG CÓ TÙY CHỌN ĐĂNG XUẤT
        menuItemsHTML += `
            <li><a class="dropdown-item text-danger" href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
        `;

        // Bước 3.2: Ráp các tùy chọn vào khung Dropdown hoàn chỉnh
        const userMenuHTML = `
            <div class="dropdown">
                <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user-circle me-1"></i> Xin chào, ${userName}
                </button>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-2">
                    ${menuItemsHTML}
                </ul>
            </div>
        `;

        // Bước 3.3: Thay thế nút Đăng nhập cũ bằng Menu phân quyền mới
        loginButton.outerHTML = userMenuHTML;

        // 4. Xử lý chức năng Đăng xuất khi bấm nút
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function(e) {
                e.preventDefault();
                
                // Xóa toàn bộ trạng thái trong bộ nhớ trình duyệt
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userName");
                localStorage.removeItem("userRole");
                
                alert("Bạn đã đăng xuất thành công!");
                window.location.reload(); // Tải lại trang để hiện lại nút Đăng nhập
            });
        }
        const bannerRegisterBtns = document.querySelectorAll('.carousel-inner a[href="login.html"]');
        bannerRegisterBtns.forEach(function(btn) {
            btn.style.display = 'none'; // Giấu nút đi
        });
    }
});