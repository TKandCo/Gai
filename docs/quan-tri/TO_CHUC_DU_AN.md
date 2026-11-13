# Tổ chức dự án GAI (GameTheory App)

> Chủ dự án đã duyệt ngày 2026-11-13. Mục "Tổ chức dự án" đã có trong `CLAUDE.md`.

## Quy mô dự án (căn cứ để chọn cơ cấu)

- Một người chủ dự án, một phiên Claude làm chính ("Gai"), một phiên điều phối liên dự án (CP).
- Mã nguồn: monorepo npm, 6 gói (`schema`, `gt-core`, `learning`, `calibration`, `coach`, `apps/web`), 392 bài test tự động (chạy lại 2026-11-13: 392/392 đạt).
- Chạy công khai tại https://gai.thuankhoi.com bằng GitHub Pages (website tĩnh). Không có máy chủ, không có cơ sở dữ liệu đang chạy; dữ liệu người dùng nằm trên trình duyệt của từng máy.
- Người dùng gồm cả trẻ em (hồ sơ gia đình, không cần email).

Dự án nhỏ nên đề xuất **1 tổng quản + 3 phòng**, không chia nhỏ hơn.

## Cơ cấu đề xuất

| Vai trò | Ai giữ | Phụ trách | Không được làm |
|---|---|---|---|
| **Tổng quản** | Phiên chính của dự án (Gai) | Điều phối, giữ **CHECKLIST** (đã/đang/sẽ làm theo từng phòng), viết **báo cáo gửi CP**, trình chủ dự án các việc cần duyệt | Tự duyệt việc thay chủ dự án |
| **Phòng Kỹ thuật** | Phiên chính (Gai) hoặc phiên con được giao | Bộ giải `gt-core`, ứng dụng web, Gai Coach (`coach`), CI/CD (`.github/workflows`), triển khai, nâng cấp thư viện | Tự kiểm định phần mình viết |
| **Phòng Nội dung & Sư phạm** | Phiên chính (Gai), chủ dự án duyệt nội dung | 37 bài học, 14 tình huống + 14 khái niệm của Gai Coach, an toàn nội dung cho trẻ em, lời lẽ tiếng Việt | Tự kiểm định phần mình viết |
| **Phòng Kiểm định & An toàn** | **Một phiên Claude riêng** (không phải phiên đã viết mã/nội dung đang được kiểm), hoặc chủ dự án | (1) **Audit độc lập** cho Kỹ thuật và Nội dung; (2) **Bảo mật & sao lưu**: bí mật để ở đâu, sao lưu ở đâu, khôi phục thử, phương án khi mất dịch vụ ngoài | Sửa trực tiếp phần đang audit (chỉ báo lỗi, phòng gốc sửa) |

### Ba chức năng bắt buộc

1. **Audit độc lập** — Phòng Kiểm định & An toàn. Nguyên tắc: người kiểm ≠ người viết. Nếu chính Phòng Kiểm định viết thứ gì (ví dụ quy trình sao lưu), Phòng Kỹ thuật kiểm lại phần đó.
2. **Checklist** — Tổng quản giữ `docs/quan-tri/CHECKLIST.md`, cập nhật sau mỗi đợt việc.
3. **Bảo mật & sao lưu** — Phòng Kiểm định & An toàn giữ; ghi kết quả vào mục (3), (4) của `docs/quan-tri/BAO_CAO_GUI_CP.md`.

### Nhịp làm việc đề xuất

- Mỗi đợt thay đổi lớn (tính năng mới, đổi cách triển khai, thêm dịch vụ ngoài): Phòng Kiểm định audit trước khi đẩy lên `main`.
- Mỗi tháng: chạy `npm audit`, kiểm header/HTTPS của trang thật, khôi phục thử một bản sao lưu.
- Báo cáo gửi CP: cập nhật khi có thay đổi trạng thái, tối thiểu mỗi tháng.

---

## Mục đã chép vào `CLAUDE.md`

```markdown
## Tổ chức dự án

- Tổng quản: phiên chính của dự án. Giữ docs/quan-tri/CHECKLIST.md và docs/quan-tri/BAO_CAO_GUI_CP.md.
- Phòng Kỹ thuật: gt-core, apps/web, coach, CI/CD, triển khai.
- Phòng Nội dung & Sư phạm: bài học (packages/learning/src/content), tình huống Gai Coach (packages/coach/src/library.ts), an toàn nội dung trẻ em.
- Phòng Kiểm định & An toàn: audit độc lập (người kiểm khác người viết), bảo mật, sao lưu, khôi phục thử.
- Không đưa bí mật (API key, token, mật khẩu) vào repo hay tài liệu; chỉ ghi có/không và nơi lưu.
- Không tư vấn đầu tư cá nhân trong app. Nội dung cho trẻ em phải qua kiểm định nội dung.
- Mọi thay đổi chỉ đẩy lên main sau khi chạy `npm run check` đạt.
```
