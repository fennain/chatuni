import { RootState, useSelector } from "@/redux";
import classnames from "classnames";
import daily_word from "@/assets/json/zhongkao/daily_word.json";
import daily_word_gaokao from "@/assets/json/gaokao/daily_word.json";
import daily_word_ielts from "@/assets/json/ielts/daily_word.json";
import NavBar from "@/components/NavBar";
import { useNavigate, useParams, Link } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import React, { useState, useEffect } from "react";
import { ExamType, formatExamType } from "../interface";
import { Breadcrumb } from "antd";

const ReadWithMe: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [dataSource, setDataSource] = useState<zhongkao_sentence[]>([]);

  const currentSentence =
    useSelector((state: RootState) => state.user.currentSentence) ?? 1;

  const back = () => navigate("/level");
  const handleClick = (id: number) => {
    if (id <= currentSentence)
      navigate(`/exam/ListenCarefully/${params.type}/${id}`);
  };

  useEffect(() => {
    switch (params.type) {
      case ExamType.ZHONGKAO:
        setDataSource(mergeByDay(daily_word));
        document.title = "每日中考必背单词";
        break;
      case ExamType.GAOKAO:
        setDataSource(mergeByDay(daily_word_gaokao));
        document.title = "每日高考必背单词";
        break;
      case ExamType.IELTS:
        setDataSource(mergeByDay(daily_word_ielts));
        document.title = "每日雅思必背单词";
        break;

      default:
        setDataSource(mergeByDay(daily_word));
        document.title = "每日中考必背单词";
        break;
    }
  }, []);

  function mergeByDay(arr) {
    const mergedArr = [];

    // 遍历输入数组
    arr.forEach((item) => {
      // 检查是否已经有相同天数的对象存在于合并数组中
      const existingDay = mergedArr.find((elem) => elem.id === item.day);

      if (existingDay) {
        // 如果存在相同天数的对象，则将当前项添加到该天数的内容数组中
        existingDay.content.push({
          word_en: item.word_en,
          phonetic_en: item.phonetic_en,
          word_cn: item.word_cn,
        });
      } else {
        // 如果不存在相同天数的对象，则创建一个新的对象并添加到合并数组中
        mergedArr.push({
          id: item.day,
          content: [
            {
              word_en: item.word_en,
              phonetic_en: item.phonetic_en,
              word_cn: item.word_cn,
            },
          ],
        });
      }
    });
    console.log(mergedArr);
    return mergedArr;
  }

  function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={currentRoute?.path}>{currentRoute.title}</Link>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <NavBar onBack={back}>
        每日{formatExamType(params.type as ExamType)}必背单词
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
            title: `每日${formatExamType(params.type as ExamType)}必背单词`,
          },
        ]}
      />
      <div className="flex-1 overflow-hidden desktop:py-[10px] py-[74px] px-[32px] text-[#171717] text-[24px] flex flex-col">
        <p className="text-center mb-[32px]">
          听一个英语单词并选择正确的书写方式
        </p>
        <div className="flex-1 overflow-hidden overflow-y-auto flex flex-col gap-[48px]">
          {dataSource.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.id)}
              className={classnames(
                "flex justify-between items-center gap-[41px]",
                {
                  active: currentSentence == item.id,
                  "cursor-pointer": currentSentence >= item.id,
                }
              )}
            >
              <div
                className={classnames(
                  "rounded-full bg-white w-[120px] h-[120px] border-[4px] flex flex-col justify-center items-center gap-[4px]",
                  {
                    "border-[#E3B700]": currentSentence == item.id,
                    "text-[#E3B700]": currentSentence == item.id,
                    "border-[#2CBE99]": currentSentence > item.id,
                    "text-[#2CBE99]": currentSentence > item.id,
                    "border-[#C6C6C6]": currentSentence < item.id,
                    "text-[#C6C6C6]": currentSentence < item.id,
                  }
                )}
              >
                <span className="text-[24px] font-bold">天数</span>
                <span className="text-[48px] font-bold leading-none">
                  {item.id}
                </span>
              </div>
              <div
                className={classnames(
                  "relative flex-1 text-[24px] h-full bg-white border-[4px] rounded-[24px] text-[#171717] p-[24px] flex items-center",
                  {
                    "border-[#E3B700]": currentSentence == item.id,
                    "border-[#2CBE99]": currentSentence > item.id,
                    "border-[#C6C6C6]": currentSentence < item.id,
                  }
                )}
              >
                第{item.id}天，单词训练
                {currentSentence > item.id && (
                  <div className="absolute top-0 bottom-0 my-auto right-[24px] w-[58px] h-[58px] bg-[#2CBE99] flex justify-center items-center rounded-full">
                    <SvgIcon name="dui" className="w-[30px] h-[25px]" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadWithMe;
