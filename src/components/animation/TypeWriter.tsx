import { useState, useEffect } from "react";

export default function TypeWriter({
  text,
  speed = 100,
  pause = 2500,
  className,
  loop = true,
}: {
  text: string | string[];
  speed?: number;
  pause?: number;
  className?: string;
  loop?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [index, setIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);

  const textArray = Array.isArray(text) ? text : [text];

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textArray[loopNum % textArray.length];
      const isComplete = !isDeleting && displayedText === currentText;
      const isStartDelete = isDeleting && displayedText === "";

      if (isComplete) {
        if (loop || loopNum < textArray.length - 1) {
          setIsDeleting(true);
          setTypingSpeed(pause);
        }
      } else if (isStartDelete) {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(speed);
      } else if (isDeleting) {
        setDisplayedText(currentText.substring(0, index - 1));
        setIndex(index - 1);
        setTypingSpeed(speed);
      } else {
        setDisplayedText(currentText.substring(0, index + 1));
        setIndex(index + 1);
        setTypingSpeed(speed);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [
    displayedText,
    isDeleting,
    index,
    loopNum,
    typingSpeed,
    textArray,
    pause,
    speed,
    loop,
  ]);

  return (
    <div
      className={`inline-flex relative ${className || ""} typewriter-container`}
    >
      {displayedText || ""}
      <span className="font-normal animate-blink text-white -translate-y-[4.5px] typewriter-cursor">
        |
      </span>
    </div>
  );
}
