import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { LabClient } from "./LabClient";

export const metadata: Metadata = { title: "Phòng lab ma trận" };

export default function LabPage() {
  return (
    <main className="px-4">
      <PageHeader title="Phòng lab ma trận" subtitle="Chọn một trò chơi mẫu hoặc tự tạo, rồi chạm để chỉnh số." />
      <LabClient />
    </main>
  );
}
