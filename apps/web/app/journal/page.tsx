import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Nhật ký dự đoán" };

export default function JournalPage() {
  return (
    <ComingSoon
      title="Nhật ký dự đoán"
      phase="P1"
      body="Ghi dự đoán có xác suất và thời hạn, ứng dụng nhắc bạn đối chiếu kết quả và chấm điểm độ chính xác (Brier score) theo thời gian."
    />
  );
}
