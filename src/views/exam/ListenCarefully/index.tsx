import classnames from "classnames";
import daily_word from "@/assets/json/zhongkao/daily_word.json";
import daily_word_gaokao from "@/assets/json/gaokao/daily_word.json";
import daily_word_ielts from "@/assets/json/ielts/daily_word.json";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Breadcrumb } from "antd";
import { text2speechApi } from "@/api/modules/user";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import NavBar from "@/components/NavBar";
import { useNavigate, useParams, Link } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import { randomNum } from "@/utils";
import { debounce } from "@/utils/debounce";
import { ExamType, formatExamType } from "../interface";

const ListenCarefully: React.FC = () => {
  const { playAudio } = useAudioPlayer();
  const navigate = useNavigate();
  const params = useParams();

  const [options, setOptions] = useState<daily_word[]>([]);
  const [correct, setCorrect] = useState<number>(1);
  const [canNext, setCanNext] = useState<boolean>(false);

  /**
   * 初始化选项
   */
  const init = useCallback(() => {
    let localData;
    switch (params.type && params.id) {
      case ExamType.ZHONGKAO:
        localData = daily_word.filter(
          (item) => item.day === parseInt(params.id as string)
        );
        break;
      case ExamType.GAOKAO:
        localData = daily_word_gaokao.filter(
          (item) => item.day === parseInt(params.id as string)
        );
        break;
      case ExamType.IELTS:
        localData = daily_word_ielts.filter(
          (item) => item.day === parseInt(params.id as string)
        );
        break;

      default:
        localData = daily_word.filter(
          (item) => item.day === parseInt(params.id as string)
        );
        break;
    }
    const arr = JSON.parse(
      JSON.stringify(localData.map((item) => ({ ...item, active: false })))
    );
    // 洗牌算法：随机排列数组
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // 选取前4个元素
    setOptions(arr.slice(0, 4));
    setCorrect(randomNum(0, 3));
    setCanNext(false);
  }, []);

  /**
   * 添加防抖
   */
  const debouncedText2speech = debounce(
    (word: string | undefined) => text2speech(word),
    500
  );

  const [cacheAudioText, setCacheAudioText] = useState("");
  const [cacheAudio, setCacheAudio] = useState("");
  /**
   * 文本转语音
   * @returns
   */
  const text2speech = async (text: string | undefined) => {
    if (cacheAudioText == text) {
      playAudio(cacheAudio);
      return;
    }
    try {
      if (!text) return;
      const { result } = await text2speechApi({
        text,
        language: "zh",
        speed: 1,
        voice: "youxiaomei",
      });
      console.log(result);
      if (result.url) {
        playAudio(result.url);
        setCacheAudioText(text);
        setCacheAudio(result.url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const back = () => navigate(`/exam/ListenCarefully/${params.type}`);

  const handleChoose = (index: number) => {
    const newOptions = options.map((item, i) => ({
      ...item,
      active: i === index,
    }));
    setOptions(newOptions);
    if (index === correct) {
      setCanNext(true);
      setTimeout(() => {
        init();
      }, 500);
    } else {
      setCanNext(false);
    }
  };

  useEffect(() => {
    init();
  }, [init]);

  function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={currentRoute?.path}>{currentRoute.title}</Link>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <NavBar onBack={back}>天数{params.id}</NavBar>
      <Breadcrumb
        className="ipad:hidden mx-[30px] mt-[10px]"
        itemRender={itemRender}
        items={[
          {
            path: "/level",
            title: "选择课程",
          },
          {
            path: `/exam/ListenCarefully/${params.type}`,
            title: `每日${formatExamType(params.type as ExamType)}必背单词`,
          },
          {
            title: `天数${params.id}`,
          },
        ]}
      />
      <div className="flex-1 py-[74px] px-[32px] text-[#171717] flex flex-col items-center">
        <div>
          <p className="text-center mb-[32px] text-[24px]">
            听一个英语单词并选择正确的书写方式
          </p>
        </div>
        <div className="space-y-[48px] w-full">
          <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] min-h-[353px] border-[2px] border-[#DDDDDD] rounded-[48px] p-[48px] flex flex-wrap items-center justify-between gap-y-[32px]">
            {options.map((item, index) => (
              <div
                key={index}
                className={classnames(
                  "relative flex justify-center items-center text-[36px] text-white rounded-[16px] w-[279px] h-[112px] cursor-pointer",
                  {
                    "bg-[#7DBCF9]": !item.active,
                    "bg-[#3AE3B9]": index === correct && item.active,
                    "bg-[#DD4848]": index !== correct && item.active,
                  }
                )}
                onClick={() => handleChoose(index)}
              >
                {index === correct && item.active ? (
                  <div className="absolute top-0 bottom-0 my-auto -left-[15px] w-[58px] h-[58px] bg-[#2CBE99] flex justify-center items-center rounded-full">
                    <SvgIcon name="dui" className="w-[30px] h-[25px]" />
                  </div>
                ) : null}

                {item.word_en}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="relative pl-[64px]">
              <div className="absolute z-20 top-0 bottom-0 my-auto left-0 border-[4px] border-[#ffffff] w-[92px] h-[92px] bg-[#7DBCF9] flex justify-center items-center rounded-full">
                <SvgIcon name="listen" className="w-[44px] h-[44px]" />
              </div>
              <Button
                className="border-[4px] bg-white w-[271px] h-[76px] text-[36px]"
                type="primary"
                ghost
                onClick={() => debouncedText2speech(options[correct].word_en)}
              >
                听
              </Button>
            </div>

            <div className="relative pl-[64px]">
              <div className="absolute z-20 top-0 bottom-0 my-auto left-0 border-[4px] border-[#ffffff] w-[92px] h-[92px] bg-[#E3B700] flex justify-center items-center rounded-full">
                <SvgIcon name="next" className="w-[44px] h-[44px]" />
              </div>
              <Button
                className={classnames(
                  "border-[4px] border-[#E3B700] text-[#E3B700] bg-white w-[271px] h-[76px] text-[36px]",
                  {
                    "border-[#d9d9d9]": !canNext,
                    "text-slate-200": !canNext,
                  }
                )}
                type="primary"
                ghost
                disabled={!canNext}
                onClick={init}
              >
                下一个
              </Button>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default ListenCarefully;
