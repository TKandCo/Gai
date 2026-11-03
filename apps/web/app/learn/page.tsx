import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Lộ trình học" };

export default function LearnPage() {
  return (
    <ComingSoon
      title="Lộ trình học"
      phase="P1"
      body="Bắt đầu bằng bài kiểm tra xếp lớp, sau đó học Nền tảng toán, Tư duy quyết định, Trò chơi đồng thời và Trò chơi tuần tự. Mỗi ngày một phiên luyện 10 phút."
    />
  );
}
