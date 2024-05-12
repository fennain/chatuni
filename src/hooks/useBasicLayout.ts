import { useState, useEffect } from "react";
import { debounce } from "@/utils/debounce";

/**
 * 自定义 Hook，用于检测屏幕宽度
 * @returns {Object} { isMobile, isIpad }
 */
export function useBasicLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIpad, setIsIpad] = useState(false);

  useEffect(() => {
    const checkMobile = window.matchMedia("(max-width: 768px)"); // TailwindCSS中'md'的默认断点
    const checkIpad = window.matchMedia("(max-width: 1024px)"); // TailwindCSS中'lg'的默认断点

    const handleChange = () => {
      setIsMobile(checkMobile.matches);
      setIsIpad(checkIpad.matches);
    };

    checkMobile.addEventListener("change", handleChange);
    checkIpad.addEventListener("change", handleChange);

    handleChange(); // 初始检查

    return () => {
      checkMobile.removeEventListener("change", handleChange);
      checkIpad.removeEventListener("change", handleChange);
    };
  }, []);

  return { isMobile, isIpad };
}

/**
 * 自定义 Hook，用于设置页面根节点的字体大小
 */
export function useSetDomWidth() {
  useEffect(() => {
    const updateWidthAndFontSize = () => {
      // 基准大小
      const baseSize = 75; //以postcss-pxtorem的rootValue为准
      // console.log("setDomWidth", window.innerWidth);

      const clientHeight = document.documentElement.clientHeight;

      let DomWidth = document.documentElement.clientWidth;
      // if (window.innerWidth <= 768) {
      //   document.documentElement.style.width = "100%";
      //   // document.documentElement.style.height = "100%";
      // } else {
      //   document.documentElement.style.width =
      //     (750 * clientHeight) / 1334 + "px";
      //   DomWidth = (750 * clientHeight) / 1334;
      //   // document.documentElement.style.width = "375px";
      //   // document.documentElement.style.height = "667px";
      // }
      // 设计稿宽度750px，计算缩放比例
      const scale = DomWidth / 750;
      // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
      document.documentElement.style.fontSize =
        baseSize * Math.min(scale, 1) + "px";
    };

    updateWidthAndFontSize(); // 初始设置
    // 使用防抖函数
    const debouncedUpdateWidthAndFontSize = debounce(updateWidthAndFontSize, 0);
    window.addEventListener("resize", debouncedUpdateWidthAndFontSize); // 添加窗口尺寸变化监听器

    return () => {
      window.removeEventListener("resize", debouncedUpdateWidthAndFontSize); // 清除监听器
    };
  }, []);
}
