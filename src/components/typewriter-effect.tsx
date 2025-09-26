
"use client";

import { useState, useEffect } from 'react';

type TypewriterEffectProps = {
  text: string;
  speed?: number;
};

const TypewriterEffect = ({ text, speed = 20 }: TypewriterEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
      
      return () => clearInterval(intervalId);
    }
  }, [text, speed]);
  
  return <span>{displayedText}</span>;
};

export default TypewriterEffect;
