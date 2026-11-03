/** 10 trò chơi kinh điển dùng làm mẫu trong Phòng lab và làm bộ test cho bộ giải. */
export type ClassicGame = {
  id: string;
  title: string;
  story: string;
  lesson: string;
  players: [string, string];
  rows: string[];
  cols: string[];
  payoffs: [number, number][][];
};

export const CLASSIC_GAMES: ClassicGame[] = [
  {
    id: "tu-nhan",
    title: "Song đề tù nhân",
    story:
      "Hai quán cà phê cạnh nhau. Nếu cả hai giữ giá, cả hai lời. Nếu một bên giảm giá, bên đó hút hết khách. Nếu cả hai cùng giảm, cả hai lời ít.",
    lesson:
      "Mỗi bên đều chọn hợp lý cho mình, nhưng kết quả chung lại tệ cho cả hai. Đây là lý do các thỏa thuận giữ giá (cartel) rất khó giữ.",
    players: ["Quán A", "Quán B"],
    rows: ["Giữ giá", "Giảm giá"],
    cols: ["Giữ giá", "Giảm giá"],
    payoffs: [
      [[3, 3], [0, 5]],
      [[5, 0], [1, 1]],
    ],
  },
  {
    id: "san-huou",
    title: "Săn hươu",
    story:
      "Hai người đi săn. Săn hươu cần cả hai hợp sức và được nhiều thịt. Săn thỏ thì tự làm được nhưng ít hơn.",
    lesson:
      "Có hai cân bằng: cùng săn hươu (tốt nhất) hoặc cùng săn thỏ (an toàn). Kết quả tốt phụ thuộc vào việc tin đối phương.",
    players: ["Người A", "Người B"],
    rows: ["Hươu", "Thỏ"],
    cols: ["Hươu", "Thỏ"],
    payoffs: [
      [[4, 4], [0, 3]],
      [[3, 0], [3, 3]],
    ],
  },
  {
    id: "con-ga",
    title: "Trò chơi con gà",
    story:
      "Hai xe lao vào nhau. Ai né trước là \"con gà\". Nếu cả hai lao thẳng, cả hai cùng thảm họa.",
    lesson:
      "Ai cam kết đáng tin trước (ví dụ: tháo vô lăng ném ra ngoài) sẽ thắng. Mô tả rất đúng các cuộc leo thang căng thẳng.",
    players: ["Tài xế A", "Tài xế B"],
    rows: ["Né", "Lao thẳng"],
    cols: ["Né", "Lao thẳng"],
    payoffs: [
      [[0, 0], [-1, 1]],
      [[1, -1], [-10, -10]],
    ],
  },
  {
    id: "chon-diem-hen",
    title: "Chọn điểm hẹn",
    story:
      "Hai người muốn đi chơi cùng nhau, nhưng A thích ca nhạc còn B thích bóng đá. Đi riêng thì cả hai đều chán.",
    lesson:
      "Hai bên cùng muốn phối hợp nhưng tranh nhau phần lợi. Ai lên tiếng trước thường được chọn.",
    players: ["A", "B"],
    rows: ["Ca nhạc", "Bóng đá"],
    cols: ["Ca nhạc", "Bóng đá"],
    payoffs: [
      [[2, 1], [0, 0]],
      [[0, 0], [1, 2]],
    ],
  },
  {
    id: "doan-dong-xu",
    title: "Đoán đồng xu",
    story:
      "A thắng nếu hai đồng xu cùng mặt, B thắng nếu khác mặt. Giống cầu thủ sút phạt đền và thủ môn.",
    lesson:
      "Không có cân bằng thuần. Cách chơi tốt nhất là khó đoán: chọn ngẫu nhiên 50/50.",
    players: ["A", "B"],
    rows: ["Sấp", "Ngửa"],
    cols: ["Sấp", "Ngửa"],
    payoffs: [
      [[1, -1], [-1, 1]],
      [[-1, 1], [1, -1]],
    ],
  },
  {
    id: "oan-tu-ti",
    title: "Oẳn tù tì",
    story: "Búa thắng kéo, kéo thắng bao, bao thắng búa.",
    lesson: "Cân bằng duy nhất là chọn mỗi loại 1/3. Mọi thói quen đều có thể bị khai thác.",
    players: ["A", "B"],
    rows: ["Búa", "Kéo", "Bao"],
    cols: ["Búa", "Kéo", "Bao"],
    payoffs: [
      [[0, 0], [1, -1], [-1, 1]],
      [[-1, 1], [0, 0], [1, -1]],
      [[1, -1], [-1, 1], [0, 0]],
    ],
  },
  {
    id: "chuan-cong-nghe",
    title: "Chọn chuẩn công nghệ",
    story:
      "Hai hãng chọn chuẩn kết nối. Cùng chuẩn X (tốt hơn) thì lợi nhất, cùng chuẩn Y vẫn ổn, khác chuẩn thì cả hai thiệt.",
    lesson:
      "Cả hai cùng chuẩn đều là cân bằng. Thị trường có thể bị \"kẹt\" ở lựa chọn kém hơn nếu ai cũng đợi người kia.",
    players: ["Hãng A", "Hãng B"],
    rows: ["Chuẩn X", "Chuẩn Y"],
    cols: ["Chuẩn X", "Chuẩn Y"],
    payoffs: [
      [[2, 2], [0, 0]],
      [[0, 0], [1, 1]],
    ],
  },
  {
    id: "be-tac",
    title: "Bế tắc",
    story: "Hai bên đều thực sự thích đối đầu hơn hợp tác, dù đối phương làm gì.",
    lesson:
      "Không phải xung đột nào cũng là \"song đề tù nhân\". Ở đây đối đầu là lựa chọn tốt nhất cho cả hai, nên kêu gọi hợp tác vô ích.",
    players: ["Bên A", "Bên B"],
    rows: ["Hợp tác", "Đối đầu"],
    cols: ["Hợp tác", "Đối đầu"],
    payoffs: [
      [[1, 1], [0, 3]],
      [[3, 0], [2, 2]],
    ],
  },
  {
    id: "loai-tru-lap",
    title: "Loại trừ từng bước",
    story: "Một bài luyện kỹ năng: gạch dần những lựa chọn không bao giờ đáng chọn.",
    lesson:
      "B không bao giờ chọn \"Phải\". Biết vậy, A bỏ \"Dưới\". Biết A bỏ \"Dưới\", B bỏ \"Trái\". Còn lại một kết quả duy nhất.",
    players: ["A", "B"],
    rows: ["Trên", "Dưới"],
    cols: ["Trái", "Giữa", "Phải"],
    payoffs: [
      [[1, 0], [1, 2], [0, 1]],
      [[0, 3], [0, 1], [2, 0]],
    ],
  },
  {
    id: "dieu-hau-bo-cau",
    title: "Diều hâu – Bồ câu",
    story:
      "Hai bên tranh một miếng mồi giá trị 4. Đánh nhau tốn 6. Hung hăng gặp nhường thì lấy hết, cùng nhường thì chia đôi.",
    lesson:
      "Trong một quần thể, tỷ lệ \"hung hăng\" ổn định ở giá trị mồi / chi phí đánh nhau = 4/6 = 2/3.",
    players: ["A", "B"],
    rows: ["Hung hăng", "Nhường"],
    cols: ["Hung hăng", "Nhường"],
    payoffs: [
      [[-1, -1], [4, 0]],
      [[0, 4], [2, 2]],
    ],
  },
];
