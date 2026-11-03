import { tDecide, tLeaf } from "@gai/gt-core";
import type { Level, MiniTree } from "../types";

/** An chia 10 miếng bánh, Bình nhận hoặc từ chối (từ chối thì không ai được gì). */
const CHIA_BANH: MiniTree = {
  players: ["An", "Bình"],
  root: tDecide("an", 0, [
    ["Chia đều", tDecide("b1", 1, [["Nhận", tLeaf("deu-nhan", 5, 5)], ["Từ chối", tLeaf("deu-tu", 0, 0)]])],
    ["Lấy phần lớn", tDecide("b2", 1, [["Nhận", tLeaf("lon-nhan", 8, 2)], ["Từ chối", tLeaf("lon-tu", 0, 0)]])],
  ]),
};

/** Quán mới có mở cạnh quán cũ không; quán cũ dọa giảm giá mạnh. */
const GIA_NHAP: MiniTree = {
  players: ["Quán mới", "Quán cũ"],
  root: tDecide("moi", 0, [
    ["Mở quán", tDecide("cu", 1, [["Giảm giá mạnh", tLeaf("danh", -2, 2)], ["Chung sống", tLeaf("song", 3, 5)]])],
    ["Không mở", tLeaf("khong", 0, 10)],
  ]),
};

/** Anh dọa mách mẹ nếu em lấy kẹo, nhưng mách thì anh cũng bị mắng. */
const LAY_KEO: MiniTree = {
  players: ["Em", "Anh"],
  root: tDecide("em", 0, [
    [
      "Lấy kẹo",
      tDecide("anh", 1, [
        ["Mách mẹ", tLeaf("mach", -3, -2, "Cả hai bị mắng")],
        ["Bỏ qua", tLeaf("bo-qua", 2, -1)],
      ]),
    ],
    ["Không lấy", tLeaf("khong-lay", 0, 0)],
  ]),
};

/** Quán cũ có thể cam kết giá thấp trước (ký hợp đồng với khách), làm lời dọa thành đáng tin. */
const CAM_KET: MiniTree = {
  players: ["Quán mới", "Quán cũ"],
  root: tDecide("cu0", 1, [
    [
      "Cam kết giá thấp",
      tDecide("m1", 0, [
        ["Mở quán", tDecide("c1", 1, [["Giảm giá", tLeaf("ck-danh", -2, 4)], ["Chung sống", tLeaf("ck-song", 3, 3)]])],
        ["Không mở", tLeaf("ck-khong", 0, 8)],
      ]),
    ],
    [
      "Không cam kết",
      tDecide("m2", 0, [
        ["Mở quán", tDecide("c2", 1, [["Giảm giá", tLeaf("kk-danh", -2, 2)], ["Chung sống", tLeaf("kk-song", 3, 5)]])],
        ["Không mở", tLeaf("kk-khong", 0, 10)],
      ]),
    ],
  ]),
};

/** Con đường hẹp nhưng An quyết trước, Bình nhìn thấy rồi mới chọn. */
const DUONG_HEP: MiniTree = {
  players: ["An", "Bình"],
  root: tDecide("an", 0, [
    ["Đi thẳng", tDecide("b1", 1, [["Né", tLeaf("t-ne", 1, -1)], ["Đi thẳng", tLeaf("t-t", -10, -10, "Cả hai ngã đau")]])],
    ["Né", tDecide("b2", 1, [["Né", tLeaf("n-ne", 0, 0)], ["Đi thẳng", tLeaf("n-t", -1, 1)]])],
  ]),
};

/** Chuyền hộp kẹo: mỗi lần chuyền, hộp to thêm, nhưng người nhận có thể lấy luôn. */
const CHUYEN_KEO: MiniTree = {
  players: ["An", "Bình"],
  root: tDecide("an1", 0, [
    ["Lấy luôn", tLeaf("l1", 2, 0)],
    [
      "Chuyền",
      tDecide("binh", 1, [
        ["Lấy luôn", tLeaf("l2", 1, 3)],
        ["Chuyền", tDecide("an2", 0, [["Lấy luôn", tLeaf("l3", 4, 2)], ["Chia đều", tLeaf("l4", 3, 3)]])],
      ]),
    ],
  ]),
};

