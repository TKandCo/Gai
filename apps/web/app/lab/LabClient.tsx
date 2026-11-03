"use client";

import { useEffect, useMemo, useState } from "react";
import { CLASSIC_GAMES, solveNormalForm } from "@gai/gt-core";
import {
  DEFAULT_GAME,
  addCol,
  addRow,
  blankGame,
  fromClassic,
  loadLab,
  removeCol,
  removeRow,
  rename,
  saveLab,
  setPayoff,
  toSchemaGame,
  type LabGame,
} from "@/lib/lab";
import { MatrixEditor, type EditTarget } from "@/components/lab/MatrixEditor";
import { EditSheet } from "@/components/lab/EditSheet";
import { ResultsPanel } from "@/components/lab/ResultsPanel";

export function LabClient() {
  const [game, setGame] = useState<LabGame>(DEFAULT_GAME);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [showBR, setShowBR] = useState(true);

  useEffect(() => {
    const saved = loadLab();
    if (saved) setGame(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveLab(game);
  }, [game, loaded]);

  const solution = useMemo(() => solveNormalForm(toSchemaGame(game)), [game]);
  const preset = CLASSIC_GAMES.find((c) => c.id === game.presetId);

  return (
    <div className="space-y-4">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CLASSIC_GAMES.map((c) => (
          <button
            key={c.id}
            onClick={() => setGame(fromClassic(c))}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
              game.presetId === c.id ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line bg-surface"
            }`}
          >
            {c.title}
          </button>
        ))}
        <button
          onClick={() => setGame(blankGame())}
          className="shrink-0 rounded-full border border-dashed border-line px-3 py-1.5 text-sm"
        >
          + Trống
        </button>
      </div>

      {preset ? (
        <section className="rounded-2xl bg-surface-2 p-4 text-sm leading-relaxed">
          <h2 className="mb-1 text-base font-semibold">{preset.title}</h2>
          <p>{preset.story}</p>
        </section>
      ) : (
        <section className="rounded-2xl bg-surface-2 p-4 text-sm">
          <h2 className="mb-1 text-base font-semibold">Tình huống tự tạo</h2>
          <p className="text-muted">Chạm vào ô để nhập lợi ích, chạm vào tên để đổi tên.</p>
        </section>
      )}

      <MatrixEditor
        game={game}
        solution={solution}
        showBestResponses={showBR}
        onEdit={setEditing}
        onAddRow={() => setGame(addRow)}
        onAddCol={() => setGame(addCol)}
      />

      <label className="flex items-center gap-2 px-1 text-sm text-muted">
        <input type="checkbox" checked={showBR} onChange={(e) => setShowBR(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
        Gạch chân phản ứng tốt nhất (ô có cả hai số gạch chân là cân bằng)
      </label>

      <ResultsPanel game={game} solution={solution} />

      {preset && (
        <section className="rounded-2xl border border-accent/40 bg-accent-soft p-4 text-sm leading-relaxed">
          <h3 className="mb-1 font-semibold">Bài học</h3>
          <p>{preset.lesson}</p>
        </section>
      )}

      <EditSheet
        game={game}
        target={editing}
        onClose={() => setEditing(null)}
        onPayoff={(i, j, who, v) => setGame((g) => setPayoff(g, i, j, who, v))}
        onRename={(t, idx, name) => setGame((g) => rename(g, t, idx, name))}
        onRemove={(t, idx) => setGame((g) => (t === "row" ? removeRow(g, idx) : removeCol(g, idx)))}
      />
    </div>
  );
}
