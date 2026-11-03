# Việc cần làm

Danh sách yêu cầu đã ghi nhận, làm theo thứ tự ưu tiên.

## Phiên tiếp theo (làm trước khi vào P1)

- [ ] **Giao diện sáng dịu, hài hòa** (yêu cầu 2026-11-03)
  - Hiện tại app tự chuyển sang nền tối theo cài đặt điện thoại → quá tối.
  - Mặc định dùng giao diện sáng: nền trắng ngà ấm (không trắng gắt), bề mặt thẻ nhẹ nhàng, chữ đủ tương phản.
  - Chỉnh lại bộ màu nhấn và màu hai bên chơi (xanh / cam), màu ô cân bằng (vàng) cho hài hòa, dịu mắt khi đọc lâu.
  - Không tự ép nền tối theo hệ thống; có thể giữ nút chuyển chế độ tối tùy chọn.
  - Cập nhật màu thanh trạng thái (theme-color) và manifest; kiểm tra lại trên khung điện thoại.
  - File liên quan: `apps/web/app/globals.css`, `apps/web/app/layout.tsx`, `apps/web/app/manifest.ts`.

## Còn treo

- [ ] Xem 3 cảnh báo bảo mật của npm trước khi đưa lên website thật.
- [ ] Chốt lĩnh vực ưu tiên (mặc định: đầu tư + kinh doanh, bối cảnh Việt Nam).
- [ ] Đưa lên GitHub, nối Vercel và tên miền thuankhoi.com (xem `docs/DEPLOY.md`).
