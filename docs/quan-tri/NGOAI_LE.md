# Sổ ngoại lệ — GAI

> Theo mục 17 của `docs/quan-tri/TIEU_CHUAN_CODE.md` (v1.0). Chỉ chủ dự án được duyệt ngoại lệ.

| # | Quy tắc | Nội dung lệch | Lý do | Ai duyệt, khi nào | Hạn xem lại |
|---|---|---|---|---|---|
| 1 | PT-02 | **Tạm giữ, chưa vá** 3 lỗ hổng npm: `postcss@8.4.31` trong `next` (Cao), `zod@3.25.76` qua `@anthropic-ai/sdk` (Cao), `next@15.5.28` (Trung bình) | Dùng làm mẫu để Trạm Kiểm Định thử xem có phát hiện đúng không (đợt GĐ0). Ảnh hưởng thực tế hẹp: postcss chỉ dùng lúc build; zod 3 chỉ nằm trong mã Gai AI, bản đang chạy (website tĩnh) không có phần này | Chủ dự án, trong phiên GAI, 2026-11-13 | Ngay khi Trạm quét xong GĐ0, và **không muộn hơn 2026-11-20** (hạn 7 ngày cho mức Cao, mục 16) |
| 2 | QT-01 | Kho mã để **công khai** thay vì riêng tư | GitHub Pages miễn phí chỉ chạy với kho công khai; kho không chứa bí mật nào | Chủ dự án, trong phiên GAI, 2026-11-03 | Khi chuyển sang hosting khác (Vercel, Cloud Run) hoặc nâng gói GitHub |
