import React, { useEffect } from "react";
import EndGame from "./Components/EndGame";
import ButtonBottom from "./Components/ButtonBottom";
import HeaderTop from "./Components/HeaderTop";
import GridGame from "./Components/GridGame";
import { useDispatch, useSelector } from "react-redux";
import {
  createGrid,
  handleSelect,
  checkSum,
  checkEmptyRows,
  handleAddNumbers,
  checkVictory,
  useHint,
} from "./features/gameSlice";

const Game = ({ columns, rows }) => {
  const dispatch = useDispatch();
  const grid = useSelector((state) => state.game.grid);
  const selected = useSelector((state) => state.game.selected);
  const selectedHint = useSelector((state) => state.game.selectedHint);
  const hintCount = useSelector((state) => state.game.hintCount);
  const score = useSelector((state) => state.game.score);
  const phase = useSelector((state) => state.game.phase);
  const isVictory = useSelector((state) => state.game.isVictory);
  const isGameOver = useSelector((state) => state.game.isGameOver);
  const wrongSelection = useSelector((state) => state.game.wrongSelection);

  const handleSelectClick = (index) => {
    dispatch(handleSelect({ index }));
  };

  useEffect(() => {
    dispatch(createGrid({ columns, rows }));
  }, [dispatch, columns, rows]);

  useEffect(() => {
    dispatch(checkSum());
    dispatch(checkEmptyRows({ columns, rows }));
    dispatch(checkVictory());
  }, [selected, dispatch]);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen h-dvh touch-none">
      <HeaderTop phase={phase} score={score} record={score} />

      <GridGame
        grid={grid}
        handleSelect={handleSelectClick}
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
        handleAddNumbers={() => dispatch(handleAddNumbers())}
        useHint={() => dispatch(useHint())}
        hintCount={hintCount}
        phase={phase}
      />
    </div>
  );
};

export default Game;
