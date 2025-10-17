"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Direction, GameState, initialize, restart, step } from "@/lib/game";

function useGame(initialSize: number) {
  const [state, setState] = useState<GameState | null>(null);
  const [size, setSize] = useState<number>(initialSize);

  useEffect(() => {
    setState(initialize(size));
  }, [size]);

  const doMove = useCallback(
    (dir: Direction) => setState((s) => (s ? step(s, dir) : s)),
    []
  );
  const doRestart = useCallback(() => setState(restart(size)), [size]);

  return { state, size, setSize, doMove, doRestart } as const;
}

function valueToColor(value: number): string {
  if (value === 0) return "#2a2a2a";
  const map: Record<number, string> = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  return map[value] ?? "#3c3c3c";
}

export default function Page() {
  const { state, size, setSize, doMove, doRestart } = useGame(4);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        doMove(dir);
      }
    };
    window.addEventListener("keydown", onKey, { passive: false } as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [doMove]);

  const gridTemplate = useMemo(
    () => ({ gridTemplateColumns: `repeat(${state?.size || 4}, 1fr)` }),
    [state?.size]
  );

  const status = state?.won
    ? "You reached 2048!"
    : state?.over
    ? "No more moves."
    : "";

  // Show loading state until game is initialized
  if (!state) {
    return (
      <div className="container">
        <div className="header">
          <h1>2048</h1>
        </div>
        <div className="grid" style={gridTemplate}>
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="cell" style={{ background: "#2a2a2a" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>2048</h1>
        <div className="meta">
          <span className="tag">Score: {state.score}</span>
          <label className="tag">
            Size:
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ marginLeft: 8 }}
            >
              {[3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  {s}x{s}
                </option>
              ))}
            </select>
          </label>
          <button className="button" onClick={doRestart}>
            Restart
          </button>
        </div>
      </div>

      {status && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <span className={state.won ? "good" : "warn"}>{status}</span>
        </div>
      )}

      <div
        className="grid"
        style={gridTemplate}
        role="grid"
        aria-label="2048 board"
      >
        {state.grid.map((row, r) =>
          row.map((value, c) => (
            <div
              className="cell"
              role="gridcell"
              key={`${r}-${c}-${value}`}
              style={{
                background: valueToColor(value),
                color: value <= 4 ? "#222" : "#fff",
              }}
            >
              {value !== 0 ? value : ""}
            </div>
          ))
        )}
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="controls">
          <button className="button" onClick={() => doMove("up")}>
            Up ↑
          </button>
          <button className="button" onClick={() => doMove("left")}>
            Left ←
          </button>
          <button className="button" onClick={() => doMove("down")}>
            Down ↓
          </button>
          <button className="button" onClick={() => doMove("right")}>
            Right →
          </button>
        </div>
      </div>
    </div>
  );
}
