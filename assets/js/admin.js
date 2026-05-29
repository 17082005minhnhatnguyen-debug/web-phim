document.addEventListener('DOMContentLoaded', function () {
  const DB_ALL_MOVIES_KEY = 'db_all_movies';

  
function getDbAllMovies() {
    try {
      const raw = localStorage.getItem(DB_ALL_MOVIES_KEY);
      if (!raw) {
        // KHỞI TẠO DỮ LIỆU MẶC ĐỊNH NẾU CHƯA CÓ
       const defaultMovies = [
          { id: 1, movieName: "Stranger Things", movieCategory: "Khoa học viễn tưởng", movieYear: "2019", moviePoster: "assets/images/products/poster1.jpg" },
          { id: 2, movieName: "Money Heist", movieCategory: "Hình sự", movieYear: "2017", moviePoster: "assets/images/products/illusion-design-money-heist-poster-min.jpg" },
          { id: 3, movieName: "The Witcher", movieCategory: "Fantasy", movieYear: "2019", moviePoster: "assets/images/products/z7854927446163_2f09dcef814f7b0eabf8db66047eeabb.jpg" },
          { id: 4, movieName: "Dark", movieCategory: "Khoa học viễn tưởng", movieYear: "2017", moviePoster: "assets/images/products/review-phim-dark_elle-man-feature-2.jpg" },
          { id: 5, movieName: "The Boys", movieCategory: "Hành động", movieYear: "2019", moviePoster: "assets/images/products/z7880620421383_c32cbb181eba00fb477bac38a54af81a.jpg" },
          { id: 6, movieName: "Wednesday", movieCategory: "Fantasy", movieYear: "2022", moviePoster: "assets/images/products/81Y1OJVIoJL._AC_UF1000,1000_QL80_.jpg" }
        ];
        localStorage.setItem(DB_ALL_MOVIES_KEY, JSON.stringify(defaultMovies));
        return defaultMovies;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function saveDbAllMovies(movies) {
    localStorage.setItem(DB_ALL_MOVIES_KEY, JSON.stringify(Array.isArray(movies) ? movies : []));
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#039;');
  }

  function renderAdminMovies() {
    const tbody = document.getElementById('admin-movie-list');
    if (!tbody) return;

    const movies = getDbAllMovies();

    if (movies.length === 0) {
      tbody.innerHTML = '';
      return;
    }

    tbody.innerHTML = movies
      .map(
        (movie) => `
        <tr>
          <td>${escapeHtml(movie.id ?? '')}</td>
          <td>
            <img
              src="${escapeHtml(movie.moviePoster || '')}"
              alt="${escapeHtml(movie.movieName || '')}"
              class="rounded border"
              style="width: 80px; height: 60px; object-fit: cover;">
          </td>
          <td>${escapeHtml(movie.movieName ?? '')}</td>
          <td>${escapeHtml(movie.movieCategory ?? '')}</td>
          <td>${escapeHtml(movie.movieYear ?? '')}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-2" title="Sửa">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" title="Xóa" data-movie-id="${escapeHtml(movie.id)}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `
      )
      .join('');

    tbody.querySelectorAll("button[title='Xóa'][data-movie-id]").forEach((btn) => {
      btn.addEventListener('click', function () {
        const id = Number(this.getAttribute('data-movie-id'));
        const ok = window.confirm('Bạn chắc chắn muốn xóa phim này không?');
        if (!ok) return;

        const moviesNow = getDbAllMovies();
        const filtered = moviesNow.filter((m) => Number(m.id) !== id);
        saveDbAllMovies(filtered);
        renderAdminMovies();
      });
    });
  }

  renderAdminMovies();

  // 1. Lấy thông tin đăng nhập và vai trò (role) từ localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  // 2. Tìm nút "Đăng nhập" màu đỏ trên thanh Menu
  const loginButton = document.querySelector('a[href="login.html"]');

  // 3. Nếu người dùng đã đăng nhập thành công
  if (isLoggedIn === 'true' && loginButton) {
    let menuItemsHTML = `
      <li><a class="dropdown-item" href="profile.html"><i class="fas fa-id-card me-2"></i>Thông tin tài khoản</a></li>
      <li><a class="dropdown-item" href="saved-movies.html"><i class="fas fa-heart me-2"></i>Phim đã lưu</a></li>
      <li><hr class="dropdown-divider"></li>
    `;

    // CHỈ KHI LÀ ADMIN MỚI CÓ TÙY CHỌN VÀO TRANG QUẢN TRỊ
    if (userRole === 'admin') {
      menuItemsHTML += `
        <li><a class="dropdown-item" href="admin/index.html"><i class="fas fa-tachometer-alt me-2"></i>Trang quản trị Admin</a></li>
        <li><hr class="dropdown-divider"></li>
      `;
    }

    menuItemsHTML += `
      <li><a class="dropdown-item text-danger" href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
    `;

    const userMenuHTML = `
      <div class="dropdown">
        <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-user-circle me-1"></i> Xin chào, ${escapeHtml(userName)}
        </button>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-2">
          ${menuItemsHTML}
        </ul>
      </div>
    `;

    loginButton.outerHTML = userMenuHTML;

    // 3.4: Xử lý chức năng Đăng xuất khi bấm nút (Navbar)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');

        alert('Bạn đã đăng xuất thành công!');
        window.location.reload();
      });
    }

    // 3.5: Ẩn nút đăng nhập trong carousel nếu có
    const bannerRegisterBtns = document.querySelectorAll('.carousel-inner a[href="login.html"]');
    bannerRegisterBtns.forEach(function (btn) {
      btn.style.display = 'none';
    });
  }

  // 4. Xử lý chức năng ĐĂNG XUẤT ở khu vực Admin (sidebar logout)
  const adminLogoutBtn = document.querySelector('.admin-sidebar-link.logout');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', function (e) {
      e.preventDefault();

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');

      alert('Đã đăng xuất khỏi tài khoản Admin an toàn!');
      window.location.href = '../index.html';
    });
  }

  // 5. Xử lý chức năng Thêm phim (Admin modal)
  const formAddMovie = document.getElementById('form-add-movie');
  if (formAddMovie) {
    formAddMovie.addEventListener('submit', function (e) {
      e.preventDefault();

      const movies = getDbAllMovies();

      const movieName = document.getElementById('movie-name')?.value?.trim();
      const movieCategory = document.getElementById('movie-category')?.value?.trim();
      const movieYear = document.getElementById('movie-year')?.value?.trim();
      const moviePoster = document.getElementById('movie-poster')?.value?.trim();
      const movieDescription = document.getElementById('movie-description')?.value?.trim();

      const newMovie = {
        id: movies.length + 1,
        movieName,
        movieCategory,
        movieYear,
        moviePoster,
        movieDescription,
      };

      movies.push(newMovie);
      saveDbAllMovies(movies);

      renderAdminMovies();

      // reset form và đóng modal
      const modalElement = document.getElementById('addMovieModal');
      if (modalElement && window.bootstrap && window.bootstrap.Modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
      }

      formAddMovie.reset();
    });
  }
});

