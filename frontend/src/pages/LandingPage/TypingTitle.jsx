import { useState, useEffect, useCallback } from "react";
import styles from "./TypingTitle.module.css";

const TypingTitle = () => {
  const fullText = "DhruVidhi Solutions";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState("typing"); // 'typing' | 'waiting' | 'deleting' | 'waitingBeforeType'

  // Cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, []);

  const startTyping = useCallback(() => {
    let index = 0;
    setDisplayText("");
    setIsDeleting(false);
    setPhase("typing");

    const typeChar = () => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
        const delay = Math.random() * 60 + 40; // Smooth typing speed
        setTimeout(typeChar, delay);
      } else {
        // Typing complete, wait before deleting
        setPhase("waiting");
        setTimeout(() => {
          startDeleting();
        }, 2000);
      }
    };

    typeChar();
  }, []);

  const startDeleting = useCallback(() => {
    setIsDeleting(true);
    setPhase("deleting");
    let index = fullText.length;

    const deleteChar = () => {
      if (index > 0) {
        setDisplayText(fullText.slice(0, index - 1));
        index--;
        const delay = Math.random() * 30 + 20; // Smooth deleting speed
        setTimeout(deleteChar, delay);
      } else {
        // Deletion complete, wait before typing again
        setPhase("waitingBeforeType");
        setTimeout(() => {
          startTyping();
        }, 500);
      }
    };

    deleteChar();
  }, []);

  useEffect(() => {
    // Start the typing animation on mount
    const startDelay = setTimeout(() => {
      startTyping();
    }, 500);

    return () => clearTimeout(startDelay);
  }, [startTyping]);

  return (
    <span className={styles.container}>
      <span className={styles.text}>{displayText}</span>
      <span
        className={`${styles.cursor} ${showCursor ? styles.cursorVisible : styles.cursorHidden}`}
      >
        |
      </span>
    </span>
  );
};

export default TypingTitle;
