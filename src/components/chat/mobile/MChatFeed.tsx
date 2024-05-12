/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import "./MChatFeed.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AIMessage from "../AIMessage";
import MicButton from "../MicButton";
import MyMessage from "../MyMessage";
import { require } from "@/utils/require";
import { greetingApi, chattransApi, chatvoiceApi } from "@/api/modules/user";
import { Toast } from "antd-mobile";
import SvgIcon from "@/components/SvgIcon";

const greeting = async (id: number) => {
  const data = {
    characterid: id,
  };

  try {
    const { result } = await greetingApi(data);
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error posting data", error);
  }
};

const chatVoice = async (file: string, voice: string, id: number) => {
  const data = {
    file: file,
    characterid: id,
    voiceid: voice,
    speed: 1,
    language: "zh",
  };
  console.log("chatvoice data:", data);

  try {
    const response = await chatvoiceApi(data);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error posting data", error);
  }
};

function MChatFeed({ AIdata }) {
  const [messagesFeed, setMessagesFeed] = useState<Message[]>([]);
  const [isPlayGif, setIsPlayGif] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  console.log("AIdata", AIdata);
  let apiId = 1;
  // let img = "";
  let name = "";
  let voice = "";

  // img = AIdata.AIdata.image;
  name = AIdata.name;
  voice = AIdata.voice;

  const handleMyVoice = async (audioBlob: Blob) => {
    try {
      const data = await chattransApi({
        file: audioBlob,
        characterid: AIdata.id,
      });
      console.log(data);
      if (!data.result.originaltext)
        return Toast.show({
          content: "未识别到语音",
          duration: 1000,
        });
      addMyMessage(data.result.originaltext);
      const message = await chatVoice(
        data.result.originaltext,
        voice,
        AIdata.id
      );
      console.log("res", message);
      // const wavId =  await upload(audioBlob, token);
      // const message = await stt(token, wavId);

      addAIMessage(message.result.text, message.result.url);
      handleAudioBlob(message.result.url);
    } finally {
    }

    // const response = await chatVoice(token, audioBlob);
  };

  useEffect(() => {
    const fetchToken = async () => {
      console.log("data", AIdata);
      apiId = AIdata.id;
      const message = await greeting(apiId);
      addAIMessage(message, "");
    };
    fetchToken();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messagesFeed]);

  function addAIMessage(message: string, voice: string) {
    const newMessage = { AI: true, text: message, voice };
    setMessagesFeed((prevMessagesFeed) => {
      const updatedMessagesFeed = [...prevMessagesFeed, newMessage];
      return updatedMessagesFeed;
    });
  }

  function addMyMessage(message: string) {
    const newMessage = { AI: false, text: message };
    setMessagesFeed((prevMessagesFeed) => [...prevMessagesFeed, newMessage]);
  }

  type Message = {
    AI: boolean;
    voice?: string;
    text: string;
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView();
      }
    });
    return <div ref={elementRef} />;
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  function handleAudioBlob(base64String: string) {
    // 如果音频正在播放，先停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Decode base64 audio

    const decodeAudio = () => {
      // 解码Base64编码的音频文件
      const decodedAudio = atob(base64String);
      const arrayBuffer = new ArrayBuffer(decodedAudio.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < decodedAudio.length; ++i) {
        view[i] = decodedAudio.charCodeAt(i);
      }
      return arrayBuffer;
    };
    // 创建Blob对象
    // const blob = new Blob([decodeAudio()], { type: "audio/wav" });

    // 创建URL对象
    // const url = URL.createObjectURL(blob);

    // 创建Audio对象并播放
    const audio = new Audio(base64String);
    audio.play().then(() => {
      // 浏览器支持自动播放
      console.log("浏览器支持自动播放");
      setIsPlayGif(true);
    });

    // 监听音频播放结束事件
    audio.addEventListener("ended", function () {
      console.log("音频播放结束");
      setIsPlayGif(false);
      // 在这里可以执行音频播放结束后的操作
    });
    // 保存对audio元素的引用以便后续控制
    audioRef.current = audio;
  }

  return (
    <div className="MfeedBackground h-full px-[10px] relative">
      <div className="MmessageBackground gap-[10px] justify-end">
        <div className="overflow-y-auto" ref={scrollRef}>
          {messagesFeed.map((message, index) => (
            <div key={index}>
              {message.AI === false ? (
                <div className="MchatMsg">
                  <MyMessage message={message.text} />
                </div>
              ) : (
                <div className="flex items-start relative">
                  <AIMessage message={message.text} />
                  {message.voice && (
                    <div
                      onClick={() => handleAudioBlob(message.voice)}
                      className="absolute cursor-pointer top-0 left-0 border-[4px] border-[#ffffff] w-[50px] h-[50px] bg-[#7DBCF9] flex justify-center items-center rounded-full"
                    >
                      <SvgIcon name="listen" className="text-[30px]" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* <AlwaysScrollToBottom /> */}
        </div>
      </div>

      <div className="MmicBackground pb-[10px] relative">
        {isPlayGif ? (
          <img
            src={require(`gif/${AIdata.icon}.gif`)}
            alt="Tutor"
            className="w-[300px] mx-auto"
          ></img>
        ) : (
          <img
            src={require(`tutoricons/${AIdata.icon}.png`)}
            alt="Tutor"
            className="w-[300px] mx-auto"
          ></img>
        )}
        <div className="absolute bottom-[50px] left-[50px]">
          <MicButton onAudioBlob={handleMyVoice}></MicButton>
        </div>
      </div>
    </div>
  );
}

export default MChatFeed;
