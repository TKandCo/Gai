/**
 * Thư viện tình huống: mỗi tình huống có các câu hỏi gợi mở (hỏi lần lượt),
 * và phần giải đáp CHỈ mở sau khi người dùng trả lời hết.
 */
export type Situation = {
  id: string;
  title: string;
  emoji: string;
  /** all = ai cũng dùng được (kể cả trẻ em); adult = chỉ hiện với hồ sơ từ 15 tuổi */
  audience: "all" | "adult";
  group: "nha-truong" | "tien-mua-sam" | "cong-viec" | "tin-tuc";
  /** Cụm từ (không cần dấu) để nhận ra tình huống từ câu người dùng gõ */
  keywords: string[];
  summary: string;
  steps: { ask: string; hint: string }[];
  /** Giải đáp: cách nghĩ để chọn quyết định tốt hơn. Hỗ trợ **in đậm** và xuống dòng. */
  answer: string;
  pitfalls: string[];
  /** Mã bài học liên quan trong lộ trình */
  lessons: string[];
};

export const GROUPS: Record<Situation["group"], string> = {
  "nha-truong": "Ở nhà và ở trường",
  "tien-mua-sam": "Tiền và mua sắm",
  "cong-viec": "Công việc và kinh doanh",
  "tin-tuc": "Tin tức và thị trường",
};

