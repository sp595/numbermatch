export const targetSum = 10;
export const columns = 9;
export const rows = 15;

export const STATE = {
  NEW: "new",
  Wiped: "wiped",
  Empty: "empty",
};

export const generateGrid = (init, columns, rows) => {
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

export const isAdjacent = (id1, id2, grid) => {
  const index1 = grid.find((cell) => cell.id === id1).id;
  const index2 = grid.find((cell) => cell.id === id2).id;
  if (index1 === index2) return false;

  const [row1, col1] = [Math.floor(index1 / columns), index1 % columns];
  const [row2, col2] = [Math.floor(index2 / columns), index2 % columns];

  // check if is consecutive available
  const row1Cells = grid.filter(
    (cell) => Math.floor(cell.id / columns) === row1 && cell.state === STATE.NEW
  );

  // is the first or last cell
  if (row1Cells.length > 0) {
    if (row1Cells[0]?.id === id1) {
      // row before
      const rowBefore = grid.filter(
        (cell) =>
          Math.floor(cell.id / columns) === row1 - 1 && cell.state === STATE.NEW
      );
      if (row1 > row2) {
        if (rowBefore.length > 0 && rowBefore[rowBefore.length - 1]?.id === id2)
          return true;
      } else {
        if (rowBefore.length > 0 && rowBefore[0]?.id === id2) return true;
      }
    }
    if (row1Cells[row1Cells.length - 1]?.id === id1) {
      // row after
      const rowAfter = grid.filter(
        (cell) =>
          Math.floor(cell.id / columns) === row1 + 1 && cell.state === STATE.NEW
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
  if (adjacentValues.findIndex((cell) => cell.id === id2) === -1) return false;

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

export const checkSumCore = (selected, grid) => {
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
    return true;
  }
  return false;
};
