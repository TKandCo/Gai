# Việc cần làm

Danh sách yêu cầu đã ghi nhận, làm theo thứ tự ưu tiên.

## Đã xong

- [x] Giao diện sáng dịu, hài hòa (mặc định sáng; tối chỉ bật thủ công trong Hồ sơ)
- [x] Thiết kế cho cả gia đình: hồ sơ không cần email, linh vật Gai 🦉, nút ❓ hướng dẫn, ví dụ đời thường; hồ sơ dưới 15 tuổi ẩn ví dụ đầu tư
- [x] Lộ trình 8 cấp, 37 bài: Nền tảng toán, Tư duy quyết định, Trò chơi cùng lúc, Trò chơi lần lượt, Trò chơi lặp lại, Thông tin bị giấu, Đấu giá và luật chơi, Con người thật
- [x] Câu đố 4 dạng (chọn, nhập số, chạm ô cân bằng, chạm cây trò chơi); đáp án dạng bảng/cây do bộ giải tính
- [x] Phần **Giải đáp** chỉ mở khi làm xong câu hỏi (yêu cầu 2026-11-03): đáp án, lời giải, điều cần ghi nhớ
- [x] Luyện tập ôn câu sai, kiểm tra vượt cấp, bài xếp lớp 12 câu, huy hiệu, chuỗi ngày học
- [x] Phòng lab: bảng lợi ích, chơi lặp lại với máy, giải đấu chiến lược có nhiễu
- [x] Nhật ký dự đoán + điểm Brier, bảng hiệu chỉnh
- [x] Gai Coach: thư viện 14 tình huống (6 cho trẻ em) + 14 khái niệm, hỏi gợi mở từng bước, giải đáp chỉ mở khi trả lời hết, chặn tư vấn đầu tư; chế độ cơ bản chạy trên máy, chế độ AI (Claude) tự bật khi có key; trang Tự kiểm tra 29 bài giả lập
- [x] Sao lưu / khôi phục dữ liệu bằng file (thay cho đồng bộ máy chủ)
- [x] Bàn phân tích sự kiện 8 bước (không cần AI): cổng phân loại, người chơi, lựa chọn, lợi ích, luật chơi, giả định, kết quả + độ bền kết luận, mô hình thay thế + lưu dự đoán

## Tiếp theo (cần tài khoản/khóa của bạn)

- [ ] **Bật Gai AI**: đặt ANTHROPIC_API_KEY trên Vercel rồi chạy "Thử Gai AI" trong trang Tự kiểm tra
- [ ] **Radar sự kiện**: gợi ý 3–5 tin đáng phân tích mỗi sáng — cần API key + chốt danh sách nguồn tin
- [ ] (Không bắt buộc) **Đồng bộ tự động nhiều thiết bị** qua Supabase — hiện đã có sao lưu bằng file. Trẻ em dưới 16 tuổi cần phụ huynh đồng ý khi lưu dữ liệu lên máy chủ

## Bước cuối

- [ ] Xem 3 cảnh báo bảo mật của npm
- [x] Đưa lên GitHub (TKandCo/Gai), GitHub Pages tự triển khai
- [ ] Trỏ gai.thuankhoi.com (CNAME → tkandco.github.io) và bật HTTPS
- [ ] Nhắc giờ học / hạn dự đoán bằng thông báo trên điện thoại (cần bản đã triển khai HTTPS)
