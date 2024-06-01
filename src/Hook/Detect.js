import { useState, useEffect } from "react";

const useDetectTouch = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleTouchStart = () => setIsTouch(true);
    const handleMouseMove = () => setIsTouch(false);

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return isTouch;
};

export default useDetectTouch;
