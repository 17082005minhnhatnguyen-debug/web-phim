document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    const loginButton = document.querySelector('a[href="login.html"]');

    if (isLoggedIn === "true" && loginButton) {
        
        // Bước 3.1: Các tùy chọn DÀNH CHO TẤT CẢ MỌI NGƯỜI (Cả User và Admin đều thấy)
        let menuItemsHTML = `
            <li><a class="dropdown-item" href="profile.html"><i class="fas fa-id-card me-2"></i>Thông tin tài khoản</a></li>
            <li><a class="dropdown-item" href="saved-movies.html"><i class="fas fa-heart me-2"></i>Phim đã lưu</a></li>
            <li><hr class="dropdown-divider"></li>
        `;
        
        // CHỈ KHI LÀ ADMIN MỚI ĐƯỢC CỘNG THÊM TÙY CHỌN NÀY
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

        // Ráp vào khung Dropdown
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

        loginButton.outerHTML = userMenuHTML;

        // Xử lý nút Đăng xuất
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userName");
                localStorage.removeItem("userRole");
                alert("Bạn đã đăng xuất thành công!");
                window.location.reload(); 
            });
        }
    }
});