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
        let menuItemsHTML = '';
        
        // CHỈ KHI LÀ ADMIN MỚI CÓ TÙY CHỌN VÀO TRANG QUẢN TRỊ
        if (userRole === "admin") {
            menuItemsHTML += `
                <li><a class="dropdown-item" href="admin/index.html"><i class="fas fa-tachometer-alt me-2"></i>Trang quản trị Admin</a></li>
                <li><hr class="dropdown-divider"></li>
            `;
        }
        
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
    }
});