export const SITUATIONS: Situation[] = [
  {
    id: "chia-do-choi",
    title: "Hai anh em tranh nhau đồ chơi",
    emoji: "🧸",
    audience: "all",
    group: "nha-truong",
    keywords: ["tranh do choi", "tranh nhau", "gianh do choi", "chia do choi", "anh em tranh", "chi em tranh", "cai nhau vi do choi"],
    summary: "Ai cũng muốn chơi trước, cãi nhau mãi không xong.",
    steps: [
      { ask: "Ai là người chơi, và mỗi người thật sự muốn gì?", hint: "Có thể một người muốn chơi ngay, người kia muốn chơi lâu." },
      { ask: "Có những cách giải quyết nào? Kể ít nhất 2 cách.", hint: "Thay phiên, chia đôi thời gian, một người chia người kia chọn…" },
      { ask: "Nếu cứ cãi nhau mãi, cuối cùng mỗi người được gì?", hint: "Nghĩ xem bố mẹ có cất đồ chơi đi không." },
    ],
    answer:
      "Cãi nhau mãi giống **trò Chia kẹo**: ai cũng giành, cuối cùng cả hai đều thiệt (có khi bị cất luôn đồ chơi).\nCách hay nhất là **đặt luật mà ai cũng thấy công bằng**: **một người chia thời gian, người kia chọn lượt trước**, hoặc **thay phiên theo đồng hồ** (mỗi người 15 phút).\nVì hai anh em gặp nhau mỗi ngày, **nhường hôm nay** sẽ được đáp lại **ngày mai**.",
    pitfalls: ["Giành bằng sức: thắng hôm nay nhưng mất lòng tin ngày mai", "Luật do một người tự đặt có lợi cho mình: người kia sẽ không theo"],
    lessons: ["5-thiet-ke-luat", "1-chien-luoc-troi", "3-gap-lai"],
  },
  {
    id: "ban-doa",
    title: "Bạn dọa nghỉ chơi nếu không làm theo",
    emoji: "🗯️",
    audience: "all",
    group: "nha-truong",
    keywords: ["doa nghi choi", "nghi choi", "doa", "bat minh phai", "ep minh", "khong lam theo"],
    summary: "\"Không cho mượn thì tớ nghỉ chơi với cậu!\"",
    steps: [
      { ask: "Nếu bạn không làm theo, bạn ấy có thật sự muốn nghỉ chơi không? Bạn ấy mất gì?", hint: "Bạn ấy cũng mất một người bạn chơi cùng." },
      { ask: "Nếu bạn nghe theo lần này, lần sau bạn ấy sẽ làm gì?", hint: "Một cách đã hiệu quả thì người ta hay dùng lại." },
      { ask: "Có cách nào vừa giữ tình bạn, vừa không bị ép không?", hint: "Đề nghị một cách công bằng cho cả hai." },
    ],
    answer:
      "Lời dọa \"nghỉ chơi\" thường **không đáng tin**: nếu nghỉ chơi thật, chính bạn ấy cũng mất bạn.\nNếu lần nào cũng nhượng bộ, bạn ấy học được rằng **dọa là có hiệu quả**, và sẽ dọa nhiều hơn.\nHãy **bình tĩnh nói rõ** điều mình muốn và đề nghị một cách **công bằng** (ví dụ cho mượn sau khi mình dùng xong).\n⚠️ Nếu bị bắt nạt, đe dọa đáng sợ hoặc lặp đi lặp lại, hãy **kể ngay với bố mẹ hoặc thầy cô**.",
    pitfalls: ["Nhượng bộ mọi lời dọa: tạo thói quen bị ép", "Dọa ngược lại cho hả giận: dễ leo thang"],
    lessons: ["2-loi-doa", "3-uy-tin"],
  },
  {
    id: "lam-bai-nhom",
    title: "Làm bài nhóm có bạn không chịu làm",
    emoji: "👥",
    audience: "all",
    group: "nha-truong",
    keywords: ["bai nhom", "lam nhom", "nhom co ban", "ban luoi", "khong chiu lam", "du an nhom", "team luoi", "dong nghiep luoi"],
    summary: "Cả nhóm cùng điểm, nhưng có người để người khác làm hết.",
    steps: [
      { ask: "Vì sao bạn ấy không làm? Bạn ấy được gì, mất gì?", hint: "Nếu điểm chung cho cả nhóm, không làm vẫn được điểm." },
      { ask: "Nếu bạn làm hết phần của bạn ấy, lần sau sẽ thế nào?", hint: "Nghĩ về trò chơi lặp lại." },
      { ask: "Luật nào khiến ai cũng có lợi khi làm phần mình?", hint: "Phần việc có tên từng người, báo cáo tiến độ…" },
    ],
    answer:
      "Đây là chuyện **\"ăn theo\"**: khi điểm là của chung, người lười vẫn được hưởng nên không có động lực làm.\nĐừng âm thầm làm hộ, vì lần sau họ sẽ lại để bạn làm.\nHãy **thiết kế luật**: chia việc rõ ràng, **ghi tên ai làm phần nào**, hẹn **mốc kiểm tra** giữa chừng, và đề nghị thầy cô **chấm thêm theo phần của từng người**.",
    pitfalls: ["Làm hộ trong im lặng", "Chỉ trách móc mà không đổi cách chia việc"],
    lessons: ["5-thiet-ke-luat", "1-chien-luoc-troi", "3-gap-lai"],
  },
  {
    id: "ban-be-deu-mua",
    title: "Bạn bè đều mua món đồ đang hot",
    emoji: "🛍️",
    audience: "all",
    group: "tien-mua-sam",
    keywords: ["dang hot", "ai cung mua", "ban be deu mua", "mua theo", "trend", "ai cung co"],
    summary: "Cả lớp đều có, mình có nên mua không?",
    steps: [
      { ask: "Mình thích nó thật, hay vì mọi người đều có?", hint: "Thử tưởng tượng không ai có: mình còn muốn không?" },
      { ask: "Nếu mua, mình phải bỏ lỡ thứ gì khác với số tiền đó?", hint: "Đó là chi phí cơ hội." },
      { ask: "Một tháng nữa, món đó còn hot không?", hint: "Nghĩ tới những món \"hot\" năm ngoái." },
    ],
    answer:
      "Khi ai cũng mua, ta dễ bị **cuốn theo đám đông** dù không thật sự cần.\nHãy so với **thứ tốt nhất mình phải bỏ lỡ** (chi phí cơ hội).\nMẹo: **đợi 7 ngày**. Nếu sau 7 ngày vẫn muốn và vẫn hợp với kế hoạch tiền của mình, khi đó hãy mua.",
    pitfalls: ["Mua vì sợ bị bỏ lại", "Quên mất món mình đang để dành"],
    lessons: ["6-bay-dan", "0-chi-phi-co-hoi"],
  },
  {
    id: "doi-the",
    title: "Đổi thẻ bài, đồ chơi với bạn",
    emoji: "🃏",
    audience: "all",
    group: "tien-mua-sam",
    keywords: ["doi the", "trao doi", "doi do", "the bai", "doi do choi", "doi voi ban"],
    summary: "Bạn rủ đổi thẻ, có nên đổi không?",
    steps: [
      { ask: "Thẻ đó đáng bao nhiêu với mình, và với bạn kia?", hint: "Mỗi người có thể quý một thứ khác nhau." },
      { ask: "Bạn kia có biết điều gì mà mình không biết không?", hint: "Thẻ hiếm, thẻ sắp hết hot, thẻ bị lỗi…" },
      { ask: "Nếu bạn ấy rất muốn đổi, vì sao lại vậy?", hint: "Sự nhiệt tình là một manh mối." },
    ],
    answer:
      "Một cuộc đổi tốt là khi **cả hai đều thấy mình được lợi** vì mỗi người quý một thứ khác nhau.\nNhưng hãy cẩn thận khi **bên kia biết nhiều hơn** mình: nếu bạn ấy quá muốn đổi, có thể thẻ của mình giá trị hơn mình nghĩ.\nHãy **tìm hiểu trước**, và đổi với người **có uy tín** (đã từng đổi sòng phẳng).",
    pitfalls: ["Đổi vội vì được nài nỉ", "Không kiểm tra thẻ trước khi đổi"],
    lessons: ["4-ai-biet-gi", "4-doan-y", "3-uy-tin"],
  },
  {
    id: "on-bai-hay-choi",
    title: "Ôn bài hay đi chơi trước?",
    emoji: "📚",
    audience: "all",
    group: "nha-truong",
    keywords: ["on bai", "hoc bai", "di choi", "kiem tra", "sap thi", "lam bai tap"],
    summary: "Mai kiểm tra, nhưng bạn rủ đi chơi.",
    steps: [
      { ask: "Có ai đang tính toán chống lại mình không, hay chỉ có mình và may rủi?", hint: "Nếu chỉ có mình, đó là quyết định, không phải trò chơi." },
      { ask: "Mỗi lựa chọn dẫn tới đâu, khả năng bao nhiêu?", hint: "Ví dụ: ôn bài thì 80% được điểm tốt." },
      { ask: "Kết quả xấu nhất của mỗi lựa chọn là gì, có chịu được không?", hint: "Bỏ lỡ một buổi chơi và điểm kém, cái nào nặng hơn?" },
    ],
    answer:
      "Đây là **quyết định một mình**, không phải trò chơi, nên hãy dùng **cây quyết định**: liệt kê lựa chọn, đoán khả năng, xem kết quả xấu nhất.\nThường có **lựa chọn thứ ba**: ôn trước 1 tiếng rồi đi chơi.\nNếu hay bị cám dỗ, hãy **tự cam kết**: hẹn bạn sau giờ ôn bài, giống như bỏ tiền vào heo đất.",
    pitfalls: ["Chỉ thấy 2 lựa chọn", "Quá tự tin \"mai ôn cũng kịp\""],
    lessons: ["0-cay-quyet-dinh", "2-cam-ket", "0-thien-kien"],
  },
  {
    id: "doi-thu-giam-gia",
    title: "Đối thủ giảm giá mạnh",
    emoji: "🏷️",
    audience: "adult",
    group: "cong-viec",
    keywords: ["doi thu giam gia", "giam gia", "chien tranh gia", "ha gia", "khuyen mai manh", "canh tranh gia", "pha gia"],
    summary: "Đối thủ cạnh tranh hạ giá, có nên giảm theo?",
    steps: [
      { ask: "Đối thủ giảm giá để làm gì, và họ chịu lỗ được bao lâu?", hint: "Xả hàng, giành thị phần, hay muốn đẩy bạn ra khỏi thị trường?" },
      { ask: "Nếu bạn giảm theo, cả hai sẽ ra sao sau vài tháng?", hint: "Nghĩ tới song đề tù nhân." },
      { ask: "Bạn có lợi thế nào khác ngoài giá?", hint: "Chất lượng, dịch vụ, vị trí, khách quen, chi phí thấp hơn…" },
    ],
    answer:
      "Đua giá thường là **song đề tù nhân**: cả hai cùng giảm thì cả hai cùng mất lợi nhuận.\nNếu **không có lợi thế chi phí**, đừng lao vào đua giá. Hãy **khác biệt hóa** (dịch vụ, chất lượng, chăm sóc khách quen).\nNếu phải phản ứng, hãy **có giới hạn và rõ ràng** (như Ăn miếng trả miếng: đáp trả có mục tiêu, sẵn sàng quay lại khi đối thủ dừng).\nMột **cam kết công khai** như \"hoàn tiền chênh lệch\" có thể khiến đối thủ thấy giảm giá vô ích.\n*Lưu ý: thỏa thuận ngầm giữ giá với đối thủ có thể vi phạm luật cạnh tranh.*",
    pitfalls: ["Giảm theo theo phản xạ", "Đánh giá thấp khả năng chịu lỗ của đối thủ", "Quên đếm khách sẽ quay lại khi hết khuyến mãi"],
    lessons: ["1-chien-luoc-troi", "3-an-mieng", "2-cam-ket"],
  },
  {
    id: "dam-phan-luong",
    title: "Đàm phán tăng lương",
    emoji: "💼",
    audience: "adult",
    group: "cong-viec",
    keywords: ["tang luong", "dam phan luong", "deal luong", "xin tang luong", "offer", "thuong luong luong"],
    summary: "Muốn tăng lương nhưng sợ mất lòng.",
    steps: [
      { ask: "Nếu không đạt thỏa thuận, phương án tốt nhất của bạn là gì? Còn của công ty?", hint: "Offer chỗ khác, ở lại với lương cũ… Công ty: tuyển người mới mất bao lâu?" },
      { ask: "Bạn có bằng chứng nào cho thấy giá trị của mình (không chỉ lời nói)?", hint: "Kết quả cụ thể, con số, offer từ nơi khác." },
      { ask: "Ai nên đưa ra con số trước, và con số đó nên dựa vào đâu?", hint: "Nghĩ về hiệu ứng mỏ neo." },
    ],
    answer:
      "Sức mạnh đàm phán đến từ **phương án thay thế tốt nhất** của mỗi bên: ai có lựa chọn tốt hơn bên ngoài, người đó mạnh hơn.\nHãy dùng **tín hiệu đáng tin** (kết quả cụ thể, con số) thay vì lời nói.\nĐưa con số trước **có cơ sở** (mức thị trường) sẽ tạo **mỏ neo** có lợi.\nĐây là quan hệ **lặp lại**: giữ thái độ hợp tác, đề nghị cả gói (lương + trách nhiệm + lộ trình).\n⚠️ Chỉ dọa nghỉ khi bạn **thật sự sẵn sàng** nghỉ, nếu không đó là lời dọa suông.",
    pitfalls: ["Dọa nghỉ khi không có phương án thay thế", "Chỉ nói \"tôi làm chăm\" mà không có số liệu"],
    lessons: ["2-loi-doa", "4-tin-hieu", "0-thien-kien"],
  },
  {
    id: "chu-nha-tang-gia",
    title: "Chủ nhà hoặc nhà cung cấp tăng giá",
    emoji: "🏠",
    audience: "adult",
    group: "tien-mua-sam",
    keywords: ["chu nha", "tang gia thue", "tang tien thue", "gia han hop dong", "nha cung cap tang gia", "tang gia"],
    summary: "Gia hạn hợp đồng mà bị đòi tăng giá.",
    steps: [
      { ask: "Nếu bạn rời đi, bên kia mất gì?", hint: "Thời gian để trống, chi phí tìm người mới, rủi ro gặp khách tệ hơn." },
      { ask: "Nếu bạn chuyển đi, bạn tốn bao nhiêu?", hint: "Chi phí chuyển, thời gian, đặt cọc mới." },
      { ask: "Có thể đề nghị điều gì để cả hai cùng có lợi?", hint: "Ký dài hạn, thanh toán đúng hạn, tự sửa chữa nhỏ…" },
    ],
    answer:
      "So sánh **chi phí nếu chia tay** của hai bên: bên nào mất nhiều hơn khi chia tay thì yếu thế hơn.\nĐề nghị **cam kết dài hạn** hoặc **trả đúng hạn** để đổi lấy mức tăng thấp hơn: bạn cho họ sự ổn định, họ cho bạn giá tốt.\nTìm sẵn **phương án thay thế thật** trước khi nói chuyện, vì lời \"sẽ chuyển đi\" chỉ đáng tin khi bạn có chỗ khác.",
    pitfalls: ["Đồng ý ngay vì ngại", "Dọa chuyển đi khi chưa có chỗ khác"],
    lessons: ["2-cam-ket", "2-loi-doa", "3-uy-tin"],
  },
  {
    id: "doi-tac-tre-hen",
    title: "Đối tác chậm thanh toán",
    emoji: "⏰",
    audience: "adult",
    group: "cong-viec",
    keywords: ["cham thanh toan", "tre han", "cong no", "khong tra tien", "no tien", "doi no", "thanh toan cham"],
    summary: "Khách hàng hoặc đối tác trả tiền trễ.",
    steps: [
      { ask: "Đây là lần đầu hay đã lặp lại? Họ còn cần làm ăn lâu dài với bạn không?", hint: "Nghĩ về cái bóng của tương lai." },
      { ask: "Nếu bạn im lặng, lần sau họ sẽ làm gì?", hint: "Hành vi được dung túng thường lặp lại." },
      { ask: "Phản ứng nào rõ ràng nhưng vẫn để đường quay lại?", hint: "Nhắc nhở chính thức, tạm dừng giao hàng mới, điều khoản phạt…" },
    ],
    answer:
      "Hãy phản ứng như **Ăn miếng trả miếng biết tha thứ**: lần đầu có thể là hiểu lầm, nhắc nhở rõ ràng. Lặp lại thì có **hậu quả cụ thể** (tạm dừng đơn mới), và mở lại ngay khi họ sửa.\n**Thiết kế luật** từ trước: đặt cọc, chia đợt thanh toán, điều khoản phạt trễ hạn.\nCẩn thận khi **tương lai của đối tác ngắn lại** (sắp đóng cửa, bán công ty): động cơ giữ chữ tín của họ đang yếu.",
    pitfalls: ["Im lặng vì sợ mất khách", "Cắt đứt ngay từ lần trễ đầu tiên"],
    lessons: ["3-tha-thu", "3-tuong-lai", "5-thiet-ke-luat"],
  },
  {
    id: "mua-do-cu",
    title: "Mua xe cũ, đồ cũ",
    emoji: "🚗",
    audience: "adult",
    group: "tien-mua-sam",
    keywords: ["xe cu", "do cu", "mua lai", "second hand", "hang cu", "mua xe", "dien thoai cu"],
    summary: "Giá rẻ hấp dẫn, nhưng không biết chất lượng.",
    steps: [
      { ask: "Người bán biết điều gì mà bạn không biết?", hint: "Lỗi ẩn, tai nạn cũ, lịch sử sửa chữa." },
      { ask: "Có cách nào kiểm chứng chất lượng không?", hint: "Thợ kiểm tra độc lập, bảo hành, giấy tờ, chạy thử." },
      { ask: "Giá rẻ bất thường nói lên điều gì?", hint: "Vì sao người bán chấp nhận bán rẻ?" },
    ],
    answer:
      "Đây là **thị trường thông tin bị giấu**: người bán biết nhiều hơn bạn.\nHãy đòi **tín hiệu tốn kém**: bảo hành, cho thợ của bạn kiểm tra, giấy tờ đầy đủ. Người bán hàng tốt thường sẵn sàng.\n**Từ chối cho kiểm tra** hoặc **giá rẻ bất thường** là manh mối quan trọng.\nĐặt **giá trần** trước khi xem hàng để không bị cuốn theo.",
    pitfalls: ["Tin lời \"xe zin, chạy kỹ\"", "Bị mỏ neo bởi giá rao ban đầu"],
    lessons: ["4-ai-biet-gi", "4-tin-hieu", "4-doan-y"],
  },
  {
    id: "dau-thau",
    title: "Tham gia đấu thầu, đấu giá",
    emoji: "🔨",
    audience: "adult",
    group: "cong-viec",
    keywords: ["dau thau", "dau gia", "bo gia", "goi thau", "dat gia", "tra gia"],
    summary: "Nên bỏ giá bao nhiêu để thắng mà không lỗ?",
    steps: [
      { ask: "Món này (hoặc gói thầu) đáng bao nhiêu với bạn? Mức trần là bao nhiêu?", hint: "Tính trước khi vào phòng đấu giá." },
      { ask: "Giá trị này ai cũng phải đoán (giá trị chung) hay mỗi người một khác?", hint: "Mỏ dầu, công trình: giá trị chung. Bức tranh mình thích: giá trị riêng." },
      { ask: "Luật trả tiền là gì: trả đúng giá mình bỏ, hay giá cao thứ hai?", hint: "Luật khác nhau, cách bỏ giá khác nhau." },
    ],
    answer:
      "Luôn **đặt giá trần trước** và giữ đúng.\nVới giá trị chung, coi chừng **lời nguyền người thắng**: nếu bạn thắng, nhiều khả năng bạn đã đoán cao nhất, nên **hạ giá bỏ** xuống dưới ước tính.\nPhong bì kín **trả đúng giá mình bỏ**: bỏ thấp hơn giá trị. Phong bì kín **giá thứ hai**: bỏ **đúng giá trị thật**.",
    pitfalls: ["Hăng máu khi đấu giá trực tiếp", "Quên chi phí phát sinh sau khi thắng"],
    lessons: ["5-kieu-dau-gia", "5-loi-nguyen", "5-noi-that"],
  },
  {
    id: "tin-don-thi-truong",
    title: "Nghe tin đồn trên thị trường",
    emoji: "📈",
    audience: "adult",
    group: "tin-tuc",
    keywords: ["tin don", "nghe noi", "sap tang", "thi truong", "tin noi bo", "hoi nhom", "ai cung noi"],
    summary: "\"Nghe nói sắp có tin tốt, mọi người đang mua.\"",
    steps: [
      { ask: "Ai tung tin này, và họ được lợi gì nếu mọi người tin?", hint: "Người đã mua trước có thể muốn bán cho người đến sau." },
      { ask: "Bình thường chuyện như vậy hiếm hay phổ biến?", hint: "Tỷ lệ gốc: bao nhiêu tin đồn kiểu này từng đúng?" },
      { ask: "Nếu tin sai, bạn mất bao nhiêu, và có chịu nổi không?", hint: "Kết quả xấu nhất quan trọng hơn kết quả đẹp nhất." },
    ],
    answer:
      "Hãy phân tích **động cơ của người tung tin**: ai được lợi nếu bạn tin?\nNhớ **tỷ lệ gốc**: phần lớn tin đồn \"chắc chắn tăng\" không thành sự thật.\nCẩn thận với **bầy đàn**: \"ai cũng đang mua\" không phải là thông tin.\nChỉ cân nhắc khi **kết quả xấu nhất vẫn chịu được**.\n*Gai không đưa lời khuyên mua bán cụ thể. Quyết định và trách nhiệm tài chính là của bạn.*",
    pitfalls: ["Sợ lỡ cơ hội (FOMO)", "Vay tiền theo tin đồn", "Chỉ đọc tin ủng hộ điều mình muốn"],
    lessons: ["0a-cap-nhat", "6-bay-dan", "0-rui-ro"],
  },
  {
    id: "hop-tac-doi-thu",
    title: "Có nên hợp tác với đối thủ?",
    emoji: "🤝",
    audience: "adult",
    group: "cong-viec",
    keywords: ["hop tac voi doi thu", "lien minh", "bat tay", "hop tac", "chung tay", "lien doanh"],
    summary: "Cùng làm thì cả hai lợi, nhưng sợ bị chơi xấu.",
    steps: [
      { ask: "Nếu cùng hợp tác, mỗi bên được gì? Nếu một bên chơi xấu, bên đó được gì?", hint: "Vẽ bảng lợi ích 2×2." },
      { ask: "Hai bên còn gặp nhau, làm ăn với nhau lâu dài không?", hint: "Cái bóng của tương lai." },
      { ask: "Làm sao để việc chơi xấu bị phát hiện và phải trả giá?", hint: "Hợp đồng, đặt cọc, chia sẻ thông tin dần dần." },
    ],
    answer:
      "Hợp tác bền khi: **còn gặp lại lâu dài**, **chơi xấu bị phát hiện**, và **phải trả giá**.\nBắt đầu **nhỏ**, tăng dần khi đối tác giữ lời (xây uy tín hai chiều).\nDùng **cam kết ràng buộc**: hợp đồng, đặt cọc, mốc kiểm tra.\n*Lưu ý: hợp tác về giá, chia thị trường với đối thủ có thể vi phạm luật cạnh tranh. Hãy hỏi luật sư.*",
    pitfalls: ["Chia sẻ hết bí quyết ngay từ đầu", "Không có cách phát hiện chơi xấu"],
    lessons: ["3-gap-lai", "3-uy-tin", "2-cam-ket"],
  },
];

export function findSituation(id: string): Situation | undefined {
  return SITUATIONS.find((s) => s.id === id);
}

export function situationsFor(kid: boolean): Situation[] {
  return kid ? SITUATIONS.filter((s) => s.audience === "all") : SITUATIONS;
}
