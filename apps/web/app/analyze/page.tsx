import type { Metadata } from "next";
import { AnalyzeClient } from "./AnalyzeClient";

export const metadata: Metadata = { title: "Phân tích sự kiện" };

export default function AnalyzePage() {
  return <AnalyzeClient />;
}
