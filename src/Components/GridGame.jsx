import useDetectTouch from "../Hook/Detect";
import { STATE } from "../Hook/Logic";

const GridGame = ({
  grid,
  handleSelect,
  columns,
  selected,
  selectedHint,
  wrongSelection,
}) => {
  const isTouch = useDetectTouch();

  return (
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
      selectedHint.includes(num?.id)
        ? selected.includes(num?.id)
          ? wrongSelection
            ? "bg-red-300 hover:bg-red-300"
            : "bg-blue-300 hover:bg-blue-300"
          : "animate-pulse bg-blue-200 hover:bg-blue-200"
        : ""
    }
    ${
      num?.state !== STATE.Wiped
        ? isTouch
          ? "hover:border-2 hover:bg-blue-300"
          : "hover:border-2 hover:bg-gray-50"
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
  );
};

export default GridGame;
