# Báo cáo gửi CP — Dự án GAI (GameTheory App)

> Người lập: Tổng quản (phiên chính của dự án). Ngày: 2026-11-13.
> Trạng thái: **chủ dự án đã duyệt 2026-11-13**.
> Nguyên tắc: chỉ ghi điều có nguồn trong repo hoặc đã kiểm trực tiếp ngày 2026-11-13; điều chưa kiểm ghi "chưa kiểm". Không chép bí mật, chỉ ghi có/không và nơi lưu.

## Tiêu chuẩn đang theo

- Tiêu chuẩn code chung **v1.0, hạng B**, chủ dự án duyệt áp dụng 2026-11-13 trong phiên GAI.
- Tự chấm 48 quy tắc bắt buộc: **13 Đạt · 24 Chưa/Một phần · 10 Không áp dụng · 1 chưa kiểm** → chưa đạt. Chi tiết: `docs/quan-tri/TU_CHAM_TIEU_CHUAN.md` (tự chấm, cần CP/Trạm kiểm lại).
- Ngoại lệ: PT-02 (tạm giữ 3 lỗ hổng npm cho Trạm quét thử, xem lại muộn nhất 2026-11-20), QT-01 (kho công khai). Xem `docs/quan-tri/NGOAI_LE.md`.

## Đính chính so với thông tin CP nhận được

- **App hiện KHÔNG dùng Supabase.** Repo có mã đăng nhập Supabase (`apps/web/lib/supabase.ts`, `app/login`, `app/auth/callback`) và một file cấu trúc bảng (`supabase/migrations/0001_profiles.sql`, có bật RLS), nhưng **chưa có project Supabase nào được nối**: không có biến môi trường Supabase trong repo, trên máy dự án hay trong workflow triển khai. Trang thật là website tĩnh trên GitHub Pages, phần đăng nhập tự tắt.
- Dữ liệu người dùng (hồ sơ, tiến độ, nhật ký) nằm trong trình duyệt của từng máy (`localStorage`), không nằm trên máy chủ nào.
- Có Supabase project trong tài khoản chủ dự án hay không: **chưa kiểm** (ngoài repo).

## (1) Việc chờ chủ dự án duyệt

