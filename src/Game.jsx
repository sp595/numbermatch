import React, { useEffect, useState } from "react";
import EndGame from "./Components/EndGame";
import ButtonBottom from "./Components/ButtonBottom";
import HeaderTop from "./Components/HeaderTop";
import {
  STATE,
  calculateHints,
  checkSumCore,
  generateGrid,
  isAdjacent,
  targetSum,
} from "./Hook/Logic";
import GridGame from "./Components/GridGame";

const Game = ({ columns, rows }) => {
  const [grid, setGrid] = useState(generateGrid(4, columns, rows));
  const [selected, setSelected] = useState([]);
  const [selectedHint, setSelectedHint] = useState([]);
  const [hintCount, setHintCount] = useState(3);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(1);
  const [isVictory, setIsVictory] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wrongSelection, setWrongSelection] = useState(false);

  const handleSelect = (index) => {
    if (index === -1) return;
    if (grid.find((num) => num.id === index).state !== STATE.NEW) return;
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      if (selected.length === 0) {
        setSelected([index]);
      } else if (selected.length === 1) {
        if (isAdjacent(selected[0], index, grid)) {
          setSelected([...selected, index]);
        } else {
          setWrongSelection(true);
          setTimeout(() => {
            setWrongSelection(false);
            setSelected([]);
          }, 500);
        }
      }
    }
  };

  const checkSum = () => {
    if (selected.length !== 2) return;
    if (selectedHint.length === 2) setSelectedHint([]);
    if (checkSumCore(selected, grid)) {
      const newGrid = [...grid];
      newGrid.map((num, idx) => {
        //num.num = selected.includes(idx) ? 0 : num.num;
        num.state = selected.includes(num.id) ? STATE.Wiped : num.state;
        return num;
      });
      setGrid(newGrid);
      // calculate score
      calculateScore(grid, selected);
      setWrongSelection(false);
      setSelected([]);
    } else {
      setWrongSelection(true);
      setTimeout(() => {
        setWrongSelection(false);
        setSelected([]);
      }, 500);
    }
  };

  const checkEmptyRows = () => {
    const newGrid = [...grid];
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
        setGrid(newGrid);
        // update score
        setScore((current) => columns * 2 + current);
      }
    }
  };

  const handleAddNumbers = () => {
    checkGameOver();
    const newGrid = grid.filter((num) => num.state === STATE.NEW);
    let lastCellIndex = Math.max(...grid.map((cell) => cell.id)); // Find the highest existing ID
    let newCells = [];
    newGrid.forEach((cell, index) => {
      newCells.push({
        ...cell,
        id: lastCellIndex + index + 1,
      });
    });
    const newNewGrid = [
      ...grid.filter((cell) => cell.state !== STATE.Empty),
      ...newCells,
      ...grid.filter((cell) => cell.state === STATE.Empty),
    ];
    setGrid(newNewGrid);
    setPhase((curr) => curr + 1);
  };

  const checkVictory = () => {
    // Verifica se nessun elemento nella griglia ha lo stato NEW
    const condition = !grid.some((cell) => cell.state === STATE.NEW);
    setIsVictory(condition);
  };

  const checkGameOver = () => {
    setIsGameOver(phase == 5);
  };

  const calculateScore = (grid, selected) => {
    // check the distance between index1 and index2
    const index1 = grid.find((cell) => cell.id === selected[0]).id;
    const index2 = grid.find((cell) => cell.id === selected[1]).id;
    if (index1 === index2) return false;

    const [row1, col1] = [Math.floor(index1 / columns), index1 % columns];
    const [row2, col2] = [Math.floor(index2 / columns), index2 % columns];

    const thisScore = Math.max(Math.abs(col1 - col2), Math.abs(row1 - row2));

    setScore((current) => current + thisScore);
  };

  const useHint = () => {
    if (hintCount > 0) {
      const combinations = calculateHints(grid);
      if (combinations.length === 0) return false;

      setHintCount(hintCount - 1);

      // get random from hints array and set as selected bounging
      const randomIndex = Math.floor(Math.random() * combinations.length);
      setSelectedHint(combinations[randomIndex]);
      return true;
    }
  };

  useEffect(() => {
    checkSum();
    checkEmptyRows();
    checkVictory();
  }, [selected]);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen touch-none">
      <HeaderTop phase={phase} score={score} />

      <GridGame
        grid={grid}
        handleSelect={handleSelect}
        columns={columns}
        selected={selected}
        selectedHint={selectedHint}
        wrongSelection={wrongSelection}
      />

      <EndGame
        isVictory={isVictory}
        isGameOver={isGameOver}
        score={score}
        phase={phase}
      />

      <ButtonBottom
        handleAddNumbers={handleAddNumbers}
        useHint={useHint}
        hintCount={hintCount}
        phase={phase}
      />
    </div>
  );
};

export default Game;
