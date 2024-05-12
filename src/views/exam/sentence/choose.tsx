import { RootState, useSelector } from "@/redux";
import classnames from "classnames";
import zhongkao_sentence from "@/assets/json/zhongkao/zhongkao_sentence.json";
import gaokao_sentence from "@/assets/json/gaokao/gao_sentence.json";
import ielts_sentence from "@/assets/json/ielts/ielts_sentence.json";
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
      navigate(`/exam/listen_sentence/${params.type}/${id}`);
  };

  useEffect(() => {
    console.log(5455);
    switch (params.type) {
      case ExamType.ZHONGKAO:
        setDataSource(zhongkao_sentence);
        document.title = "中考，听句子";
        break;
      case ExamType.GAOKAO:
        setDataSource(gaokao_sentence);
        document.title = "高考，听句子";
        break;
      case ExamType.IELTS:
        setDataSource(ielts_sentence);
        document.title = "雅思，听句子";
        break;

      default:
        setDataSource(zhongkao_sentence);
        document.title = "中考，听句子";
        break;
    }
  }, []);

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
        {formatExamType(params.type as ExamType)}，听句子背单词
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
            title: `${formatExamType(params.type as ExamType)}，听句子背单词`,
          },
        ]}
      />
      <div className="flex-1 overflow-hidden desktop:py-[10px] py-[74px] px-[32px] text-[#171717] text-[24px] flex flex-col">
        <p className="text-center mb-[32px]">跟AI读单词和句子，提升单词量</p>
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
                <span className="text-[24px] font-bold">句子</span>
                <span className="text-[48px] font-bold leading-none">
                  {item.Sentenc}
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
                {item.topic}
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
