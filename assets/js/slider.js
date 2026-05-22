$(document).ready(function(){
    // Gọi đến class của khối cha để kích hoạt plugin Slick Carousel
    $('.movie-list-slider').slick({
        dots: false,         // Ẩn/Hiện các chấm tròn chuyển trang dưới slide
        infinite: true,      // Cho phép vòng lặp vô hạn khi vuốt hết phim
        speed: 300,          // Tốc độ chuyển phim (ms)
        slidesToShow: 4,     // Số lượng phim hiển thị trên màn hình máy tính
        slidesToScroll: 1,   // Số lượng phim cuộn mỗi lần bấm nút
        autoplay: true,      // Tự động cuộn phim
        autoplaySpeed: 3000, // Thời gian chờ tự động cuộn (3 giây)
        
        // CẤU HÌNH RESPONSIVE (Yêu cầu số 3)
        responsive: [
            {
                breakpoint: 1024, // Màn hình máy tính bảng (Tablet)
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,  // Màn hình điện thoại (Mobile)
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false // Ẩn nút mũi tên trên điện thoại để người dùng vuốt tay
                }
            }
        ]
    });
});