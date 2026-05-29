# TODO - BlackboxAI

## Mục tiêu
Hoàn thiện chức năng **Thêm phim mới** trong Admin: lưu bền vào `localStorage` và render lại bảng; đồng thời thêm chức năng **Xóa** cho nút Xóa trong danh sách phim.

## Checklist
- [x] Xem cấu trúc hiện tại của `assets/js/admin.js` và luồng submit form `#form-add-movie`.
- [x] Viết/hoàn thiện hàm đọc/ghi `localStorage` với key `db_all_movies`.
- [x] Viết `renderAdminMovies()` để render `<tr>` vào `<tbody>` theo dữ liệu `db_all_movies`.
- [x] Cập nhật submit form: tạo object phim mới với `id = movies.length + 1`, push vào mảng, lưu `JSON.stringify`.
- [x] Sau submit: gọi `renderAdminMovies()`, reset form và đóng modal.
- [x] Thêm xử lý click nút **Xóa**: confirm -> xóa đúng object theo `id` -> lưu lại -> render lại.
- [x] Giữ nguyên UI nút **Sửa** (chưa cần chức năng).


