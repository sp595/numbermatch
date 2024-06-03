import {
  LightBulbIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const ButtonBottom = ({ handleAddNumbers, useHint, hintCount, phase }) => {
  const [isHintAvailable, setisHintAvailable] = useState(true);

  const useEffectAddNumbers = () => {
    setisHintAvailable(true);
    handleAddNumbers();
  };

  const useEffectHint = () => {
    if (!useHint()) setisHintAvailable(false);
  };

  return (
    <div className="fixed bottom-0 bg-gradient-to-t from-white via-70% via-white w-full h-32 z-40">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-14 z-40 p-4">
        <button
          className="w-14 h-14 bg-gray-100 text-blue-600 rounded-full shadow-md flex items-center justify-center hover:bg-gray-300"
          onClick={() => window.location.reload()}
        >
          <ArrowPathIcon className="w-8 h-8" />
        </button>
        <button
          className={`relative w-14 h-14 bg-gray-100 text-blue-600 rounded-full shadow-md flex items-center justify-center hover:bg-gray-300 ${
            !isHintAvailable && "animate-bounce"
          }`}
          onClick={useEffectAddNumbers}
        >
          <PlusIcon className="w-8 h-8" />
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
            {5 - phase > 0 ? 5 - phase : 0}
          </div>
        </button>
        <button
          className="relative w-14 h-14 bg-gray-100 text-blue-600 rounded-full shadow-md flex items-center justify-center hover:bg-gray-300"
          onClick={useEffectHint}
        >
          <LightBulbIcon className="w-6 h-6" />
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
            {hintCount > 0 ? hintCount : 0}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ButtonBottom;
