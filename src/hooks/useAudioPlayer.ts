import { useRef, useEffect } from "react";
import { require } from "@/utils/require";

const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = (base64Audio: string) => {
    // 如果音频正在播放，先停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const decodeAudio = () => {
      // 解码Base64编码的音频文件
      const decodedAudio = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(decodedAudio.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < decodedAudio.length; ++i) {
        view[i] = decodedAudio.charCodeAt(i);
      }
      return arrayBuffer;
    };

    // // 创建Blob对象
    // const blob = new Blob([decodeAudio()], { type: "audio/wav" });
    // console.log(blob);

    // 创建URL对象
    // const url = URL.createObjectURL(blob);

    // 创建Audio对象并播放
    const audio = new Audio(base64Audio);
    console.log(base64Audio);
    audio.volume = 1;
    audio.play();

    // 保存对audio元素的引用以便后续控制
    audioRef.current = audio;

    // 清理资源
    audio.addEventListener("ended", () => {
      // URL.revokeObjectURL(url);
    });
  };

  const playMp3 = (mp3FilePath: string) => {
    // 如果音频正在播放，先停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // 创建Audio对象并播放
    const audio = new Audio(require(mp3FilePath));
    audio.play();

    // 保存对audio元素的引用以便后续控制
    audioRef.current = audio;

    // 清理资源
    audio.addEventListener("ended", () => {
      // 你可能想在这里执行一些清理操作，如重置 audioRef.current 为 null
      // 但这可能不是必需的，除非你需要在音频播放结束后特别处理 audioRef
    });
  };

  return { playAudio, playMp3 };
};

export default useAudioPlayer;
