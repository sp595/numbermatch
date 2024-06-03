const HeaderTop = ({ score, phase, record }) => (
  <div className="fixed top-0 bg-gradient-to-b from-white via-70% via-white w-full h-40 z-40">
    <div className="text-center w-full px-4 pt-4 font-semibold text-lg text-gray-700">
      Number match
    </div>
    <div className="text-center w-full px-4 pt-2 font-semibold text-2xl text-black">
      {score}
    </div>
    <div className="w-full justify-between flex px-8">
      <p className="p-4 font-semibold text-sm text-gray-600">Fase: {phase}</p>
      <p className="p-4 font-semibold text-sm text-gray-600">
        Record: {record}
      </p>
    </div>
  </div>
);

export default HeaderTop;
