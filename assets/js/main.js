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

    // 6. Search phim -> chuyển sang trang movie-detail.html
    //    Yêu cầu: Khi submit form tìm kiếm, tìm phim theo Tên phim trong db_all_movies,
    //    nếu có thì chuyển sang movie-detail.html giống như phim hiển thị.
    //    nếu không có -> hiển thị "phim không tồn tại".
    const searchForm = document.querySelector('form[role="search"]');
    const searchInput = document.querySelector('form[role="search"] input[type="search"]');
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const keyword = (searchInput.value || '').trim();
            if (!keyword) return;

            let allMovies = [];
            try {
                allMovies = JSON.parse(localStorage.getItem('db_all_movies')) || [];
            } catch (err) {
                allMovies = [];
            }

            // Match không phân biệt hoa/thường, so khớp theo phần tử tên
            const found = allMovies.find(m =>
                String(m.movieName || '').toLowerCase().includes(keyword.toLowerCase())
            );

            if (!found) {
                alert('phim không tồn tại');
                return;
            }

            // Lưu phim tạm để trang movie-detail đọc hiển thị
            localStorage.setItem('db_selected_movie', JSON.stringify(found));
            window.location.href = 'movie-detail.html';
        });
    }

    // 7. Render danh sách phim Thịnh Hành từ localStorage (db_all_movies)
    //    Sau đó khởi tạo lại Slick Carousel theo cấu hình cũ trong assets/js/slider.js
    const renderTrendingFromLocalStorage = function () {
        const sliderEl = document.querySelector('.movie-list-slider');
        if (!sliderEl) return;

        let allMovies = [];
        try {
            allMovies = JSON.parse(localStorage.getItem('db_all_movies')) || [];
        } catch (err) {
            allMovies = [];
        }

        if (!Array.isArray(allMovies) || allMovies.length === 0) return;

        // Nếu Slick đã được init, hủy trước khi thay đổi HTML
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.slick) {
            try {
                window.jQuery('.movie-list-slider').slick('unslick');
            } catch (e) {
                // ignore
            }
        }

        // Làm rỗng nội dung hiện tại
        sliderEl.innerHTML = '';

        const fragments = [];
        allMovies.forEach(movie => {
            const movieName = movie.movieName || '';
            const movieYear = movie.movieYear || '';
            const poster = movie.moviePoster || '';

            const cardHtml = `
                <div class="px-2">
                    <a href="movie-detail.html" class="text-decoration-none">
                        <div class="trending-card">
                            <div class="trending-card__poster">
                                <img
                                    src="${poster ? poster.replace(/"/g, '"') : ''}"
                                    alt="${movieName.replace(/"/g, '"')}"
                                    class="w-100 h-100 object-fit-cover"
                                    onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))';"
                                />
                                <div class="trending-card__play">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                            <div class="trending-card__body p-2">
                                <div class="trending-card__title">${movieName}</div>
                                <div class="trending-card__year">${movieYear}</div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            fragments.push(cardHtml);
        });

        sliderEl.insertAdjacentHTML('beforeend', fragments.join(''));

        // Khởi tạo lại Slick
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.slick) {
            try {
                window.jQuery('.movie-list-slider').slick({
                    dots: false,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                arrows: false
                            }
                        }
                    ]
                });
            } catch (e) {
                // ignore
            }
        }
    };

    // Gọi tự động khi trang tải xong
    renderTrendingFromLocalStorage();

    // 8. Lưu phim vào danh sách yêu thích từ trang chi tiết phim

    

    const saveMovieBtns = document.querySelectorAll('#btn-save-movie, .btn-save-movie');
    if (saveMovieBtns && saveMovieBtns.length > 0) {
        saveMovieBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                const id = parseInt(this.getAttribute('data-id'), 10);
                const title = this.getAttribute('data-title') || '';
                const year = this.getAttribute('data-year') || '';
                const image = this.getAttribute('data-image') || '';

                if (Number.isNaN(id)) {
                    alert('Không thể lưu phim: thiếu data-id');
                    return;
                }

                let savedMovies = [];
                try {
                    savedMovies = JSON.parse(localStorage.getItem('db_saved_movies')) || [];
                } catch (err) {
                    savedMovies = [];
                }

                const existed = savedMovies.some(movie => String(movie.id) === String(id));
                if (existed) {
                    alert('Phim này đã có trong danh sách yêu thích!');
                    return;
                }

                savedMovies.push({ id, title, year, image });
                localStorage.setItem('db_saved_movies', JSON.stringify(savedMovies));

                alert('Đã thêm vào danh sách thành công!');

                // (Tùy chọn UI): đổi icon/text nếu có
                const iconEl = this.querySelector('i');
                if (iconEl) {
                    iconEl.classList.remove('fa-plus');
                    iconEl.classList.add('fa-check');
                }

                this.classList.add('saved');
                this.innerHTML = this.innerHTML.replace(/Thêm vào danh sách phim/, 'Đã lưu');
            });
        });
    }
});
