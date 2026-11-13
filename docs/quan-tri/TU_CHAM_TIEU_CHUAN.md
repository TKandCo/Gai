# Tự chấm theo Tiêu chuẩn code chung v1.0 — GAI (hạng B)

> Người chấm: Tổng quản (phiên chính, **cũng là bên viết mã**). **CP đã kiểm lại 2026-11-13: chấp nhận, điều chỉnh KT-04** (biên bản: `D:CLAUDE PROJECTSuditgai-tu-cham-2026-11-13.md`, ngoài repo).
> Ngày: 2026-11-13. Chủ dự án duyệt áp dụng tiêu chuẩn: 2026-11-13, trong phiên GAI.
> Bản tiêu chuẩn: `docs/quan-tri/TIEU_CHUAN_CODE.md` (chép nguyên bản, SHA-256 `c1291757…2511f2`).
> Trạng thái mã lúc chấm: commit `8ddce79`, trang thật https://gai.thuankhoi.com (GitHub Pages, website tĩnh).
> Phạm vi: mọi quy tắc **BẮT BUỘC** có hạng chứa B hoặc "Mọi" → **48 quy tắc**. QT-03, QT-06, AI-04 chỉ là NÊN với hạng B, ghi riêng ở cuối.
> Ký hiệu: **Đạt** · **Chưa** · **Một phần** (tính là Chưa) · **KAD** = không áp dụng · **chưa kiểm**.

## Tổng hợp

| Kết quả | Số quy tắc |
|---|---|
| Đạt | 12 |
| Chưa / Một phần | 25 (11 Chưa + 14 Một phần) |
| Không áp dụng | 10 |
| Chưa kiểm | 1 |
| **Tổng** | **48** |

Tình trạng chung: **chưa đạt** tiêu chuẩn hạng B. Phần lớn điểm chưa đạt thuộc quy trình (PR, CI quét lỗ hổng, giám sát), không phải lỗi trong mã đang chạy.

## Chi tiết

### QT — Quy trình và kho mã

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| QT-01 | **Đạt** | Toàn bộ mã và tài liệu trong git, có bản trên GitHub `TKandCo/Gai` (công khai theo quyết định chủ dự án để dùng GitHub Pages). |
| QT-02 | **Chưa** | GitHub API `branches/main`: `protected: false`. Mọi thay đổi đến nay đẩy thẳng lên `main` (0 pull request). |
| QT-04 | **Chưa** | Chưa có PR nào (GitHub API: 0 PR). Commit có ghi nội dung nhưng không ghi "đã kiểm / chưa kiểm". |
| QT-05 | **Một phần** | `pages.yml` chạy `npm run typecheck` + `npm test` trước khi triển khai: test hỏng thì không lên mạng. Nhưng không có cổng "CI xanh mới merge" vì không dùng PR. Lịch sử commit không có `--no-verify`/`skip ci` (`git log`, 0 kết quả). |

### BM — Bí mật và khóa

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| BM-01 | **Một phần** | `git grep` các mẫu khóa phổ biến (2026-11-13): không thấy. Repo chỉ có `apps/web/.env.example` (để trống). **Chưa chạy gitleaks** (chưa cài; cài công cụ mới cần chủ dự án duyệt theo AI-06), CI chưa quét bí mật. |
| BM-02 | **Chưa** | `.gitignore` chặn `.env`, `.env.local`, `.env.*.local`; **chưa chặn** dạng `.env.production`, `.env.development` (quy tắc yêu cầu `.env*`), chưa chặn file sao lưu `gai-sao-luu-*.json`. Dự án không có CSDL/thư mục dữ liệu. |
| BM-04 | **Chưa** | Chưa có quy trình "lộ khóa thì thu hồi" viết thành văn bản. Hiện chưa có khóa thật nào (không có API key, không có Supabase key). |
| BM-06 | **chưa kiểm** | Cần chủ dự án tự xác nhận 2FA cho GitHub `TKandCo`, Squarespace (tên miền), tài khoản Google, tài khoản Anthropic (khi có). |

