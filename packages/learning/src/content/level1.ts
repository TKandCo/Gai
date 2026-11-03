import type { Level, MiniGame } from "../types";

/** Chia kẹo = song đề tù nhân phiên bản trẻ em */
const CHIA_KEO: MiniGame = {
  players: ["An", "Bình"],
  rows: ["Chia", "Giành"],
  cols: ["Chia", "Giành"],
  payoffs: [
    [[3, 3], [0, 5]],
    [[5, 0], [1, 1]],
  ],
};

/** Cả hai bên đều có chiến lược trội */
const TREN_DUOI: MiniGame = {
  players: ["A", "B"],
  rows: ["Trên", "Dưới"],
  cols: ["Trái", "Phải"],
  payoffs: [
    [[4, 1], [3, 3]],
    [[2, 2], [1, 4]],
  ],
};

const HEN_GAP: MiniGame = {
  players: ["An", "Bình"],
  rows: ["Công viên", "Thư viện"],
  cols: ["Công viên", "Thư viện"],
  payoffs: [
    [[2, 2], [0, 0]],
    [[0, 0], [1, 1]],
  ],
};

/** Săn hươu phiên bản trẻ em */
const LAU_DAI_CAT: MiniGame = {
  players: ["An", "Bình"],
  rows: ["Lâu đài lớn", "Lâu đài nhỏ"],
  cols: ["Lâu đài lớn", "Lâu đài nhỏ"],
  payoffs: [
    [[4, 4], [0, 3]],
    [[3, 0], [3, 3]],
  ],
};

const LOAI_TRU: MiniGame = {
  players: ["A", "B"],
  rows: ["Trên", "Dưới"],
  cols: ["Trái", "Giữa", "Phải"],
  payoffs: [
    [[1, 0], [1, 2], [0, 1]],
    [[0, 3], [0, 1], [2, 0]],
  ],
};

const DONG_XU: MiniGame = {
  players: ["An", "Bình"],
  rows: ["Sấp", "Ngửa"],
  cols: ["Sấp", "Ngửa"],
  payoffs: [
    [[1, -1], [-1, 1]],
    [[-1, 1], [1, -1]],
  ],
};

