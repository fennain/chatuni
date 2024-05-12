import classnames from "classnames";
import listen_mp3 from "@/assets/json/zhongkao/listen_mp3.json";
import listen_mp3_gaokao from "@/assets/json/gaokao/listen_mp3.json";
import listen_mp3_ielts from "@/assets/json/ielts/listen_mp3.json";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Breadcrumb } from "antd";
import { text2speechApi } from "@/api/modules/user";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import NavBar from "@/components/NavBar";
import { useNavigate, useParams, Link } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import { debounce } from "@/utils/debounce";
import { ExamType, formatExamType } from "../interface";

const ListenCarefully: React.FC = () => {
  const { playMp3 } = useAudioPlayer();
  const navigate = useNavigate();
  const params = useParams();

  const [dataSource, setDataSource] = useState<listen_mp3 | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [canNext, setCanNext] = useState<boolean>(false);

  /**
   * 添加防抖
   */
  const debouncedText2speech = debounce(
    (word: string | undefined) => text2speech(word),
    500
  );

  /**
   * 文本转语音
   * @returns
   */
  const text2speech = async (text: string) => {
    try {
      playMp3(`mp3/${text}`);
    } catch (error) {
      console.log(error);
    }
  };

  const back = () => navigate("/level");

  const handleChoose = (index: number, i: number) => {
    const newDataSource = {
      ...dataSource,
      questions: dataSource?.questions.map((item, questions_index) => {
        if (questions_index === index) {
          return {
            ...item,
            active: i,
          };
        } else {
          return {
            ...item,
          };
        }
      }),
    };
    setDataSource(newDataSource as listen_mp3);
  };

  const handleNext = () => {
    if ((listen_mp3.length ?? 0) > level) {
      setLevel(level + 1);
    } else {
      // 完成阅读
      // if ((currentSentence ?? 1) === dataSource?.id)
      //   dispatch(setCurrentSentence(dataSource?.id + 1));
      navigate("/listen_sentence");
    }
  };

  useEffect(() => {
    function compareRandom() {
      return Math.random() - 0.5;
    }
    let localData;
    switch (params.type) {
      case ExamType.ZHONGKAO:
        localData = listen_mp3;
        break;
      case ExamType.GAOKAO:
        localData = listen_mp3_gaokao;
        break;
      case ExamType.IELTS:
        localData = listen_mp3_ielts;
        break;

      default:
        localData = listen_mp3;
        break;
    }
    const data = localData.find((item) => item.id === level);
    if (data) {
      data.questions = data.questions.map((item) => {
        const options = item.answers
          .map((option) => ({
            word_en: option,
          }))
          .sort(compareRandom);
        return {
          ...item,
          active: -1,
          options,
        };
      });
      setDataSource(data as listen_mp3);
    }
  }, [level]);

  useEffect(() => {
    if (!dataSource?.questions) return;
    const canNext = dataSource?.questions.every((item) => {
      return item.options[item.active]?.word_en == item.correctAnswer;
    });
    setCanNext(canNext);
    console.log(canNext);
  }, [dataSource]);

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
      <NavBar onBack={back}>
        {formatExamType(params.type as ExamType)}听力训练
      </NavBar>
      <Breadcrumb
        className="ipad:hidden mx-[30px] mt-[10px]"
        itemRender={itemRender}
        items={[
          {
            path: "/level",
            title: "选择课程",
          },
          {
            title: `${formatExamType(params.type as ExamType)}听力训练`,
          },
        ]}
      />
      <div className="flex-1 p-[32px] text-[#171717] flex flex-col overflow-hidden">
        <div>
          <p className="text-center mb-[32px] text-[24px]">
            听本段对话，看题目从下列三个选项中选出正确答案
          </p>
        </div>
        <div className="space-y-[48px] flex-1 w-full overflow-hidden overflow-y-auto py-[10px]">
          {dataSource?.questions.map((item, index) => (
            <div key={index} className="space-y-[10px]">
              <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border-[2px] border-[#DDDDDD] rounded-[48px] p-[28px] text-center text-[32px]">
                {item.id}.{item.question}
              </div>
              <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] min-h-[353px] border-[2px] border-[#DDDDDD] rounded-[48px] p-[48px] grid grid-cols-2 ipad:grid-cols-1 gap-[32px]">
                {item.options.map((option, i) => (
                  <div
                    key={i}
                    className={classnames(
                      "relative flex justify-center items-center text-[36px] text-white rounded-[16px] w-full min-h-[112px] cursor-pointer p-[20px] leading-none",
                      {
                        "bg-[#7DBCF9]": item.active != i,
                        "bg-[#3AE3B9]":
                          option.word_en === item.correctAnswer &&
                          item.active == i,
                        "bg-[#DD4848]":
                          option.word_en !== item.correctAnswer &&
                          item.active == i,
                      }
                    )}
                    onClick={() => handleChoose(index, i)}
                  >
                    {option.word_en === item.correctAnswer &&
                    item.active == i ? (
                      <div className="absolute top-0 bottom-0 my-auto -left-[15px] w-[58px] h-[58px] bg-[#2CBE99] flex justify-center items-center rounded-full">
                        <SvgIcon name="dui" className="w-[30px] h-[25px]" />
                      </div>
                    ) : null}
                    {i + 1}.{option.word_en}
                  </div>
                ))}
              </div>
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
              onClick={() => debouncedText2speech(dataSource?.mp3)}
            >
              听
            </Button>
          </div>

          <div className="relative pl-[64px]">
            <div className="absolute z-20 top-0 bottom-0 my-auto left-0 border-[4px] border-[#ffffff] w-[92px] h-[92px] bg-[#E3B700] flex justify-center items-center rounded-full select-none">
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
              onClick={handleNext}
            >
              下一段
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenCarefully;