### DV — Dữ liệu vào và ra

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| DV-01 | **Một phần** | Có kiểm: API Gai AI (`route.api.ts` → `parseBody`: số tin ≤ 20, mỗi tin ≤ 1500 ký tự, đúng vai trò), công cụ AI (`coach/src/tools.ts` → `validMatrix`), dữ liệu trò chơi (Zod, `packages/schema`), khôi phục sao lưu (`lib/backup.ts`: kiểm `app`, `version`, từng giá trị JSON). Ô nhập có `maxLength`. **Thiếu**: giới hạn kích thước file khôi phục; chưa kiểm schema chi tiết từng mục khi khôi phục. |
| DV-02 | **KAD** | Không có CSDL, không có câu SQL. |
| DV-03 | **Đạt** | Chỉ 2 chỗ `dangerouslySetInnerHTML` (`app/layout.tsx` dòng 46–47), nội dung là hằng số trong mã (không có dữ liệu người dùng). Văn bản hiển thị qua React (tự mã hóa); `RichText` không dùng HTML. |
| DV-04 | **Đạt** | Không có `eval`/`new Function`. `scripts/build-static.mjs` gọi `npx next build` với `shell: true` nhưng tham số là hằng số, không có dữ liệu ngoài; chỉ chạy lúc build. |
| DV-05 | **Một phần** | Không nhận đường dẫn tệp từ người dùng. Có tải tệp lên (khôi phục sao lưu): chỉ nhận `.json` và kiểm nội dung, **chưa giới hạn kích thước**. |
| DV-06 | **KAD** | Máy chủ (khi bật Gai AI) chỉ gọi Anthropic, không gọi URL do người dùng đưa. |

### XQ — Xác thực và phân quyền

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| XQ-01 | **Đạt** | Không tự viết mã hóa/phiên; đăng nhập (khi bật) dùng thư viện Supabase (`@supabase/ssr`). |
| XQ-02 | **KAD** | Không có máy chủ lưu dữ liệu người dùng; mỗi người chỉ có dữ liệu trên máy mình. |
| XQ-03 | **KAD** | Chưa dùng Supabase (không nối project nào). Ghi chú: migration `0001_profiles.sql` đã bật RLS nhưng **chưa có test** chứng minh; phải bổ sung trước khi bật. |
| XQ-04 | **KAD** | Không có mật khẩu (đăng nhập dự kiến bằng mã email của Supabase) và đăng nhập chưa bật. |
| XQ-05 | **KAD** | Không có cookie phiên trên trang thật (website tĩnh, đăng nhập tắt). |

### FE — Frontend

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| FE-01 | **Chưa** | `curl -I https://gai.thuankhoi.com` (2026-11-13): không có Content-Security-Policy hay header bảo mật nào. Header trong `next.config.ts` chỉ chạy khi có máy chủ. Chưa có thẻ `<meta>` CSP. |
| FE-02 | **Đạt** | `apps/web/out/*.html` không tải script/stylesheet từ CDN ngoài; font Be Vietnam Pro được `next/font` tải về và nhúng sẵn lúc build. |
| FE-04 | **Đạt** | Không có dữ liệu nào trình duyệt gửi lên máy chủ để tin dùng (bản tĩnh). Khi bật Gai AI, máy chủ kiểm lại đầu vào (`parseBody`) và tự chặn câu hỏi tư vấn đầu tư (`isInvestmentAdviceRequest`) chứ không dựa vào trình duyệt. |
| FE-05 | **Một phần** | Có nút xuất và nhập sao lưu (Hồ sơ → Sao lưu dữ liệu; `lib/backup.ts`). **Thiếu lời báo** rõ "xóa dữ liệu trình duyệt là mất dữ liệu" (không tìm thấy câu này trong `apps/web`). |

### BE — Backend và API (chỉ có khi bật Gai AI; bản đang chạy không có backend)

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| BE-01 | **Một phần** | Gọi Anthropic qua SDK: SDK có timeout và thử lại có giãn cách mặc định (theo tài liệu SDK; chưa đặt rõ trong mã). Lời gọi `fetch("/api/coach")` từ trình duyệt **không có timeout**. |
| BE-02 | **Một phần** | Có giới hạn 30 lượt/giờ/IP (`COACH_LIMIT_PER_HOUR`), nhưng lưu trong bộ nhớ một tiến trình: không chặt khi chạy nhiều máy chủ. Chưa chạy thật. |
| BE-03 | **Đạt** | `route.api.ts` trả thông báo lỗi chung bằng tiếng Việt, không trả stack trace hay chi tiết lỗi. |
| BE-04 | **Đạt** | `route.api.ts` không ghi log (0 lệnh `console.`). |
| BE-06 | **Một phần** | HTTPS bắt buộc (http → https 301, chứng chỉ GitHub Pages). **Chưa theo dõi** hạn chứng chỉ (GitHub tự gia hạn nhưng chưa có giám sát). |