| # | Việc | Hỏi từ | Ghi chú |
|---|---|---|---|
| 1 | ~~Duyệt bộ tài liệu quản trị và mục "Tổ chức dự án" trong `CLAUDE.md`~~ | 2026-11-13 | **Đã duyệt 2026-11-13** |
| 2 | Chọn nơi chạy Gai AI: **Google Cloud Run** (đề xuất) hay **chung máy chủ jenny** | 2026-11-03 | Chưa trả lời |
| 3 | Cấp Claude API key và đồng ý chi phí theo lượt dùng để bật Gai AI | 2026-11-03 | Không có key thì app vẫn chạy chế độ cơ bản |
| 4 | ~~Vá 3 lỗ hổng npm~~ | 2026-11-13 | **Đã quyết 2026-11-13: tạm giữ cho Trạm quét GĐ0, vá sau; hạn 2026-11-20** (NGOAI_LE #1) |
| 5 | Danh sách nguồn tin cho Radar sự kiện | 2026-11-03 (BACKLOG) | Chưa có |
| 6 | Có cần đồng bộ nhiều thiết bị qua Supabase không (nếu có: phụ huynh phải đồng ý cho dữ liệu trẻ em) | 2026-11-03 (BACKLOG) | Hiện chỉ có sao lưu bằng file |
| 7 | Bật bảo vệ nhánh `main` + làm việc qua PR (QT-02) — chủ dự án bật trong GitHub | 2026-11-13 | Đổi cách làm việc hằng ngày |
| 8 | Xác nhận 2FA cho GitHub TKandCo, Squarespace, Google, Anthropic (BM-06) | 2026-11-13 | Chủ dự án tự làm |
| 9 | Duyệt danh sách việc để đạt tiêu chuẩn (cuối `TU_CHAM_TIEU_CHUAN.md`), gồm cài gitleaks (AI-06) | 2026-11-13 | Sửa mã ở lượt sau |

## (2) Việc quá hạn

- Không việc nào trong `docs/BACKLOG.md` có hạn, nên **không xác định được việc quá hạn**.
- Lưu ý: câu hỏi số 2 và 3 ở mục (1) đã chờ 10 ngày (từ 2026-11-03).
- Mục "Vá cảnh báo bảo mật npm (0 lỗ hổng)" trong BACKLOG đang ghi ✅ nhưng **không còn đúng** ngày 2026-11-13 (xem mục 7).

## (3) Bảo mật

| Hạng mục | Tình trạng | Nguồn / cách kiểm |
|---|---|---|
| Bí mật trong repo | **Không thấy** khóa/token/mật khẩu nào bị đưa vào git | `git grep` các mẫu khóa phổ biến, 2026-11-13 |
| File `.env` | Chỉ có `apps/web/.env.example` (để trống). `.env`, `.env.local` bị chặn bởi `.gitignore`; trên máy dự án hiện **không có** file `.env.local` nào | Kiểm trực tiếp |
| Claude API key (`ANTHROPIC_API_KEY`) | **Chưa có** ở đâu cả. Theo thiết kế chỉ đặt ở biến môi trường máy chủ (Vercel/Cloud Run), không vào repo | `apps/web/.env.example`, `docs/DEPLOY.md` |
| Supabase key | **Chưa có**. File mẫu chỉ dùng khóa công khai (anon); tài liệu cấm đưa `service_role` vào app | `docs/DEPLOY.md` |
| GitHub Actions secrets | Workflow triển khai **không dùng secret nào** | `.github/workflows/pages.yml` |
| Kho mã | **Công khai** (`TKandCo/Gai`), theo quyết định của chủ dự án để dùng GitHub Pages miễn phí | GitHub API, 2026-11-13 |
| HTTPS | Có (GitHub Pages, chứng chỉ tự cấp); http tự chuyển sang https | Kiểm 2026-11-03 |
| Header bảo mật trên trang thật | **Không có.** Cấu hình header trong `next.config.ts` chỉ chạy khi có máy chủ; GitHub Pages bỏ qua | `curl -I https://gai.thuankhoi.com`, 2026-11-13 |
| RLS (Supabase) | Có trong file migration (`profiles`: mỗi người chỉ đọc/sửa hồ sơ của mình), nhưng **chưa áp dụng** vì chưa có project | `supabase/migrations/0001_profiles.sql` |
| Gai AI khi bật | Khóa chỉ ở máy chủ; giới hạn lượt theo IP; chặn câu hỏi tư vấn đầu tư trước khi gọi AI | `apps/web/app/api/coach/route.api.ts` (**chưa chạy thật lần nào**) |
| DNS | `gai.thuankhoi.com` CNAME → `tkandco.github.io`, quản lý tại Squarespace | `nslookup`, 2026-11-03 |

## (4) Sao lưu + phương án khi mất AI / dịch vụ ngoài

**Sao lưu**

| Dữ liệu | Nằm ở đâu | Sao lưu | Khôi phục thử |
|---|---|---|---|
| Mã nguồn | GitHub `TKandCo/Gai` + ổ `D:\GAMETHEORY APP` trên máy dự án | 2 bản. Bản thứ ba: **chưa kiểm** | Chưa thử clone lại từ đầu trên máy khác |
| Dữ liệu người dùng | `localStorage` trên trình duyệt từng điện thoại | Người dùng tự tải file JSON ở **Hồ sơ → Sao lưu dữ liệu** (`apps/web/lib/backup.ts`). Không tự động | **Chưa thử** khôi phục trên trình duyệt thật |
| Supabase | Không dùng | Không áp dụng | Không áp dụng |

Rủi ro: người dùng xóa dữ liệu trình duyệt hoặc đổi máy mà không sao lưu thì **mất tiến độ**. App chưa nhắc người dùng sao lưu định kỳ.

**Khi mất dịch vụ ngoài**

| Mất dịch vụ | Ảnh hưởng | Phương án |
|---|---|---|
| Claude / Anthropic | **Không ảnh hưởng hiện tại** (Gai AI chưa bật). Khi đã bật: Gai Coach tự chuyển về chế độ cơ bản | Có sẵn trong `CoachClient.tsx` |
| GitHub Pages | Trang không truy cập được; app **đã cài trên điện thoại vẫn chạy offline** với dữ liệu sẵn có | Build tĩnh `npm run build:static` đưa lên hosting tĩnh khác (Cloudflare Pages, Netlify, Firebase Hosting) |
| GitHub (kho mã) | Mất nơi lưu mã và quy trình tự triển khai | Còn bản trên ổ D:; nên có bản thứ ba (chưa kiểm) |
| Squarespace (DNS) | Tên miền không trỏ được | App đã cài trên điện thoại vẫn chạy offline. Địa chỉ mặc định `tkandco.github.io/Gai` **không dùng thay được ngay** vì app build cho đường dẫn gốc; phải build lại với `basePath` hoặc trỏ một tên miền khác (chưa kiểm) |
| Google Fonts | Chỉ cần lúc **build** (next/font tải font khi build) | Build sẽ lỗi nếu Google Fonts không truy cập được; chưa có font dự phòng tại chỗ |
| npm registry | Không build/cài lại được | `package-lock.json` ghim phiên bản; chưa có kho cache riêng |

## (5) Audit

- **Chưa có audit độc lập nào.** Toàn bộ mã và nội dung từ đầu đến nay (14 commit, 2026-11-03) do cùng một phiên Claude viết và tự kiểm.
- Những gì đã kiểm (tự kiểm, không độc lập):
  - 392 bài test tự động, chạy lại 2026-11-13: 392/392 đạt.
  - Trang tự kiểm tra Gai Coach: 29/29 đạt (2026-11-03).
  - Thử thủ công trên trình duyệt (khung điện thoại) các luồng chính: chào mừng, bài học, câu đố, giải đáp, Lab, Phân tích, Hỏi Gai.
- Đề xuất audit đầu tiên (Phòng Kiểm định & An toàn, phiên riêng):
  1. Bảo mật mã Gai AI (`route.api.ts`) trước khi bật.
  2. Nội dung cho trẻ em: đọc toàn bộ 6 tình huống "all" và các thẻ không phải "real" trong bài học.
  3. Đúng đắn của nội dung toán/xác suất (đáp án số do người viết tay, không do bộ giải tính).

## (6) Checklist theo phòng

Chi tiết: `docs/quan-tri/CHECKLIST.md`. Tóm tắt:

| Phòng | Đã làm | Đang làm | Sẽ làm | Chờ chủ dự án | Chưa kiểm |
|---|---|---|---|---|---|
| Tổng quản | 5 | 0 | 1 | 0 | 0 |
| Kỹ thuật | 7 | 0 | 3 | 2 | 0 |
| Nội dung & Sư phạm | 4 | 0 | 1 | 0 | 1 |
| Kiểm định & An toàn | 2 | 0 | 1 | 0 | 3 |

## (7) Lỗ hổng đã biết

| # | Lỗ hổng | Mức | Phạm vi ảnh hưởng thực tế | Nguồn |
|---|---|---|---|---|
| 1 | `postcss@8.4.31` nằm trong `next` (khai báo override `^8.5.32` ở `package.json` **không được áp dụng** cho bản lồng trong Next) | Cao | Chỉ dùng lúc build để xử lý CSS của chính dự án; không chạy trên trang thật | `npm audit`, `package-lock.json`, 2026-11-13 |
| 2 | `zod@3.25.76` (kéo theo bởi `@anthropic-ai/sdk`) | Cao | Chỉ dùng trong mã Gai AI phía máy chủ; bản tĩnh đang chạy không có phần này | Như trên |
| 3 | `next@15.5.28` (do phụ thuộc postcss ở trên) | Trung bình | Như #1 | Như trên |
| 4 | Trang thật không có header bảo mật (chống nhúng khung, chống đoán kiểu file…) | Thấp–Trung bình | Toàn bộ trang | `curl -I`, 2026-11-13 |
| 5 | Dữ liệu chỉ ở trình duyệt, không sao lưu tự động | Trung bình (mất dữ liệu) | Mọi người dùng | Thiết kế hiện tại |
| 6 | Giới hạn lượt Gai AI lưu trong bộ nhớ một máy chủ; trên nền tảng nhiều máy chủ (serverless) giới hạn này không chặt | Thấp (chưa bật) | Khi bật Gai AI | `route.api.ts` |
| 7 | Hồ sơ trẻ em có thể tự chuyển sang hồ sơ người lớn trong cùng máy (không có khóa phụ huynh) | Thấp | Gia đình dùng chung máy | `apps/web/app/profile/page.tsx` |
| 8 | Khôi phục từ file sao lưu chưa từng được thử thật | Trung bình | Khi cần khôi phục | Mục (4) |
| 9 | BACKLOG ghi "0 lỗ hổng" đã lỗi thời | Thấp | Tài liệu | `docs/BACKLOG.md` |
