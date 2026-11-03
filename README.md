# GAI – Tư duy chiến lược

Ứng dụng (ưu tiên điện thoại) giúp học và áp dụng lý thuyết trò chơi để phân tích sự kiện và ra quyết định.

- Website: https://gai.thuankhoi.com
- Kiến trúc: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Triển khai (GitHub Pages, tên miền; Vercel khi cần Gai AI): [docs/DEPLOY.md](docs/DEPLOY.md)

## Chạy trên máy

Cần Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Muốn thử trên điện thoại cùng mạng Wi-Fi: mở `http://<IP máy tính>:3000`.

## Lệnh thường dùng

| Lệnh | Việc |
|------|------|
| `npm run dev` | Chạy bản phát triển |
| `npm test` | Chạy test bộ giải |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |
| `npm run build` | Build bản production |
| `npm run check` | Kiểm tra kiểu + test (chạy trước khi đẩy code) |

## Cấu trúc

```
apps/web/          Ứng dụng Next.js (PWA, giao diện điện thoại)
packages/schema/   Định dạng dữ liệu dùng chung (Zod)
packages/gt-core/  Bộ giải lý thuyết trò chơi + test
supabase/          Cấu trúc cơ sở dữ liệu
docs/              Tài liệu kiến trúc và triển khai
```

Nội dung mang tính giáo dục, không phải tư vấn đầu tư.
