# Checklist dự án GAI

> Người giữ: **Tổng quản**. Cập nhật lần cuối: 2026-11-13.
> Nguồn: lịch sử git (commit đến `59fe09c`, 2026-11-03), `docs/BACKLOG.md`, kiểm tra trực tiếp ngày 2026-11-13.
> Ký hiệu: ✅ đã làm · 🔄 đang làm · ⏳ sẽ làm · ⛔ chờ chủ dự án · ❓ chưa kiểm

## Tổng quản

- ✅ Kiến trúc và quyết định chính ghi trong `docs/ARCHITECTURE.md` (mục 0)
- ✅ Danh sách việc trong `docs/BACKLOG.md`
- ✅ Lập cơ cấu tổ chức, checklist, báo cáo gửi CP (chủ dự án duyệt 2026-11-13)
- ✅ Tạo `CLAUDE.md` có mục "Tổ chức dự án" (2026-11-13)
- ⏳ Đặt hạn cho các việc trong BACKLOG (hiện chưa việc nào có hạn)

## Phòng Kỹ thuật

- ✅ Bộ giải `gt-core`: bảng lợi ích, cây trò chơi (suy luận ngược), trò chơi lặp, độ bền kết luận (`c21236a`, `540dbc1`, `e007efb`)
- ✅ Ứng dụng web PWA, cài được lên điện thoại, chạy khi mất mạng
- ✅ Gai Coach chế độ cơ bản (offline) + trang tự kiểm tra 29 bài (`d7b7fb0`)
- ✅ Mã Gai AI (Claude) phía máy chủ (`apps/web/app/api/coach/route.api.ts`), **chỉ chạy khi triển khai có máy chủ**
- ✅ Triển khai GitHub Pages tự động (`.github/workflows/pages.yml`); 3 lần triển khai gần nhất thành công (2026-11-03)
- ✅ Tự tải lại trang khi gặp file JS cũ sau cập nhật (`55574ab`)
- ✅ Sao lưu/khôi phục dữ liệu bằng file trong trang Hồ sơ (`d7b7fb0`)
- ⏳ **Vá 3 lỗ hổng npm** (1 trung bình, 2 cao) đang ghim trong `package-lock.json` — xem báo cáo mục (7)
- ⏳ Header bảo mật cho trang thật: GitHub Pages không gửi header nào (xem báo cáo mục (3))
- ⛔ Chọn nơi chạy Gai AI: Google Cloud Run hay chung máy chủ jenny (hỏi chủ dự án ngày 2026-11-03, chưa trả lời)
- ⛔ Bật Gai AI (cần Claude API key, có chi phí)
- ⏳ Thông báo nhắc học / hạn dự đoán trên điện thoại

## Phòng Nội dung & Sư phạm

- ✅ 8 cấp, 37 bài, mỗi bài 5 câu đố; đáp án dạng bảng/cây do bộ giải tính, có test kiểm (`learning.test.ts`)
- ✅ Phần Giải đáp chỉ mở khi làm xong câu hỏi (yêu cầu chủ dự án 2026-11-03)
- ✅ 14 tình huống Gai Coach (6 cho trẻ em) + 14 khái niệm
- ✅ Hồ sơ dưới 15 tuổi ẩn ví dụ đầu tư; Gai Coach chặn câu hỏi tư vấn mua bán tài sản
- ❓ Chủ dự án hoặc người ngoài **chưa đọc duyệt** toàn bộ nội dung bài học và tình huống
- ⏳ Radar sự kiện (gợi ý tin hằng ngày) — cần API key và danh sách nguồn tin

## Phòng Kiểm định & An toàn

- ❓ **Chưa có audit độc lập nào**: toàn bộ mã và nội dung đến nay do cùng một phiên viết và tự kiểm (test tự động + thử trên trình duyệt)
- ✅ Quét bí mật trong repo (2026-11-13): không thấy khóa, token hay mật khẩu bị đưa vào git
- ✅ Chạy lại test (2026-11-13): 392/392 đạt
- ❓ Khôi phục thử từ file sao lưu: **chưa từng thử** trên trình duyệt thật
- ❓ Bản sao thứ ba của mã nguồn (ngoài GitHub và ổ D: máy chủ dự án): chưa kiểm
- ⏳ Lịch kiểm tra hằng tháng (npm audit, header, khôi phục thử)
