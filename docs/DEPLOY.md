# Triển khai: GitHub → Vercel → thuankhoi.com

Sơ đồ:

```
Máy của bạn ──git push──▶ GitHub ──tự động──▶ Vercel ──▶ https://thuankhoi.com
                             │
                             └─ CI: kiểm tra kiểu, test, build
Supabase (tài khoản + dữ liệu) ◀── app gọi tới
```

Sau khi thiết lập một lần, mỗi thay đổi chỉ cần `git push`, Vercel tự build và cập nhật website trong vài phút.

---

## 1. GitHub (một lần)

1. Tạo kho **Private** trên GitHub, ví dụ `gai` (không tích tạo README).
2. Trong thư mục dự án:

```bash
git remote add origin https://github.com/<tên-github>/gai.git
```

```bash
git push -u origin main
```

Mỗi lần push, tab **Actions** trên GitHub sẽ chạy CI. Dấu ✓ xanh là code ổn.

## 2. Vercel (một lần)

1. Đăng nhập https://vercel.com bằng tài khoản GitHub.
2. **Add New → Project** → chọn kho `gai`.
3. **Root Directory**: `apps/web`. Framework tự nhận là Next.js. Vercel tự cài các gói ở thư mục gốc.
4. **Environment Variables** (để trống phần Supabase nếu chưa làm bước 4):
   - `NEXT_PUBLIC_SITE_URL` = `https://thuankhoi.com`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Deploy**. Bạn sẽ có địa chỉ tạm dạng `gai-xxx.vercel.app`.

## 3. Tên miền thuankhoi.com (một lần)

1. Vercel → Project → **Settings → Domains** → thêm `thuankhoi.com` và `www.thuankhoi.com`.
2. Vercel hiển thị các bản ghi DNS cần tạo. Vào trang quản lý tên miền (nơi bạn mua thuankhoi.com) và tạo **đúng giá trị Vercel hiển thị**. Thường là:

| Loại | Tên | Giá trị |
|------|-----|---------|
| A | `@` | IP do Vercel cung cấp (thường `76.76.21.21`) |
| CNAME | `www` | giá trị do Vercel cung cấp (thường `cname.vercel-dns.com`) |

3. Chờ DNS cập nhật (vài phút đến vài giờ). Vercel tự cấp chứng chỉ HTTPS.
4. Nên đặt `thuankhoi.com` làm tên miền chính, `www` tự chuyển hướng về.

> Gợi ý: nếu sau này muốn tách, có thể dùng `app.thuankhoi.com` cho ứng dụng và `thuankhoi.com` cho trang giới thiệu.

## 4. Gai AI – bật Claude cho Gai Coach (tùy chọn)

Không có bước này, Gai Coach vẫn chạy ở **chế độ cơ bản** (thư viện tình huống, ngay trên máy).

1. Tạo API key tại https://platform.claude.com (mục API Keys), nạp tiền theo mức dùng.
2. Vercel → Project → **Settings → Environment Variables**, thêm:
   - `ANTHROPIC_API_KEY` = khóa vừa tạo (**chỉ** đặt ở đây, không đưa vào code hay GitHub)
   - (tùy chọn) `COACH_LIMIT_PER_HOUR` = số lượt hỏi tối đa mỗi giờ cho mỗi người, mặc định 30
   - (tùy chọn) `COACH_MODEL` = mô hình Claude, mặc định `claude-opus-5-5`
3. **Redeploy**. Mở **Hồ sơ → Tự kiểm tra Gai Coach → Thử Gai AI** để kiểm tra 3 câu hỏi mẫu.

Thử trên máy: thêm `ANTHROPIC_API_KEY=...` vào `apps/web/.env.local` rồi chạy lại `npm run dev`.

## 5. Supabase – tài khoản và đồng bộ (KHÔNG bắt buộc)

App chạy đầy đủ khi không có Supabase: dữ liệu lưu ngay trên điện thoại, chuyển máy bằng **Hồ sơ → Sao lưu dữ liệu**.
Chỉ cần Supabase khi muốn: đăng nhập, tự đồng bộ giữa nhiều máy, hoặc bán gói trả phí cho nhiều người.

1. Tạo project tại https://supabase.com (chọn vùng Singapore cho gần Việt Nam).
2. **SQL Editor** → dán nội dung `supabase/migrations/0001_profiles.sql` → **Run**.
3. **Project Settings → API**: sao chép `Project URL` và `anon public key`.
   - Trên máy: tạo `apps/web/.env.local` theo mẫu `apps/web/.env.example` rồi dán vào.
   - Trên Vercel: dán vào Environment Variables rồi **Redeploy**.
4. **Authentication → URL Configuration**:
   - Site URL: `https://thuankhoi.com`
   - Redirect URLs: `https://thuankhoi.com/auth/callback`, `http://localhost:3000/auth/callback`
5. **Authentication → Email Templates → Magic Link**: thêm dòng `Mã đăng nhập: {{ .Token }}` vào nội dung email. Mã 6 số này giúp đăng nhập ngay trong app đã cài trên điện thoại.

> Không bao giờ đưa `service_role key` vào app hay lên GitHub. File `.env.local` đã được loại khỏi git.

## 6. Cài app lên điện thoại

- **iPhone (Safari)**: mở https://thuankhoi.com → nút Chia sẻ → **Thêm vào MH chính**.
- **Android (Chrome)**: mở trang → menu ⋮ → **Cài đặt ứng dụng** / **Thêm vào màn hình chính**.

## 7. Quy trình làm việc hằng ngày

```bash
npm run check
```

```bash
git add -A
```

```bash
git commit -m "Mô tả thay đổi"
```

```bash
git push
```

Muốn thử tính năng mà chưa đưa lên website chính: tạo nhánh mới, push nhánh đó, Vercel tạo bản xem trước riêng (preview) để thử trên điện thoại.
