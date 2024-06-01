const HeaderTop = ({ score, phase }) => (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex space-x-4 w-full justify-between flex">
    <p className="p-4 font-bold text-xl">Phase: {phase}</p>
    <p className="p-4 font-bold text-xl">Score: {score}</p>
  </div>
);

export default HeaderTop;
