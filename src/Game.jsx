import React, { useEffect, useState } from "react";
import useDetectTouch from "./Hook/Detect";
import EndGame from "./Components/EndGame";
import ButtonBottom from "./Components/ButtonBottom";

const STATE = {
  NEW: "new",
  Wiped: "wiped",
  Empty: "empty",
};

const generateGrid = (init, columns, rows) => {
  const grid = [];
  const size = init * columns;
  for (let i = 0; i < size; i++) {
    grid.push({
      id: i,
      num: Math.floor(Math.random() * 9) + 1,
      state: STATE.NEW,
    }); // Random numbers between 1 and 9
  }
  if (rows) {
    for (let i = 0; i < columns * rows - size; i++) {
      grid.push({ id: -1, num: 0, state: STATE.Empty }); // Empty
    }
  }
  return grid;
};

const Game = ({ columns, rows }) => {
  const isTouch = useDetectTouch();
  const [grid, setGrid] = useState(generateGrid(4, columns, rows));
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(1);
  const [hintCount, setHintCount] = useState(3);
  const [isVictory, setIsVictory] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [wrongSelection, setWrongSelection] = useState(false);
  const [selected, setSelected] = useState([]);
  const targetSum = 10;

  const isAdjacent = (id1, id2) => {
    const index1 = grid.find((cell) => cell.id === id1).id;
    const index2 = grid.find((cell) => cell.id === id2).id;
    if (index1 === index2) return false;

    const [row1, col1] = [Math.floor(index1 / columns), index1 % columns];
    const [row2, col2] = [Math.floor(index2 / columns), index2 % columns];

    // check if is consecutive available
    const row1Cells = grid.filter(
      (cell) =>
        Math.floor(cell.id / columns) === row1 && cell.state === STATE.NEW
    );

    // is the first or last cell
    if (row1Cells.length > 0) {
      if (row1Cells[0]?.id === id1) {
        // row before
        const rowBefore = grid.filter(
          (cell) =>
            Math.floor(cell.id / columns) === row1 - 1 &&
            cell.state === STATE.NEW
        );
        if (row1 > row2) {
          if (
            rowBefore.length > 0 &&
            rowBefore[rowBefore.length - 1]?.id === id2
          )
            return true;
        } else {
          if (rowBefore.length > 0 && rowBefore[0]?.id === id2) return true;
        }
      }
      if (row1Cells[row1Cells.length - 1]?.id === id1) {
        // row after
        const rowAfter = grid.filter(
          (cell) =>
            Math.floor(cell.id / columns) === row1 + 1 &&
            cell.state === STATE.NEW
        );
        if (row1 > row2) {
          if (rowAfter.length > 0 && rowAfter[rowAfter.length - 1]?.id === id2)
            return true;
        } else {
          if (rowAfter.length > 0 && rowAfter[0]?.id === id2) return true;
        }
      }
    }

    // Define maximum row and column indices
    const maxRow = rows - 1;
    const maxCol = columns - 1;

    // Define directions
    const directions = [
      { dRow: -1, dCol: 0 }, // Up
      { dRow: 1, dCol: 0 }, // Down
      { dRow: 0, dCol: -1 }, // Left
      { dRow: 0, dCol: 1 }, // Right
      { dRow: -1, dCol: -1 }, // Up-Left
      { dRow: -1, dCol: 1 }, // Up-Right
      { dRow: 1, dCol: -1 }, // Down-Left
      { dRow: 1, dCol: 1 }, // Down-Right
    ];

    // Collect grid values in all directions
    const adjacentValues = [];
    directions.forEach(({ dRow, dCol }, directionIndex) => {
      let row = row1 + dRow;
      let col = col1 + dCol;
      while (row >= 0 && row <= maxRow && col >= 0 && col <= maxCol) {
        const index = row * columns + col;
        //if (grid[index].state === STATE.NEW) {
        adjacentValues.push({ ...grid[index], directions: directionIndex });
        //}
        row += dRow;
        col += dCol;
      }
    });

    // check id1 is in adjacentValues and check if is the more close in direction of id2
    // Check if id1 is in adjacentValues
    if (adjacentValues.findIndex((cell) => cell.id === id2) === -1)
      return false;

    // Check if id1 is the closest cell in the direction of id1
    const direction = adjacentValues.find((cell) => cell.id === id2).directions;

    const dRow = directions[direction].dRow;
    const dCol = directions[direction].dCol;
    let currentRow = row1 + dRow;
    let currentCol = col1 + dCol;
    while (
      currentRow >= 0 &&
      currentRow <= maxRow &&
      currentCol >= 0 &&
      currentCol <= maxCol
    ) {
      const currentIndex = currentRow * columns + currentCol;
      if (currentIndex === index2) {
        return true;
      } else if (grid[currentIndex].state !== STATE.NEW) {
        currentRow += dRow;
        currentCol += dCol;
      } else {
        break;
      }
    }
    return false;
  };

  const handleSelect = (index) => {
    if (index === -1) return;
    if (grid.find((num) => num.id === index).state !== STATE.NEW) return;
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      if (selected.length === 0) {
        setSelected([index]);
      } else if (selected.length === 1) {
        if (isAdjacent(selected[0], index)) {
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
    if (selected.length === 2) {
      const sum = selected.reduce(
        (acc, curr) => acc + grid.find((num) => num.id === curr).num,
        0
      );
      const allSameNumber = selected.reduce((acc, curr) => {
        if (acc === 0) return grid.find((num) => num.id === curr).num;
        else if (acc === grid.find((num) => num.id === curr).num) return -1;
        else return 0;
      }, 0);
      if (sum === targetSum || allSameNumber === -1) {
        const newGrid = [...grid];
        newGrid.map((num, idx) => {
          //num.num = selected.includes(idx) ? 0 : num.num;
          num.state = selected.includes(num.id) ? STATE.Wiped : num.state;
          return num;
        });
        setGrid(newGrid);
        setWrongSelection(false);
        setSelected([]);
      } else {
        setWrongSelection(true);
        setTimeout(() => {
          setWrongSelection(false);
          setSelected([]);
        }, 500);
      }
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
    console.log("GAME OVER: ", isGameOver);
  };

  useEffect(() => {
    checkSum();
    checkEmptyRows();
    checkVictory();
  }, [selected]);

  // TODO: calulate score

  // TODO: calculate hint

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex space-x-4 w-full justify-between flex">
        <p className="p-4 font-bold text-xl">Phase: {phase}</p>
        <p className="p-4 font-bold text-xl">Score: {score}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 w-full h-3/4 overflow-y-auto">
        <div className="flex justify-center items-center h-screen pt-4 bg-white">
          <div
            className={`grid border-2 border-gray-400`}
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(15px, 40px))`,
            }}
          >
            {grid.map((num, index) => (
              <div
                key={index}
                className={`flex justify-center w-full items-center border border-gray-300 cursor-pointer select-none text-lg font-semibold 
            ${
              selected.includes(num?.id)
                ? wrongSelection
                  ? "bg-red-300 hover:bg-red-300"
                  : "bg-blue-300 hover:bg-blue-300"
                : ""
            }
            ${
              num?.state !== STATE.Wiped
                ? "hover:border-2 hover:bg-gray-50"
                : "bg-gray-50 text-gray-200"
            }
          `}
                style={{
                  height: "auto",
                  minHeight: "40px",
                  maxHeight: "calc(40px / columns)",
                }}
                onTouchStart={() => isTouch && handleSelect(num?.id)}
                onClick={() => !isTouch && handleSelect(num?.id)}
              >
                {num?.num ? num?.num : ""}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EndGame
        isVictory={isVictory}
        isGameOver={isGameOver}
        score={score}
        phase={phase}
      />
      <ButtonBottom
        handleAddNumbers={handleAddNumbers}
        hintCount={hintCount}
        phase={phase}
      />
    </div>
  );
};

export default Game;