export const LEVEL_2: Level = {
  id: "2",
  title: "Trò chơi lần lượt",
  emoji: "🌲",
  description: "Khi mỗi người đi một lượt và nhìn thấy nước đi trước đó: nghĩ ngược từ cuối, lời dọa có đáng tin không, đi trước hay đi sau.",
  lessons: [
    {
      id: "2-ve-cay",
      levelId: "2",
      title: "Đi lần lượt: vẽ cây trò chơi",
      emoji: "🌲",
      minutes: 4,
      summary: "Đọc trò chơi có nhiều lượt bằng hình cái cây.",
      cards: [
        {
          kind: "text",
          body: "Nhiều trò chơi diễn ra **lần lượt**: một người chọn trước, người kia **nhìn thấy** rồi mới chọn.\nTa vẽ chúng thành **cây**: mỗi chỗ rẽ là một người phải chọn, mỗi nhánh là một lựa chọn, cuối nhánh là kết quả.",
        },
        {
          kind: "tree",
          title: "Chia bánh 🍰",
          tree: CHIA_BANH,
          caption:
            "An chia 10 miếng bánh trước. Bình xem cách chia rồi **Nhận** hoặc **Từ chối**. Từ chối thì không ai được miếng nào. Số **xanh** là của An, số **cam** là của Bình.",
        },
        {
          kind: "example",
          title: "Cờ vua, cờ caro ♟️",
          body: "Mỗi người đi một nước và thấy hết các nước trước đó. Đây chính là trò chơi lần lượt.",
        },
        {
          kind: "tip",
          body: "Đọc cây **từ trên xuống**: ô màu cho biết **ai chọn**, mũi tên là **lựa chọn**, cuối cùng là **ai được gì**.",
        },
        {
          kind: "real",
          title: "Đàm phán giá",
          body: "Bên bán đưa giá, bên mua nhận hoặc từ chối, hoặc trả giá lại. Mỗi vòng là một tầng của cây.",
        },
      ],
      quiz: [
        {
          id: "2-vc-1",
          kind: "choice",
          tree: CHIA_BANH,
          prompt: "Trong trò Chia bánh, ai chọn trước?",
          options: ["An", "Bình", "Cùng lúc", "Không ai"],
          answer: 0,
          explain: "Ô trên cùng là của An, nên An chọn trước.",
        },
        {
          id: "2-vc-2",
          kind: "choice",
          tree: CHIA_BANH,
          prompt: "Nếu An lấy phần lớn và Bình nhận, An được bao nhiêu miếng?",
          options: ["0", "2", "5", "8"],
          answer: 3,
          explain: "Nhánh Lấy phần lớn → Nhận: (8, 2). Số đầu là của An.",
        },
        {
          id: "2-vc-3",
          kind: "choice",
          prompt: "Khi đến lượt Bình chọn, Bình đã biết An chọn gì chưa?",
          options: ["Rồi, vì đi sau và nhìn thấy", "Chưa", "Chỉ đoán thôi", "Không quan trọng"],
          answer: 0,
          explain: "Đó là điểm khác biệt của trò chơi lần lượt: người đi sau thấy nước đi trước.",
        },
        {
          id: "2-vc-4",
          kind: "choice",
          tree: CHIA_BANH,
          prompt: "Cây Chia bánh có bao nhiêu kết quả cuối cùng?",
          options: ["2", "3", "4", "6"],
          answer: 2,
          explain: "2 cách chia × 2 cách trả lời = 4 kết quả.",
        },
        {
          id: "2-vc-5",
          kind: "choice",
          prompt: "Trò chơi nào là trò chơi lần lượt?",
          options: ["Oẳn tù tì", "Cờ vua", "Đoán đồng xu", "Hai bạn cùng giơ tay"],
          answer: 1,
          explain: "Cờ vua đi từng nước, các trò còn lại ra tay cùng lúc.",
        },
      ],
    },
    {
      id: "2-nghi-nguoc",
      levelId: "2",
      title: "Nghĩ ngược từ cuối",
      emoji: "⏪",
      minutes: 5,
      summary: "Bắt đầu từ nước cuối cùng để biết nên đi nước đầu thế nào.",
      cards: [
        {
          kind: "text",
          body: "Muốn biết nên đi nước đầu thế nào, hãy bắt đầu **từ nước cuối cùng**.\nỞ mỗi chỗ rẽ cuối, người chọn sẽ lấy nhánh tốt nhất cho họ. Gạch bỏ các nhánh còn lại, rồi lùi lên một tầng và làm tiếp.",
        },
        {
          kind: "tree",
          tree: CHIA_BANH,
          solve: true,
          caption:
            "**Bước 1:** Bình ở mỗi nhánh: Nhận được 5 > 0, Nhận được 2 > 0 → Bình luôn nhận.\n**Bước 2:** An biết vậy, so sánh 5 và 8 → An lấy phần lớn.\nĐường tô màu là điều sẽ xảy ra.",
        },
        {
          kind: "example",
          title: "Ngoài đời thì sao?",
          body: "Thực tế nhiều người **từ chối** cách chia quá bất công, dù như vậy họ chẳng được gì. Vì họ còn quan tâm đến **sự công bằng**.\nMô hình chỉ đúng khi con số phản ánh đúng **tất cả** điều người ta quan tâm.",
        },
        { kind: "tip", body: "Nghĩ ngược chính là tự hỏi: **\"Nếu mình làm thế này, người kia sẽ đáp lại thế nào?\"**" },
        {
          kind: "real",
          title: "Trước khi ra giá",
          body: "Người đàm phán giỏi luôn nghĩ trước: đối phương nhận được đề nghị này thì sẽ nhận, từ chối hay trả giá? Rồi chọn đề nghị tốt nhất cho mình mà đối phương vẫn chấp nhận.",
        },
      ],
      quiz: [
        {
          id: "2-nn-1",
          kind: "tree",
          tree: CHIA_BANH,
          prompt: "Nếu cả hai chỉ quan tâm số bánh, chạm vào kết quả sẽ xảy ra.",
          explain: "Bình luôn nhận (có còn hơn không), nên An lấy phần lớn: (8, 2).",
        },
        {
          id: "2-nn-2",
          kind: "tree",
          tree: CHUYEN_KEO,
          prompt: "Chuyền hộp kẹo: mỗi lần chuyền hộp to thêm, nhưng người cầm có thể lấy luôn. Chạm vào kết quả sẽ xảy ra.",
          explain:
            "Từ cuối: An lần 2 lấy luôn (4 > 3). Bình biết vậy nên lấy luôn (3 > 2). An biết vậy nên lấy luôn ngay từ đầu (2 > 1). Lạ chưa: cả hai lẽ ra được 3 nếu tin nhau!",
        },
        {
          id: "2-nn-3",
          kind: "choice",
          prompt: "Nghĩ ngược bắt đầu từ đâu?",
          options: ["Nước đầu tiên", "Nước cuối cùng", "Giữa trò chơi", "Chỗ nào cũng được"],
          answer: 1,
          explain: "Ở nước cuối, người chọn không phải lo ai đáp lại nữa, nên dễ đoán nhất.",
        },
        {
          id: "2-nn-4",
          kind: "tree",
          tree: GIA_NHAP,
          prompt: "Quán mới có nên mở cạnh quán cũ? Chạm vào kết quả sẽ xảy ra.",
          explain: "Nếu quán mới mở, quán cũ chung sống (5) tốt hơn giảm giá (2). Quán mới biết vậy nên mở (3 > 0).",
        },
        {
          id: "2-nn-5",
          kind: "choice",
          prompt: "Vì sao ngoài đời người ta hay từ chối cách chia quá bất công?",
          options: [
            "Vì không biết đếm",
            "Vì họ còn quan tâm đến sự công bằng, không chỉ số bánh",
            "Vì luật bắt buộc",
            "Vì mô hình luôn đúng",
          ],
          answer: 1,
          explain: "Khi tính cả cảm giác bị đối xử bất công, con số thật của họ đã khác.",
        },
      ],
    },
    {
      id: "2-loi-doa",
      levelId: "2",
      title: "Lời đe dọa có đáng tin không?",
      emoji: "🗯️",
      minutes: 5,
      summary: "Phân biệt lời dọa thật và lời dọa suông.",
      cards: [
        {
          kind: "text",
          body: "Lời dọa chỉ có tác dụng nếu **đến lúc phải làm, người dọa thật sự muốn làm**.\nNếu làm thật khiến chính họ thiệt hơn, đó là **lời dọa suông**.",
        },
        {
          kind: "tree",
          title: "Hộp kẹo của anh 🍬",
          tree: LAY_KEO,
          solve: true,
          caption:
            "Anh dọa: \"Lấy kẹo là anh mách mẹ!\" Nhưng mẹ không cho giấu kẹo trong phòng, nên mách thì anh cũng bị mắng (−2), bỏ qua chỉ mất ít kẹo (−1). Đến lúc đó anh sẽ bỏ qua. Em biết vậy nên cứ lấy.",
        },
        {
          kind: "tip",
          body: "Phép thử: **\"Nếu đối phương không nghe, người dọa có thật sự muốn làm không?\"** Không → lời dọa suông.",
        },
        {
          kind: "tree",
          title: "Quán cũ dọa quán mới",
          tree: GIA_NHAP,
          solve: true,
          caption:
            "Quán cũ dọa sẽ giảm giá mạnh nếu quán mới mở. Nhưng khi quán mới đã mở, giảm giá chỉ được 2, chung sống được 5. Lời dọa không đáng tin, quán mới cứ mở.",
        },
        {
          kind: "real",
          title: "Thương trường và chính trị",
          body: "Trước khi sợ một lời đe dọa (cắt hợp đồng, áp thuế, kiện tụng…), hãy tính xem **thực hiện nó có làm chính người dọa thiệt hơn không**.",
        },
      ],
      quiz: [
        {
          id: "2-ld-1",
          kind: "tree",
          tree: LAY_KEO,
          prompt: "Chạm vào kết quả sẽ xảy ra.",
          explain: "Nếu em lấy, anh chọn bỏ qua (−1 tốt hơn −2). Em biết vậy nên lấy (2 > 0).",
        },
        {
          id: "2-ld-2",
          kind: "choice",
          prompt: "Lời dọa đáng tin khi…",
          options: [
            "Nói to và nói nhiều lần",
            "Đến lúc phải làm, người dọa thật sự có lợi khi làm",
            "Người dọa lớn tuổi hơn",
            "Có nhiều người nghe thấy",
          ],
          answer: 1,
          explain: "Điều quan trọng là người dọa có muốn làm thật hay không, không phải nói to đến đâu.",
        },
        {
          id: "2-ld-3",
          kind: "tree",
          tree: GIA_NHAP,
          prompt: "Chạm vào kết quả sẽ xảy ra.",
          explain: "Quán cũ thích chung sống (5) hơn giảm giá (2), nên quán mới mở và hai bên chung sống.",
        },
        {
          id: "2-ld-4",
          kind: "choice",
          tree: GIA_NHAP,
          prompt: "Lời dọa giảm giá mạnh của quán cũ…",
          options: ["Đáng tin", "Không đáng tin, vì đến lúc đó quán cũ thích chung sống hơn", "Không quan trọng", "Luôn thành công"],
          answer: 1,
          explain: "5 > 2, nên khi quán mới đã mở, quán cũ sẽ không giảm giá mạnh.",
        },
        {
          id: "2-ld-5",
          kind: "choice",
          prompt: "Mẹ nói: \"Không dọn phòng thì tối nay không xem TV\", và mẹ luôn làm đúng như đã nói. Lời dọa này…",
          options: ["Đáng tin, vì mẹ luôn làm thật", "Không đáng tin", "Vô nghĩa", "Chỉ để dọa thôi"],
          answer: 0,
          explain: "Giữ lời nhiều lần tạo ra uy tín, giúp lời dọa đáng tin. Bạn sẽ học kỹ hơn ở phần trò chơi lặp lại.",
        },
      ],
    },
    {
      id: "2-cam-ket",
      levelId: "2",
      title: "Sức mạnh của cam kết",
      emoji: "🔗",
      minutes: 5,
      summary: "Tự trói tay mình đôi khi lại giúp mình thắng.",
      cards: [
        {
          kind: "text",
          body: "Đôi khi **tự bỏ bớt lựa chọn** lại giúp bạn có lợi: khi không thể lùi, lời dọa của bạn trở nên **đáng tin**.",
        },
        {
          kind: "example",
          title: "Heo đất 🐷",
          body: "Bỏ tiền vào heo đất thì muốn lấy ra phải đập heo. Vì khó lấy, bạn **không tiêu vặt** được. Bạn đã tự cam kết với chính mình!",
        },
        {
          kind: "tree",
          title: "Quán cũ cam kết trước",
          tree: CAM_KET,
          solve: true,
          caption:
            "Lần này quán cũ đi trước: ký hợp đồng bán giá thấp với khách (bị phạt nếu tăng giá). Giờ nếu quán mới mở, giảm giá (4) lại tốt hơn chung sống (3), nên lời dọa thành thật. Quán mới không dám mở, quán cũ được **8** thay vì 5!",
        },
        { kind: "tip", body: "Cam kết chỉ hiệu quả khi: **1.** đối phương **nhìn thấy**, và **2.** **không rút lại được**." },
        {
          kind: "real",
          title: "Cam kết hoàn tiền",
          body: "\"Hoàn tiền chênh lệch nếu bạn tìm được giá rẻ hơn\" là một cam kết công khai: đối thủ biết giảm giá để giành khách cũng vô ích.",
        },
      ],
      quiz: [
        {
          id: "2-ck-1",
          kind: "tree",
          tree: CAM_KET,
          prompt: "Chạm vào kết quả sẽ xảy ra.",
          explain: "Có cam kết thì quán mới không mở (0, 8). Không cam kết thì quán cũ chỉ được 5. Quán cũ chọn cam kết.",
        },
        {
          id: "2-ck-2",
          kind: "choice",
          prompt: "Heo đất giúp tiết kiệm vì…",
          options: ["Heo đất rất đẹp", "Muốn lấy tiền phải đập heo, nên khó tiêu vặt", "Heo đất sinh lãi", "Bố mẹ bắt buộc"],
          answer: 1,
          explain: "Làm cho việc tiêu tiền khó hơn chính là một cam kết với bản thân.",
        },
        {
          id: "2-ck-3",
          kind: "choice",
          prompt: "Cam kết hiệu quả cần điều kiện gì?",
          options: ["Giữ thật bí mật", "Đối phương nhìn thấy và không rút lại được", "Nói nhiều lần", "Rút lại được bất cứ lúc nào"],
          answer: 1,
          explain: "Bí mật hay rút lại được thì đối phương không tin, cam kết vô dụng.",
        },
        {
          id: "2-ck-4",
          kind: "choice",
          tree: CAM_KET,
          prompt: "Nhờ cam kết, quán cũ được bao nhiêu (thay vì 5)?",
          options: ["3", "5", "8", "10"],
          answer: 2,
          explain: "Cam kết → quán mới không mở → quán cũ được 8.",
        },
        {
          id: "2-ck-5",
          kind: "choice",
          prompt: "Vì sao \"tự trói tay\" lại có lợi?",
          options: [
            "Vì đối phương thấy mình không thể lùi, nên họ phải nhường",
            "Vì mình được nghỉ ngơi",
            "Vì lúc nào cũng có lợi",
            "Không bao giờ có lợi",
          ],
          answer: 0,
          explain: "Khi bạn không còn đường lui, đối phương phải tính lại.",
        },
      ],
    },
    {
      id: "2-di-truoc-sau",
      levelId: "2",
      title: "Đi trước hay đi sau?",
      emoji: "🏁",
      minutes: 4,
      summary: "Khi nào đi trước có lợi, khi nào đi sau có lợi.",
      cards: [
        {
          kind: "text",
          body: "Trong trò chơi lần lượt, **thứ tự đi** rất quan trọng. Có lúc đi trước lợi, có lúc đi sau lợi.",
        },
        {
          kind: "tree",
          title: "Con đường hẹp 🚲",
          tree: DUONG_HEP,
          solve: true,
          caption:
            "Hai bạn đạp xe trên đường hẹp, An quyết trước và Bình nhìn thấy. An đi thẳng, Bình biết nếu cũng đi thẳng thì cả hai ngã đau, nên đành né. **Đi trước có lợi**: An chiếm được thế.",
        },
        {
          kind: "example",
          title: "Oẳn tù tì nhìn tay bạn ✊",
          body: "Nếu bạn được ra tay **sau khi thấy** bạn kia ra gì, bạn luôn thắng! Ở đây **đi sau có lợi**, vì có thêm thông tin.",
        },
        {
          kind: "tip",
          body: "Đi trước có lợi khi **chiếm được chỗ, khóa được lựa chọn**. Đi sau có lợi khi **cần xem đối phương làm gì** để đáp lại.",
        },
        {
          kind: "real",
          title: "Ra mắt sản phẩm",
          body: "Hãng đi trước chiếm khách hàng và thương hiệu. Hãng đi sau học được từ sai lầm của hãng đi trước và làm tốt hơn với chi phí thấp hơn.",
        },
      ],
      quiz: [
        {
          id: "2-dt-1",
          kind: "tree",
          tree: DUONG_HEP,
          prompt: "Chạm vào kết quả sẽ xảy ra.",
          explain: "Nếu An đi thẳng, Bình né (−1 tốt hơn −10). Nếu An né, Bình đi thẳng. An chọn đi thẳng (1 > −1).",
        },
        {
          id: "2-dt-2",
          kind: "choice",
          prompt: "Chơi oẳn tù tì mà được nhìn tay bạn trước khi ra, ai có lợi?",
          options: ["Người ra trước", "Người ra sau", "Không ai", "Hòa mãi"],
          answer: 1,
          explain: "Người ra sau biết thông tin và luôn chọn được cái thắng.",
        },
        {
          id: "2-dt-3",
          kind: "choice",
          prompt: "Đi trước thường có lợi khi…",
          options: ["Cần xem đối phương làm gì", "Chiếm được chỗ và khóa được lựa chọn", "Không có thông tin gì", "Lúc nào cũng vậy"],
          answer: 1,
          explain: "Ai đi trước chiếm được thế, người sau phải thích nghi.",
        },
        {
          id: "2-dt-4",
          kind: "choice",
          tree: DUONG_HEP,
          prompt: "Nếu đổi lại để Bình được quyết trước, ai sẽ được 1 điểm?",
          options: ["An", "Bình", "Không ai", "Cả hai"],
          answer: 1,
          explain: "Trò chơi giống hệt nhau cho hai bên, nên ai đi trước người đó chiếm thế.",
        },
        {
          id: "2-dt-5",
          kind: "choice",
          prompt: "Hãng đi sau có thể có lợi gì?",
          options: ["Không có gì", "Học từ sai lầm của hãng đi trước", "Luôn có nhiều khách hơn", "Không phải cạnh tranh"],
          answer: 1,
          explain: "Đi sau tốn ít chi phí thử nghiệm hơn, vì đã thấy điều gì hiệu quả.",
        },
      ],
    },
  ],
};
