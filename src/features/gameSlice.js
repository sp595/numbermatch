// features/gameSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  generateGrid,
  STATE,
  calculateHints,
  checkSumCore,
  isAdjacent,
} from "../Hook/Logic";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    grid: [],
    selected: [],
    selectedHint: [],
    hintCount: 3,
    score: 0,
    phase: 1,
    isVictory: false,
    isGameOver: false,
    wrongSelection: false,
  },
  reducers: {
    createGrid: (state, action) => {
      state.grid = generateGrid(4, action.payload.columns, action.payload.rows);
    },
    setGrid: (state, action) => {
      state.grid = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setSelectedHint: (state, action) => {
      state.selectedHint = action.payload;
    },
    setHintCount: (state, action) => {
      state.hintCount = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setPhase: (state, action) => {
      state.phase = action.payload;
    },
    setIsVictory: (state, action) => {
      state.isVictory = action.payload;
    },
    setIsGameOver: (state, action) => {
      state.isGameOver = action.payload;
    },
    setWrongSelection: (state, action) => {
      state.wrongSelection = action.payload;
    },
    handleSelect: (state, action) => {
      const { index } = action.payload;
      if (index === -1) return;
      if (state.grid.find((num) => num.id === index).state !== STATE.NEW)
        return;
      if (state.selected.includes(index)) {
        state.selected = state.selected.filter((i) => i !== index);
      } else {
        if (state.selected.length === 0) {
          state.selected = [index];
        } else if (state.selected.length === 1) {
          if (isAdjacent(state.selected[0], index, state.grid)) {
            state.selected = [...state.selected, index];
          } else {
            state.wrongSelection = true;
            setTimeout(() => {
              state.wrongSelection = false;
              state.selected = [];
            }, 500);
          }
        }
      }
    },
    checkSum: (state) => {
      if (state.selected.length !== 2) return;
      if (state.selectedHint.length === 2) state.selectedHint = [];
      if (checkSumCore(state.selected, state.grid)) {
        const newGrid = [...state.grid];
        newGrid.map((num, idx) => {
          num.state = state.selected.includes(num.id) ? STATE.Wiped : num.state;
          return num;
        });
        state.grid = newGrid;
        // calculate score
        calculateScore(state, state.selected);
      } else {
        state.wrongSelection = true;
      }
      //setTimeout(() => {
      state.wrongSelection = false;
      state.selected = [];
      //}, 400);
    },
    checkEmptyRows: (state, action) => {
      const { rows, columns } = action.payload;
      const newGrid = [...state.grid];
      for (let i = 0; i < rows; i++) {
        const rowStart = i * columns;
        const rowEnd = rowStart + columns;
        const row = newGrid.slice(rowStart, rowEnd);
        if (!row.some((num) => num.state !== STATE.Wiped)) {
          // If the row contains no numbers, remove it
          newGrid.splice(rowStart, columns);
          newGrid.map((cell, index) =>
            cell.state !== STATE.Empty ? (cell.id = index) : null
          );
          state.grid = newGrid;
          // update score
          state.score += columns * 2;
        }
      }
    },
    handleAddNumbers: (state) => {
      if (state.phase === 5) {
        state.isGameOver = true;
      }
      const newGrid = state.grid.filter((num) => num.state === STATE.NEW);
      let lastCellIndex = Math.max(...state.grid.map((cell) => cell.id)); // Find the highest existing ID
      let newCells = [];
      newGrid.forEach((cell, index) => {
        newCells.push({
          ...cell,
          id: lastCellIndex + index + 1,
        });
      });
      const newNewGrid = [
        ...state.grid.filter((cell) => cell.state !== STATE.Empty),
        ...newCells,
        ...state.grid.filter((cell) => cell.state === STATE.Empty),
      ];
      state.grid = newNewGrid;
      state.phase += 1;
    },
    checkVictory: (state) => {
      const condition = !state.grid.some((cell) => cell.state === STATE.NEW);
      state.isVictory = condition;
    },
    useHint: (state) => {
      if (state.hintCount > 0) {
        const combinations = calculateHints(state.grid);
        if (combinations.length === 0) return false;
        state.hintCount -= 1;
        const randomIndex = Math.floor(Math.random() * combinations.length);
        state.selectedHint = combinations[randomIndex];
      }
    },
    calculateScore: (state, action) => {
      const { grid, selected } = action.payload;
      const index1 = grid.find((cell) => cell.id === selected[0]).id;
      const index2 = grid.find((cell) => cell.id === selected[1]).id;
      if (index1 === index2) return false;
      const [row1, col1] = [
        Math.floor(index1 / state.columns),
        index1 % state.columns,
      ];
      const [row2, col2] = [
        Math.floor(index2 / state.columns),
        index2 % state.columns,
      ];
      const thisScore = Math.max(Math.abs(col1 - col2), Math.abs(row1 - row2));
      state.score += thisScore;
    },
  },
});

export const {
  createGrid,
  setGrid,
  setSelected,
  setSelectedHint,
  setHintCount,
  setScore,
  setPhase,
  setIsVictory,
  setIsGameOver,
  setWrongSelection,
  handleSelect,
  checkSum,
  checkEmptyRows,
  handleAddNumbers,
  checkVictory,
  useHint,
  calculateScore,
} = gameSlice.actions;

export default gameSlice.reducer;
