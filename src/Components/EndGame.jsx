import { XCircleIcon, TrophyIcon } from "@heroicons/react/24/solid";

const EndGame = ({ isVictory, isGameOver, score, phase }) =>
  (isVictory || isGameOver) && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex flex-col items-center">
          {isVictory && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-center">Victory!</h2>
              <TrophyIcon className="animate-bounce text-yellow-500 w-24 h-24 mb-4" />
              <p className="text-lg mb-2">
                Score: <span id="victory-score">{score}</span>
              </p>
              <p className="text-lg mb-4">
                Phases: <span id="victory-phase">{phase}</span>
              </p>
            </>
          )}
          {isGameOver && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Game Over!
              </h2>
              <XCircleIcon className="animate-bounce text-red-500 w-24 h-24 mb-4" />
            </>
          )}
          <button
            id="close-popup"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            New Game!
          </button>
        </div>
      </div>
    </div>
  );

export default EndGame;
