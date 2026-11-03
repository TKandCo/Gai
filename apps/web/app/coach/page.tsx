import type { Metadata } from "next";
import { CoachClient } from "./CoachClient";

export const metadata: Metadata = { title: "Hỏi Gai" };

export default function CoachPage() {
  return <CoachClient />;
}
