import React, { useState, useEffect, useRef } from "react";

function ResponsiveText({ initialFontSize, maxWidth, text }) {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const textRef = useRef(null);
  console.log("textRef");
  useEffect(() => {
    const adjustFontSize = () => {
      let currentFontSize = initialFontSize;
      const textElement = textRef.current;
      console.log("textRef2222");
      if (textElement) {
        // 确保在开始时使用初始字体大小
        textElement.style.fontSize = `${initialFontSize}px`;
        console.log(textElement.offsetWidth);
        // 如果文本宽度超出容器，逐步减小字体大小
        while (textElement.offsetWidth > maxWidth && currentFontSize > 0) {
          currentFontSize--;
          textElement.style.fontSize = `${currentFontSize}px`;
        }
      }

      //   setFontSize(currentFontSize);
    };

    adjustFontSize();
  }, [text, initialFontSize, maxWidth]); // 添加text作为依赖项

  return (
    <div
      className="text-white"
      style={{
        maxWidth: `${maxWidth}px`,
        whiteSpace: "nowrap",
      }}
    >
      <span className="leading-none" ref={textRef}>
        {text}
      </span>
    </div>
  );
}

export default ResponsiveText;
