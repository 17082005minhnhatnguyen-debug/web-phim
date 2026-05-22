document.addEventListener("DOMContentLoaded", function() {
    const formAddMovie = document.getElementById('form-add-movie');
    
    if (formAddMovie) {
        formAddMovie.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn trang web tải lại
            
            // Hiện thông báo thành công
            alert('Đã thêm phim mới thành công!');
            
            // Tự động đóng khung Modal
            const modalElement = document.getElementById('addMovieModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            
            // Xóa trắng dữ liệu vừa nhập trong form
            formAddMovie.reset();
        });
    }
});