import type { Metadata } from "next";
import { LearnHome } from "./LearnHome";

export const metadata: Metadata = { title: "Lộ trình học" };

export default function LearnPage() {
  return <LearnHome />;
}
