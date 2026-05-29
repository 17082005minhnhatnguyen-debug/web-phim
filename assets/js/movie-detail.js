document.addEventListener('DOMContentLoaded', function () {
  // Render nội dung trang chi tiết dựa trên phim đã chọn từ trang chủ (tìm kiếm)
  // Hoặc fallback theo data hiện có trong HTML.

  const raw = localStorage.getItem('db_selected_movie');
  if (!raw) return;

  let movie = null;
  try {
    movie = JSON.parse(raw);
  } catch (e) {
    movie = null;
  }

  if (!movie) return;

  // Xóa dữ liệu sau khi đọc (tránh bị render lại sai khi vào trang bằng cách khác)
  // Nếu muốn giữ lại có thể bỏ dòng này.
  localStorage.removeItem('db_selected_movie');

  const titleEl = document.querySelector('main h1');
  const posterEl = document.querySelector('main img.img-fluid');
  const yearEls = document.querySelectorAll('.fas.fa-calendar-alt');

  // Update title
  if (titleEl) {
    titleEl.textContent = movie.movieName || titleEl.textContent;
  }

  // Update poster
  if (posterEl && movie.moviePoster) {
    posterEl.src = movie.moviePoster;
    posterEl.alt = movie.movieName || posterEl.alt;
  }

  // Update year
  const yearText = movie.movieYear != null ? String(movie.movieYear) : null;
  if (yearText) {
    // Tìm span chứa năm (trong HTML hiện tại là: <span><i class="fas fa-calendar-alt ..."></i> 2026</span>)
    yearEls.forEach(icon => {
      const parent = icon.closest('span');
      if (parent) {
        parent.childNodes.forEach(n => {
          if (n.nodeType === Node.TEXT_NODE) {
            // replace text nodes
          }
        });

        const iEl = icon;
        const parts = parent.childNodes;
        for (let i = 0; i < parts.length; i++) {
          if (parts[i].nodeType === Node.TEXT_NODE) {
            parts[i].textContent = ' ' + yearText;
          }
        }
      }
    });

    // Fallback: nếu không tìm thấy icon thì tìm span đầu tiên sau icon class.
    if (yearEls.length === 0) {
      const metaSpans = document.querySelectorAll('main .text-secondary span');
      if (metaSpans && metaSpans.length > 0) metaSpans[0].textContent = ' ' + yearText;
    }
  }

  // Update description
  const descEl = document.querySelector('main p.lead');
  if (descEl && movie.movieDescription) {
    descEl.textContent = movie.movieDescription;
  }

  // Update save button data (nếu tồn tại nút save)
  const btnSave = document.getElementById('btn-save-movie');
  if (btnSave) {
    btnSave.setAttribute('data-id', movie.id ?? btnSave.getAttribute('data-id'));
    btnSave.setAttribute('data-title', movie.movieName ?? btnSave.getAttribute('data-title'));
    btnSave.setAttribute('data-year', movie.movieYear ?? btnSave.getAttribute('data-year'));
    btnSave.setAttribute('data-image', movie.moviePoster ?? btnSave.getAttribute('data-image'));
  }
});

