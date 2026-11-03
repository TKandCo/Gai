import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { HelpButton } from "@/components/Help";
import { LabClient } from "./LabClient";

export const metadata: Metadata = { title: "Phòng lab" };

const HELP = [
  { icon: "👆", text: "Chọn một trò chơi mẫu ở hàng nút trên cùng, hoặc bấm \"+ Trống\" để tự tạo." },
  { icon: "🔢", text: "Chạm vào một ô để đổi số. Số xanh là điểm của người chọn hàng, số cam là điểm của người chọn cột." },
  { icon: "✏️", text: "Chạm vào tên người chơi hoặc tên lựa chọn để đổi tên. Có thể thêm tối đa 4 lựa chọn." },
  { icon: "⭐", text: "Ô viền vàng có ngôi sao là cân bằng Nash: không ai muốn tự đổi lựa chọn." },
  { icon: "📖", text: "Kéo xuống dưới để đọc giải thích bằng lời: ai nên làm gì và vì sao." },
];

export default function LabPage() {
  return (
    <main className="px-4">
      <PageHeader
        title="Phòng lab"
        subtitle="Chọn trò chơi mẫu hoặc tự tạo, rồi chạm để đổi số."
        right={<HelpButton id="lab" title="Cách dùng Phòng lab" steps={HELP} />}
      />
      <LabClient />
    </main>
  );
}
