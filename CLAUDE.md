# GAI – Tư duy chiến lược

App học lý thuyết trò chơi cho cả gia đình (kể cả trẻ em), giao diện tiếng Việt, ưu tiên điện thoại.
Chạy tại https://gai.thuankhoi.com (GitHub Pages, website tĩnh). Kiến trúc: `docs/ARCHITECTURE.md`. Triển khai: `docs/DEPLOY.md`.

## Lệnh

- `npm run check` — kiểm tra kiểu + 392 test. Phải đạt trước khi đẩy lên `main`.
- `npm run dev` — chạy trên máy. `npm run build:static` — build bản cho GitHub Pages.
- Đẩy lên `main` = tự triển khai lên gai.thuankhoi.com (`.github/workflows/pages.yml`).

## Tiêu chuẩn

- Theo **Tiêu chuẩn code chung v1.0**, **hạng B** (chủ dự án duyệt áp dụng 2026-11-13): `docs/quan-tri/TIEU_CHUAN_CODE.md`.
- Bản tự chấm: `docs/quan-tri/TU_CHAM_TIEU_CHUAN.md`. Ngoại lệ: `docs/quan-tri/NGOAI_LE.md`.
- Báo lỗi phải ghi mã quy tắc (ví dụ `FE-01`). Không cài công cụ hay gói mới khi chưa được chủ dự án duyệt (AI-06).

## Tổ chức dự án

Chi tiết: `docs/quan-tri/TO_CHUC_DU_AN.md` (duyệt 2026-11-13).

- Tổng quản: phiên chính của dự án. Giữ `docs/quan-tri/CHECKLIST.md` và `docs/quan-tri/BAO_CAO_GUI_CP.md`.
- Phòng Kỹ thuật: gt-core, apps/web, coach, CI/CD, triển khai.
- Phòng Nội dung & Sư phạm: bài học (`packages/learning/src/content`), tình huống Gai Coach (`packages/coach/src/library.ts`), an toàn nội dung trẻ em.
- Phòng Kiểm định & An toàn: audit độc lập (người kiểm khác người viết), bảo mật, sao lưu, khôi phục thử.
- Không đưa bí mật (API key, token, mật khẩu) vào repo hay tài liệu; chỉ ghi có/không và nơi lưu.
- Không tư vấn đầu tư cá nhân trong app. Nội dung cho trẻ em phải qua kiểm định nội dung.
- Mọi thay đổi chỉ đẩy lên main sau khi chạy `npm run check` đạt.
