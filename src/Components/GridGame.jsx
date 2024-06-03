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
      <div className="w-full h-40" />
      <div className="flex justify-center items-center h-screen pt-4 bg-white">
        <div
          className={`grid border-2 border-gray-400`}
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(15px, 40px))`,
          }}
        >
          {grid.map((num, index) => {
            const wrongClasses = wrongSelection
              ? "bg-red-300 hover:bg-red-300"
              : "bg-blue-300 hover:bg-blue-300";

            return (
              <div
                key={index}
                className={`flex justify-center w-full items-center border border-gray-300 cursor-pointer select-none text-2xl font-semibold text-black
                ${
                  !selected.includes(num?.id) && num?.state === STATE.NEW
                    ? isTouch
                      ? "hover:border-2 hover:bg-blue-300"
                      : "hover:border-2 hover:bg-gray-50"
                    : ""
                }
                ${num.state === STATE.Wiped ? "text-gray-200" : ""}
                ${selected.includes(num?.id) ? wrongClasses : ""}
                ${
                  selectedHint.includes(num?.id)
                    ? selected.includes(num?.id)
                      ? wrongClasses
                      : "animate-pulse bg-blue-200 hover:bg-blue-200"
                    : ""
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
            );
          })}
        </div>
      </div>
      <div className="w-full h-24" />
    </div>
  );
};

export default GridGame;
