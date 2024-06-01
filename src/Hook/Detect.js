import { useState, useEffect } from "react";

const useDetectTouch = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);
    //console.log("User Agent IsMobileCheck:", isMobileDevice());

    setIsTouch(isMobileDevice());

    return () => {};
  }, []);

  return isTouch;
};

export default useDetectTouch;