### PT — Thư viện và chuỗi cung ứng

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| PT-01 | **Đạt** | Có `package-lock.json`; cả `ci.yml` và `pages.yml` dùng `npm ci`. |
| PT-02 | **Chưa** | CI chưa quét lỗ hổng, chưa có lịch quét hằng tuần. `npm audit` 2026-11-13: **3 lỗ hổng** (postcss trong next: Cao; zod 3.25.76 qua `@anthropic-ai/sdk`: Cao; next: Trung bình). Chủ dự án duyệt **tạm giữ** cho Trạm quét thử → xem `NGOAI_LE.md`. |
| PT-03 | **Một phần** | Chỉ dùng action chính chủ GitHub (`actions/checkout@v4`, `setup-node@v4`, `upload-pages-artifact@v3`, `deploy-pages@v4`), ghim phiên bản chính (đủ cho hạng B). `pages.yml` có `permissions` tối thiểu; **`ci.yml` không khai báo `permissions`** (dùng mặc định). Không dùng `pull_request_target`. Chưa chạy zizmor/actionlint. |
| PT-05 | **Đạt** (tự kiểm) | Thư viện đều là gói phổ biến, đúng tên: `next`, `react`, `zod`, `vitest`, `tailwindcss`, `sharp`, `@supabase/*`, `@anthropic-ai/sdk`. Chưa có kiểm độc lập. |

### KT — Kiểm thử

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| KT-01 | **Chưa** | Có test chống tái phát cho một số lỗi (ví dụ câu trả lời dài có chữ "đáp án": `coach/src/selftest.ts`; chuỗi ngày học), nhưng **không đủ**: ví dụ lỗi tải file JS cũ (`55574ab`), lỗi cuộn trang Coach, lời báo "Gần đúng rồi" chưa có test. |
| KT-04 | **Một phần** | Có 1 lần sửa kỳ vọng test (`gt-core/src/sensitivity.test.ts`) vì kỳ vọng ban đầu sai, mã đúng. Lý do chỉ được giải thích trong phiên làm việc, **không có PR** nên không truy lại được (CP điều chỉnh từ Đạt, 2026-11-13). Tự đạt khi làm qua PR (QT-02). |

### CS — Cơ sở dữ liệu

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| CS-01 | **KAD** | Chưa có CSDL chạy. Migration sẵn có đã đánh số (`0001_profiles.sql`). |
| CS-02 | **KAD** | Không có CSDL. Ghi chú: thao tác "Khôi phục" ghi đè dữ liệu trên máy có hỏi xác nhận nhưng không tự sao lưu bản cũ trước. |

### DL — Dữ liệu cá nhân

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| DL-02 | **KAD (hiện tại)** | App **không thu** dữ liệu trẻ em về máy chủ: tên hiển thị, hình đại diện, nhóm tuổi chỉ lưu trên máy (`lib/profiles.tsx`, `localStorage`). Không có tài khoản trẻ em, không email. **Áp dụng ngay khi** bật đồng bộ (Supabase) hoặc gửi câu chat của trẻ lên Gai AI: phải có bước phụ huynh đồng ý và mặc định chặt nhất. |

### VH — Vận hành và giám sát

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| VH-01 | **Chưa** | Chưa có kiểm "còn sống" tự động cho gai.thuankhoi.com, chưa báo Telegram. |
| VH-03 | **Chưa** | Chưa theo dõi phút CI, hạn tên miền (Squarespace), hạn chứng chỉ. |

### SL — Sao lưu và khôi phục

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| SL-01 | **Một phần** | Mã nguồn: 2 bản ở 2 nơi (GitHub + ổ D: máy dự án) → đạt mức tối thiểu hạng B. Dữ liệu người dùng: chỉ trên trình duyệt, sao lưu do người dùng tự tải file; app không có bản thứ hai. |
| SL-03 | **Chưa** | **Chưa từng khôi phục thử** (cả clone lại mã trên máy sạch lẫn nhập file sao lưu trên trình duyệt thật). Theo quy tắc: coi như chưa có sao lưu. |
| SL-05 | **KAD** | Bản sao lưu không mã hóa nên không có khóa giải mã. |

