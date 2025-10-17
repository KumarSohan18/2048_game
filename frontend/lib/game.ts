export type Direction = "up" | "down" | "left" | "right";

export type GameState = {
  grid: number[][];
  score: number;
  won: boolean;
  over: boolean;
  size: number;
};

export function createEmptyGrid(size: number): number[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}

function getEmptyCells(grid: number[][]): Array<[number, number]> {
  const empties: Array<[number, number]> = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 0) empties.push([r, c]);
    }
  }
  return empties;
}

function addRandomTile(grid: number[][], rng: () => number): number[][] {
  const empties = getEmptyCells(grid);
  if (empties.length === 0) return grid;
  const [r, c] = empties[Math.floor(rng() * empties.length)];
  const value = rng() < 0.9 ? 2 : 4;
  const next = grid.map(row => row.slice());
  next[r][c] = value;
  return next;
}

export function initialize(size = 4, seedRng: () => number = Math.random): GameState {
  const empty = createEmptyGrid(size);
  const withOne = addRandomTile(empty, seedRng);
  const withTwo = addRandomTile(withOne, seedRng);
  return { grid: withTwo, score: 0, won: false, over: false, size };
}

function slideAndMergeLine(line: number[]): { line: number[]; gained: number } {
  const nonZero = line.filter(v => v !== 0);
  const merged: number[] = [];
  let gained = 0;
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const sum = nonZero[i] + nonZero[i + 1];
      merged.push(sum);
      gained += sum;
      i++; // skip next
    } else {
      merged.push(nonZero[i]);
    }
  }
  while (merged.length < line.length) merged.push(0);
  return { line: merged, gained };
}

function transpose(grid: number[][]): number[][] {
  const size = grid.length;
  return Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => grid[c][r]));
}

function reverseRows(grid: number[][]): number[][] {
  return grid.map(row => row.slice().reverse());
}

function moveGrid(grid: number[][], direction: Direction): { grid: number[][]; gained: number } {
  let working = grid;
  if (direction === "up") {
    working = transpose(working);
  } else if (direction === "down") {
    working = transpose(reverseRows(working));
  } else if (direction === "right") {
    working = reverseRows(working);
  }

  let gained = 0;
  const moved = working.map(row => {
    const { line, gained: g } = slideAndMergeLine(row);
    gained += g;
    return line;
  });

  let restored = moved;
  if (direction === "up") {
    restored = transpose(moved);
  } else if (direction === "down") {
    restored = reverseRows(transpose(moved));
  } else if (direction === "right") {
    restored = reverseRows(moved);
  }
  return { grid: restored, gained };
}

function gridsEqual(a: number[][], b: number[][]): boolean {
  for (let r = 0; r < a.length; r++) {
    for (let c = 0; c < a[r].length; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function hasMoves(grid: number[][]): boolean {
  if (getEmptyCells(grid).length > 0) return true;
  const size = grid.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = grid[r][c];
      if ((r + 1 < size && grid[r + 1][c] === v) || (c + 1 < size && grid[r][c + 1] === v)) return true;
    }
  }
  return false;
}

export function step(state: GameState, direction: Direction, rng: () => number = Math.random): GameState {
  if (state.over || state.won) return state;
  const { grid: moved, gained } = moveGrid(state.grid, direction);
  if (gridsEqual(moved, state.grid)) return state; // no move
  const withNew = addRandomTile(moved, rng);
  const won = withNew.some(row => row.some(v => v === 2048)) || state.won;
  const over = !hasMoves(withNew) || won;
  return {
    grid: withNew,
    score: state.score + gained,
    won,
    over,
    size: state.size
  };
}

export function restart(size: number, rng: () => number = Math.random): GameState {
  return initialize(size, rng);
}

