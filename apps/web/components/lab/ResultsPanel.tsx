import { formatNumber, formatPercent, toFraction, type NormalFormSolution } from "@gai/gt-core";
import type { LabGame } from "@/lib/lab";

/** Giải thích kết quả bằng lời, theo thứ tự người mới dễ hiểu nhất. */
export function ResultsPanel({ game, solution }: { game: LabGame; solution: NormalFormSolution }) {
  const [P1, P2] = game.players;
  const { dominant, dominance, pureNash, equilibria } = solution;
  const mixed = equilibria.filter((e) => !e.pure);

  return (
    <div className="space-y-3">
      <Card title="Cân bằng Nash" hint="Không bên nào muốn tự đổi lựa chọn khi bên kia giữ nguyên.">
        {pureNash.length === 0 && mixed.length === 0 && (
          <p className="text-sm text-muted">Không tìm thấy cân bằng (trò chơi có nhiều kết quả hòa, hãy chỉnh số khác nhau hơn).</p>
        )}
        <ul className="space-y-2">
          {pureNash.map(([i, j]) => (
            <li key={`${i}-${j}`} className="rounded-xl bg-nash-soft p-3 text-sm">
              <div className="font-semibold">
                ★ <span className="text-p1">{game.rows[i]}</span> + <span className="text-p2">{game.cols[j]}</span>
              </div>
              <div className="mt-1 text-muted">
                {P1} được <b className="text-p1">{formatNumber(game.payoffs[i][j][0])}</b>, {P2} được{" "}
                <b className="text-p2">{formatNumber(game.payoffs[i][j][1])}</b>. Đổi riêng một mình, không ai được hơn.
              </div>
            </li>
          ))}
          {mixed.map((e, k) => (
            <li key={`m${k}`} className="rounded-xl bg-surface-2 p-3 text-sm">
              <div className="font-semibold">Chiến lược hỗn hợp (chọn ngẫu nhiên có tỷ lệ)</div>
              <MixLine name={P1} labels={game.rows} probs={e.x} tone="text-p1" />
              <MixLine name={P2} labels={game.cols} probs={e.y} tone="text-p2" />
              <div className="mt-1 text-muted">
                Lợi ích kỳ vọng: {P1} <b className="text-p1">{formatNumber(e.payoffs[0])}</b>, {P2}{" "}
                <b className="text-p2">{formatNumber(e.payoffs[1])}</b>
              </div>
            </li>
          ))}
        </ul>
        {mixed.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            Tỷ lệ hỗn hợp được chọn sao cho <b>đối phương</b> thấy các lựa chọn của họ tốt ngang nhau, nên không khai thác được bạn.
          </p>
        )}
      </Card>

      {(dominant[0] !== null || dominant[1] !== null) && (
        <Card title="Chiến lược trội" hint="Tốt hơn mọi lựa chọn khác, dù đối phương làm gì.">
          <ul className="space-y-1 text-sm">
            {dominant[0] !== null && (
              <li>
                {P1}: luôn nên chọn <b className="text-p1">{game.rows[dominant[0]]}</b>
              </li>
            )}
            {dominant[1] !== null && (
              <li>
                {P2}: luôn nên chọn <b className="text-p2">{game.cols[dominant[1]]}</b>
              </li>
            )}
          </ul>
        </Card>
      )}

      <Card title="Gạch bỏ lựa chọn tệ" hint="Lặp lại: bỏ lựa chọn luôn thua một lựa chọn khác.">
        {dominance.steps.length === 0 ? (
          <p className="text-sm text-muted">Không có lựa chọn nào luôn thua hẳn lựa chọn khác. Cần phân tích sâu hơn.</p>
        ) : (
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            {dominance.steps.map((s, k) => {
              const isRow = s.player === 0;
              const who = isRow ? P1 : P2;
              const labels = isRow ? game.rows : game.cols;
              const tone = isRow ? "text-p1" : "text-p2";
              return (
                <li key={k}>
                  {who} bỏ <b className={tone}>{labels[s.removed]}</b> vì <b className={tone}>{labels[s.dominatedBy]}</b> luôn tốt
                  hơn{k > 0 ? " (trong các lựa chọn còn lại)" : ""}.
                </li>
              );
            })}
          </ol>
        )}
        {dominance.remainingRows.length === 1 && dominance.remainingCols.length === 1 && (
          <p className="mt-2 rounded-lg bg-accent-soft p-2 text-sm">
            Chỉ còn một kết quả: <b className="text-p1">{game.rows[dominance.remainingRows[0]]}</b> +{" "}
            <b className="text-p2">{game.cols[dominance.remainingCols[0]]}</b>.
          </p>
        )}
      </Card>
    </div>
  );
}

function MixLine({ name, labels, probs, tone }: { name: string; labels: string[]; probs: number[]; tone: string }) {
  const parts = labels.map((l, k) => ({ l, p: probs[k] })).filter((x) => x.p > 1e-9);
  return (
    <div className="mt-1">
      <span className="text-muted">{name}: </span>
      {parts.map((x, k) => (
        <span key={k}>
          {k > 0 && " · "}
          <b className={tone}>{x.l}</b> {formatPercent(x.p)}
          <span className="text-muted"> ({toFraction(x.p)})</span>
        </span>
      ))}
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mb-3 text-xs text-muted">{hint}</p>
      {children}
    </section>
  );
}