export const LEVEL_1: Level = {
  id: "1",
  title: "Trò chơi cùng lúc",
  emoji: "♟️",
  description: "Hai bên chọn cùng một lúc. Học cách vẽ bảng, tìm lựa chọn tốt nhất và điểm cân bằng.",
  lessons: [
    {
      id: "1-tro-choi-la-gi",
      levelId: "1",
      title: "Trò chơi là gì?",
      emoji: "🎮",
      minutes: 4,
      summary: "Nhận ra khi nào một tình huống là \"trò chơi\".",
      cards: [
        {
          kind: "text",
          body: "\"Trò chơi\" là **bất kỳ tình huống nào mà kết quả của bạn phụ thuộc vào lựa chọn của người khác**, và họ cũng đang suy nghĩ về bạn.",
        },
        {
          kind: "text",
          title: "4 câu hỏi luôn phải trả lời",
          body: "1. **Ai** là người chơi?\n2. Mỗi người có **lựa chọn** gì?\n3. Mỗi kết quả, ai **được gì**?\n4. Họ chọn **cùng lúc** hay **lần lượt**?",
        },
        {
          kind: "example",
          title: "Oẳn tù tì ✊✌️✋",
          body: "Người chơi: bạn và một người bạn. Lựa chọn: búa, kéo, bao. Kết quả: thắng, thua hoặc hòa. Hai người chọn **cùng lúc**.",
        },
        {
          kind: "tip",
          body: "Không phải cái gì cũng là trò chơi. Trời mưa không \"tính toán\" để chống lại bạn. Khi chỉ có bạn và may rủi, đó là **quyết định có rủi ro**.",
        },
        {
          kind: "real",
          title: "Trong kinh doanh",
          body: "Hai cửa hàng cạnh nhau quyết định giá bán. Lợi nhuận của mỗi bên phụ thuộc vào giá của bên kia → đây là một trò chơi.",
        },
      ],
      quiz: [
        {
          id: "1-tc-1",
          kind: "choice",
          prompt: "Tình huống nào là \"trò chơi\" theo nghĩa lý thuyết trò chơi?",
          options: [
            "Mang áo mưa vì trời có thể mưa",
            "Hai bạn chọn chỗ ngồi trong rạp và muốn ngồi cạnh nhau",
            "Tự tung xúc xắc một mình",
            "Đọc một cuốn sách",
          ],
          answer: 1,
          explain: "Chỗ ngồi tốt của mỗi bạn phụ thuộc vào lựa chọn của bạn kia.",
        },
        {
          id: "1-tc-2",
          kind: "choice",
          prompt: "Trong oẳn tù tì, hai người chọn…",
          options: ["Lần lượt", "Cùng lúc", "Không cần chọn", "Một người chọn cho cả hai"],
          answer: 1,
          explain: "Cả hai ra tay cùng lúc, không ai biết trước người kia ra gì.",
        },
        {
          id: "1-tc-3",
          kind: "choice",
          prompt: "Câu hỏi nào KHÔNG thuộc 4 câu hỏi cơ bản?",
          options: ["Ai là người chơi?", "Mỗi người có lựa chọn gì?", "Ai mặc áo màu gì?", "Mỗi kết quả, ai được gì?"],
          answer: 2,
          explain: "Màu áo không ảnh hưởng đến kết quả của trò chơi.",
        },
        {
          id: "1-tc-4",
          kind: "choice",
          prompt: "Một bác nông dân lo thời tiết xấu làm hỏng mùa vụ. Đây là…",
          options: [
            "Trò chơi với thời tiết",
            "Quyết định có rủi ro (thời tiết không tính toán chống lại ai)",
            "Song đề tù nhân",
            "Đấu giá",
          ],
          answer: 1,
          explain: "Thời tiết là may rủi, không phải một người chơi biết suy nghĩ.",
        },
        {
          id: "1-tc-5",
          kind: "choice",
          prompt: "Hai hãng xe công nghệ cùng quyết định có giảm giá cước hay không. Người chơi là ai?",
          options: ["Chỉ hãng lớn hơn", "Hai hãng xe", "Khách đi xe", "Trời"],
          answer: 1,
          explain: "Hai hãng là hai bên ra quyết định và ảnh hưởng lẫn nhau.",
        },
      ],
    },
    {
      id: "1-doc-bang",
      levelId: "1",
      title: "Đọc bảng lợi ích",
      emoji: "📋",
      minutes: 5,
      summary: "Vẽ trò chơi thành bảng và đọc ai được gì.",
      cards: [
        {
          kind: "text",
          body: "Ta vẽ trò chơi thành **bảng**.\nHàng là lựa chọn của người thứ nhất (**màu xanh**), cột là lựa chọn của người thứ hai (**màu cam**).\nMỗi ô có 2 số: **số trái của người xanh, số phải của người cam**. Số càng lớn càng thích.",
        },
        {
          kind: "matrix",
          title: "Chia kẹo 🍬",
          game: CHIA_KEO,
          caption:
            "An và Bình có một hộp kẹo. Mỗi bạn chọn Chia hoặc Giành. Ô trên bên phải: An chọn Chia, Bình chọn Giành → An được 0, Bình được 5.",
        },
        {
          kind: "example",
          title: "Mẹo đọc bảng",
          body: "Muốn biết An thích gì: chỉ nhìn **số trái** (xanh).\nMuốn biết Bình thích gì: chỉ nhìn **số phải** (cam).",
        },
        {
          kind: "tip",
          body: "Các con số chỉ cần đúng **thứ tự hơn kém**: 5 > 3 > 1 > 0 nghĩa là giành được hết là vui nhất, bị giành hết là buồn nhất.",
        },
        {
          kind: "real",
          title: "Số trong đời thực",
          body: "Trong kinh doanh, số có thể là lợi nhuận, thị phần, hoặc chỉ là mức độ ưa thích xếp hạng từ thấp đến cao.",
        },
      ],
      quiz: [
        {
          id: "1-db-1",
          kind: "choice",
          game: CHIA_KEO,
          prompt: "Nếu An chọn Giành và Bình chọn Chia, An được bao nhiêu?",
          options: ["0", "1", "3", "5"],
          answer: 3,
          explain: "Hàng Giành, cột Chia: ô (5, 0). Số trái 5 là của An.",
        },
        {
          id: "1-db-2",
          kind: "choice",
          game: CHIA_KEO,
          prompt: "Nếu cả hai cùng Giành, Bình được bao nhiêu?",
          options: ["0", "1", "3", "5"],
          answer: 1,
          explain: "Ô Giành – Giành là (1, 1). Số phải 1 là của Bình.",
        },
        {
          id: "1-db-3",
          kind: "choice",
          game: CHIA_KEO,
          prompt: "Bình thích ô nào nhất?",
          options: ["Cả hai Chia", "An Chia, Bình Giành", "An Giành, Bình Chia", "Cả hai Giành"],
          answer: 1,
          explain: "Nhìn số phải: lớn nhất là 5 ở ô An Chia, Bình Giành.",
        },
        {
          id: "1-db-4",
          kind: "choice",
          prompt: "Trong một ô ghi (4, 2), số 2 là của ai?",
          options: ["Người chọn hàng (xanh)", "Người chọn cột (cam)", "Cả hai", "Không ai"],
          answer: 1,
          explain: "Số phải luôn là của người chọn cột.",
        },
        {
          id: "1-db-5",
          kind: "choice",
          prompt: "Lợi ích 5 so với lợi ích 3 nghĩa là…",
          options: ["5 tệ hơn 3", "5 được thích hơn 3", "Bằng nhau", "Không so được"],
          answer: 1,
          explain: "Số càng lớn, người đó càng thích kết quả ấy.",
        },
      ],
    },
    {
      id: "1-chien-luoc-troi",
      levelId: "1",
      title: "Lựa chọn luôn tốt hơn",
      emoji: "💪",
      minutes: 5,
      summary: "Chiến lược trội và nghịch lý của song đề tù nhân.",
      cards: [
        {
          kind: "text",
          body: "Một lựa chọn là **chiến lược trội** nếu nó **tốt hơn mọi lựa chọn khác, dù đối phương làm gì**.\nCó chiến lược trội thì cứ chọn, không cần đoán đối phương.",
        },
        {
          kind: "matrix",
          game: CHIA_KEO,
          highlight: [[1, 1]],
          caption:
            "Nhìn từ phía An: nếu Bình Chia, Giành được 5 > 3. Nếu Bình Giành, Giành được 1 > 0. → **Giành luôn tốt hơn** cho An.",
        },
        {
          kind: "example",
          title: "Nghịch lý",
          body: "Bình cũng nghĩ y hệt và chọn Giành. Kết quả: mỗi bạn chỉ được **1**, trong khi cùng Chia thì mỗi bạn được **3**!\nĐây là **Song đề tù nhân**: ai cũng khôn cho mình nhưng cả hai cùng thiệt.",
        },
        {
          kind: "tip",
          body: "Cách tìm: với người xanh, so sánh từng **cột**; với người cam, so sánh từng **hàng**. Lựa chọn nào thắng **ở mọi chỗ** là trội.",
        },
        {
          kind: "real",
          title: "Cuộc chiến giá",
          body: "Hai siêu thị cùng giảm giá vì sợ mất khách, cuối cùng cả hai lời ít. Đó cũng là lý do các thỏa thuận giữ giá giữa đối thủ rất khó bền.",
        },
      ],
      quiz: [
        {
          id: "1-ct-1",
          kind: "choice",
          game: CHIA_KEO,
          prompt: "Trong trò Chia kẹo, chiến lược trội của Bình là gì?",
          options: ["Chia", "Giành", "Không có", "Tùy An"],
          answer: 1,
          explain: "An Chia: Giành 5 > Chia 3. An Giành: Giành 1 > Chia 0. Giành luôn tốt hơn.",
        },
        {
          id: "1-ct-2",
          kind: "choice",
          game: TREN_DUOI,
          prompt: "A có chiến lược trội không?",
          options: ["Có: Trên", "Có: Dưới", "Không có"],
          answer: 0,
          explain: "Cột Trái: Trên 4 > Dưới 2. Cột Phải: Trên 3 > Dưới 1. Trên luôn tốt hơn.",
        },
        {
          id: "1-ct-3",
          kind: "choice",
          game: TREN_DUOI,
          prompt: "Nếu cả hai đều chọn chiến lược trội của mình, kết quả là ô nào?",
          options: ["Trên – Trái", "Trên – Phải", "Dưới – Trái", "Dưới – Phải"],
          answer: 1,
          explain: "A trội là Trên. B: hàng Trên Phải 3 > 1, hàng Dưới Phải 4 > 2 → B trội là Phải.",
        },
        {
          id: "1-ct-4",
          kind: "choice",
          prompt: "Có chiến lược trội nghĩa là…",
          options: [
            "Phải đoán đúng đối phương mới thắng",
            "Không cần đoán đối phương, cứ chọn nó",
            "Chắc chắn thắng đối phương",
            "Đối phương sẽ thua",
          ],
          answer: 1,
          explain: "Dù đối phương làm gì, lựa chọn đó vẫn tốt nhất cho bạn.",
        },
        {
          id: "1-ct-5",
          kind: "choice",
          prompt: "Vì sao Song đề tù nhân là một \"nghịch lý\"?",
          options: [
            "Vì không ai có chiến lược trội",
            "Vì mỗi bên chọn tốt nhất cho mình nhưng kết quả chung tệ hơn khi hợp tác",
            "Vì kết quả luôn hòa",
            "Vì có quá nhiều lựa chọn",
          ],
          answer: 1,
          explain: "Cả hai cùng Giành được 1, kém hơn cùng Chia được 3.",
        },
      ],
    },
    {
      id: "1-can-bang-nash",
      levelId: "1",
      title: "Cân bằng Nash: không ai muốn đổi",
      emoji: "⭐",
      minutes: 6,
      summary: "Tìm điểm mà không ai muốn tự mình thay đổi.",
      cards: [
        {
          kind: "text",
          body: "**Cân bằng Nash** là một ô trong bảng mà **không ai muốn tự mình đổi lựa chọn**, khi người kia giữ nguyên.\nTên gọi theo nhà toán học John Nash.",
        },
        {
          kind: "text",
          title: "Cách gạch chân",
          body: "1. Ở mỗi cột, gạch chân **số trái lớn nhất** (lựa chọn tốt nhất của người xanh).\n2. Ở mỗi hàng, gạch chân **số phải lớn nhất** (lựa chọn tốt nhất của người cam).\n3. Ô nào có **cả hai số được gạch chân** là cân bằng Nash.",
        },
        {
          kind: "matrix",
          title: "Hẹn gặp nhưng quên chỗ",
          game: HEN_GAP,
          highlight: [
            [0, 0],
            [1, 1],
          ],
          caption:
            "Có **hai** cân bằng: cùng ra công viên, hoặc cùng ở thư viện. Ở mỗi ô đó, ai tự đổi chỗ sẽ không gặp được bạn.",
        },
        {
          kind: "tip",
          body: "Một trò chơi có thể có **nhiều** cân bằng, hoặc **không có** ô cân bằng nào. Khi đó người chơi nên khó đoán (học ở bài sau).",
        },
        {
          kind: "real",
          title: "Tiêu chuẩn chung",
          body: "Mỗi nước đi bên phải hay bên trái đường, mỗi ngành dùng một kiểu sạc chung… Đó là các cân bằng: khi mọi người đã theo, không ai muốn tự mình đổi.",
        },
      ],
      quiz: [
        {
          id: "1-nash-1",
          kind: "nash",
          game: CHIA_KEO,
          prompt: "Chạm vào ô cân bằng Nash trong trò Chia kẹo.",
          explain: "Cả hai cùng Giành: ai tự đổi sang Chia sẽ được 0 thay vì 1.",
        },
        {
          id: "1-nash-2",
          kind: "nash",
          game: LAU_DAI_CAT,
          prompt: "Xây lâu đài cát: lâu đài lớn cần cả hai cùng làm. Chạm vào TẤT CẢ các ô cân bằng.",
          explain: "Có hai cân bằng: cùng xây lớn (4, 4) và cùng xây nhỏ (3, 3). Kết quả tốt cần tin tưởng nhau.",
        },
        {
          id: "1-nash-3",
          kind: "nash",
          game: TREN_DUOI,
          prompt: "Chạm vào ô cân bằng Nash.",
          explain: "Trên – Phải: A được 3 (Dưới chỉ 1), B được 3 (Trái chỉ 1). Không ai muốn đổi.",
        },
        {
          id: "1-nash-4",
          kind: "choice",
          prompt: "Ở cân bằng Nash, điều gì đúng?",
          options: [
            "Cả hai được nhiều nhất có thể",
            "Không ai muốn tự mình đổi lựa chọn",
            "Một người thắng, một người thua",
            "Hai người chọn giống nhau",
          ],
          answer: 1,
          explain: "Cân bằng không nhất thiết là tốt nhất cho cả hai (nhớ trò Chia kẹo!).",
        },
        {
          id: "1-nash-5",
          kind: "nash",
          game: LOAI_TRU,
          prompt: "Bảng có 3 cột. Chạm vào ô cân bằng Nash.",
          explain: "Trên – Giữa: cột Giữa A được 1 > 0; hàng Trên B được 2, lớn nhất trong hàng.",
        },
      ],
    },
    {
      id: "1-kho-doan",
      levelId: "1",
      title: "Khi nào nên khó đoán?",
      emoji: "🎯",
      minutes: 5,
      summary: "Chọn ngẫu nhiên có tính toán: chiến lược hỗn hợp.",
      cards: [
        {
          kind: "text",
          body: "Có trò chơi **không có ô cân bằng nào**.\nVí dụ đoán đồng xu: An thắng khi hai đồng xu giống mặt, Bình thắng khi khác mặt. Ai bị đoán trúng thì thua.",
        },
        {
          kind: "matrix",
          game: DONG_XU,
          caption: "Không ô nào có cả hai số đều là tốt nhất. Cách chơi tốt: mỗi bên chọn mỗi mặt **50%**.",
        },
        {
          kind: "example",
          title: "Sút phạt đền ⚽",
          body: "Cầu thủ sút trái hay phải? Thủ môn bay trái hay phải?\nNếu cầu thủ luôn sút trái, thủ môn sẽ biết. Cách tốt nhất: **chọn ngẫu nhiên** để không bị đoán.",
        },
        {
          kind: "text",
          title: "Chiến lược hỗn hợp",
          body: "Chọn ngẫu nhiên theo tỷ lệ gọi là **chiến lược hỗn hợp**.\nTỷ lệ đúng là tỷ lệ khiến **đối phương thấy lựa chọn nào của họ cũng như nhau**, nên họ không khai thác được bạn.",
        },
        { kind: "tip", body: "Oẳn tù tì: ra mỗi loại **1/3** số lần. Ai có thói quen (hay ra búa) sẽ bị bắt bài." },
        {
          kind: "real",
          title: "Kiểm tra bất ngờ",
          body: "Thanh tra, kiểm toán, kiểm tra hàng hóa thường làm **ngẫu nhiên**, để người bị kiểm tra không đoán được lúc nào an toàn để gian lận.",
        },
      ],
      quiz: [
        {
          id: "1-kd-1",
          kind: "choice",
          game: DONG_XU,
          prompt: "Trong trò đoán đồng xu, có ô cân bằng Nash nào không?",
          options: ["Có 1 ô", "Có 2 ô", "Không có ô nào", "Cả 4 ô"],
          answer: 2,
          explain: "Ở mỗi ô, luôn có một người muốn đổi mặt để thắng.",
        },
        {
          id: "1-kd-2",
          kind: "choice",
          prompt: "Vì sao cầu thủ nên sút ngẫu nhiên khi đá phạt đền?",
          options: ["Cho vui", "Để thủ môn không đoán được", "Vì sút trái luôn tốt hơn", "Vì luật bắt buộc"],
          answer: 1,
          explain: "Nếu có thói quen, thủ môn sẽ bay đúng hướng.",
        },
        {
          id: "1-kd-3",
          kind: "number",
          prompt: "Oẳn tù tì: cách chơi cân bằng là ra búa với xác suất bao nhiêu?",
          hint: "Ví dụ 1/2",
          answer: 1 / 3,
          explain: "Ba lựa chọn ngang nhau, mỗi loại 1/3.",
        },
        {
          id: "1-kd-4",
          kind: "choice",
          prompt: "Tỷ lệ trộn đúng là tỷ lệ khiến…",
          options: [
            "Mình thắng mọi lần",
            "Đối phương thấy các lựa chọn của họ tốt như nhau",
            "Đối phương luôn thua",
            "Mình chọn giống đối phương",
          ],
          answer: 1,
          explain: "Khi mọi lựa chọn của đối phương như nhau, họ không có cách nào khai thác bạn.",
        },
        {
          id: "1-kd-5",
          kind: "choice",
          prompt: "Minh chơi oẳn tù tì lúc nào cũng ra búa. Bạn nên ra gì?",
          options: ["Búa", "Kéo", "Bao", "Ngẫu nhiên"],
          answer: 2,
          explain: "Bao thắng búa. Thói quen bị khai thác!",
        },
      ],
    },
  ],
};
