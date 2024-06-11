import { configureStore } from "@reduxjs/toolkit";
import gameSlice from "../features/gameSlice";

export default configureStore({
  reducer: {
    game: gameSlice,
  },
});