### AI — Riêng cho AI (Gai AI có mã nhưng chưa chạy)

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| AI-01 | **Một phần** | Lời dặn hệ thống (`coachSystemPrompt`) tách khỏi tin nhắn người dùng; kết quả công cụ trả về dạng `tool_result`. **Chưa có test chống câu lệnh dụ.** |
| AI-03 | **Chưa** | Trong mã có giới hạn (30 lượt/giờ/IP, `max_tokens` 16000, tối đa 5 vòng công cụ) nhưng **chưa có trần chi phí trong tài khoản Anthropic** (chưa có tài khoản/khóa) và chưa có cảnh báo gần trần. |
| AI-06 | **Một phần** | Không tự merge (không có PR; mọi lần đẩy lên `main` đều theo lời chủ dự án trong phiên). Đã từ chối sửa `CLAUDE.md` theo yêu cầu phiên khác (tạo `CLAUDE.md` sau khi chủ dự án duyệt trực tiếp 2026-11-13). **Đã cài nhiều gói** (Next.js, Supabase, Anthropic SDK…) trong quá trình xây dựng theo yêu cầu chung "xây app", **chưa có duyệt riêng từng gói**. |
| AI-07 | **Một phần** | Mã AI viết qua cổng `typecheck` + 392 test trong CI. Chưa có lint, quét bí mật, quét thư viện trong CI. |

### TL — Tài liệu và tiếp quản

| Mã | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| TL-01 | **Đạt** | `CLAUDE.md` nêu: app là gì, chạy ở đâu, lệnh hay dùng, quy tắc bắt buộc (mục Tổ chức dự án). |
| TL-03 | **Đạt** | `docs/quan-tri/BAO_CAO_GUI_CP.md` đủ 7 mục, cập nhật 2026-11-13. Cần duy trì hằng tuần/sau mỗi đợt. |

## Quy tắc mức NÊN với hạng B (ghi để đủ)

| Mã | Kết quả | Ghi chú |
|---|---|---|
| QT-03 | Chưa | Chưa có audit độc lập (xem báo cáo CP mục 5). |
| QT-06 | Chưa | Chưa có số phiên bản phát hành và CHANGELOG (gói đều để `0.1.0`). |
| AI-04 | Đạt | Mất AI thì Gai Coach chạy chế độ cơ bản (`CoachClient.tsx` tự chuyển; trang đang chạy vốn không dùng AI). Ghi trong `docs/DEPLOY.md`. |

## Việc cần làm để đạt (đề xuất, chờ chủ dự án duyệt, chưa làm)

| Ưu tiên | Quy tắc | Việc |
|---|---|---|
| 1 | FE-01 | Thêm thẻ `<meta>` CSP vào trang; ghi rõ phần không làm được trên GitHub Pages (chống nhúng khung, HSTS). |
| 1 | PT-02 | Sau khi Trạm quét xong đợt GĐ0: vá 3 lỗ hổng; thêm `npm audit` vào CI và lịch quét hằng tuần. |
| 1 | BM-02, PT-03 | Sửa `.gitignore` chặn `.env*` và file sao lưu; thêm `permissions: contents: read` cho `ci.yml`. |
| 2 | QT-02, QT-04, QT-05 | Bật bảo vệ nhánh `main`, làm việc qua PR có ghi "đã kiểm / chưa kiểm". Chủ dự án bật trong cài đặt GitHub. |
| 2 | FE-05, DV-01, DV-05 | Thêm lời báo mất dữ liệu; giới hạn kích thước file khôi phục. |
| 2 | SL-03 | Khôi phục thử: clone repo trên máy sạch + nhập file sao lưu trên trình duyệt thật; ghi sổ. |
| 3 | BM-01, AI-07 | Quét bí mật (gitleaks) trong CI — cần chủ dự án duyệt cài công cụ. |
| 3 | VH-01, VH-03, BE-06 | Kiểm "còn sống" + theo dõi hạn mức (có thể giao Trạm). |
| 3 | KT-01 | Bổ sung test chống tái phát cho các lỗi đã sửa. |
| Trước khi bật AI | AI-01, AI-03, BE-01, BE-02 | Test chống câu lệnh dụ; trần chi phí trong tài khoản Anthropic; timeout phía trình duyệt; giới hạn lượt dùng bền vững. |
| Trước khi bật đồng bộ | DL-02, XQ-03 | Bước phụ huynh đồng ý; test RLS. |
