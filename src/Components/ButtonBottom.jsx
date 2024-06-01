import {
  LightBulbIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const ButtonBottom = ({ handleAddNumbers, hintCount, phase }) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-8 z-40">
    <button
      className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-600"
      onClick={() => window.location.reload()}
    >
      <ArrowPathIcon className="w-6 h-6" />
    </button>
    <button
      className="relative w-12 h-12 bg-blue-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-600"
      onClick={handleAddNumbers}
    >
      <PlusIcon className="w-6 h-6" />
      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
        {5 - phase > 0 ? 5 - phase : 0}
      </div>
    </button>
    <button className="relative w-12 h-12 bg-blue-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-600">
      <LightBulbIcon className="w-6 h-6" />
      {hintCount > 0 && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
          {hintCount}
        </div>
      )}
    </button>
  </div>
);

export default ButtonBottom;
