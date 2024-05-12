import { useNavigate, useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SvgIcon from "@/components/SvgIcon";
import { RootState, useSelector } from "@/redux";
import classnames from "classnames";
import { Breadcrumb } from "antd";

const Course: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const handleClick = (path: string) => {
    navigate(path + params?.level);
  };

  const back = () => navigate("/level");

  const Grades = useSelector((state: RootState) => state.user.Grades);

  const [dataSource, setDataSource] = useState<{
    lesson: number;
    grade_1: number[];
    grade_2: number[];
    grade_3: number[];
  } | null>(null);

  useEffect(() => {
    console.log(Grades);
    if (Grades) setDataSource(Grades[parseInt(params.level as string) - 1]);
  }, [Grades, params.level]);

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
      <NavBar onBack={back}>{`Lesson ${params?.level}`}</NavBar>
      <Breadcrumb
        className="ipad:hidden mx-[30px] mt-[10px]"
        itemRender={itemRender}
        items={[
          {
            path: "/level",
            title: "选择课程",
          },
          {
            title: `Lesson ${params?.level}`,
          },
        ]}
      />
      <div className="flex-1 px-[31px] text-[#171717] flex flex-col items-center">
        {/* <div className="w-[540px] h-[100px] rounded-full bg-[#B3FDD0] px-[12px] py-[10px] text-[24px] font-bold flex items-center justify-between">
          <div className="w-[250px] h-[80px] rounded-full bg-white flex items-center justify-center text-[#171717]">
            Courses
          </div>
          <div className="w-[250px] h-[80px] rounded-full flex items-center justify-center text-[#2CBE99]">
            Quizzes
          </div>
        </div> */}

        <div className="ipad:mt-[44px] grid grid-cols-2 gap-[16px] w-full desktop:w-[872px] mx-auto">
          <div
            onClick={() => handleClick("/ReadWithMe/day/")}
            className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
          >
            <SvgIcon name="new_1" className="w-[227px] h-[100px]" />
            <div className="text-center mt-[30px] w-full">
              <p className="text-[24px] font-bold text-[#171717]">跟我读</p>
              <p className="text-[20px] text-[#5E5E5E]">
                用AI正确发音阅读单词和句子
              </p>
              <div className="flex w-full mt-[10px] rounded-[8px] border-[4px] border-[#000000] gap-[3px] p-[3px]">
                {dataSource?.grade_1.map((item, index) => (
                  <div
                    key={index}
                    className={classnames("rounded-[8px] h-[30px] grow", {
                      "bg-gray-200": item == 0,
                      "bg-[green]": item == 1,
                      "bg-[red]": item == 2,
                    })}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("/ListenCarefully/")}
            className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
          >
            <SvgIcon name="new_2" className="w-[227px] h-[100px]" />
            <div className="text-center mt-[30px] w-full">
              <p className="text-[24px] font-bold text-[#171717]">仔细听</p>
              <p className="text-[20px] text-[#5E5E5E]">
                听英语并选择正确的单词
              </p>
              <div className="flex w-full mt-[10px] rounded-[8px] border-[4px] border-[#000000] gap-[3px] p-[3px]">
                {dataSource?.grade_2.map((item, index) => (
                  <div
                    key={index}
                    className={classnames("rounded-[8px] h-[30px] grow", {
                      "bg-gray-200": item == 0,
                      "bg-[green]": item == 1,
                      "bg-[red]": item == 2,
                    })}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          {/* <div className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center">
            <SvgIcon name="3" className="w-[227px] h-[100px]" />
            <div className="text-center mt-[30px]">
              <p className="text-[24px] font-bold text-[#171717]">看和选</p>
              <p className="text-[20px] text-[#5E5E5E]">用英语阅读并选择中文翻译</p>
            </div>
          </div> */}
          <div
            onClick={() => handleClick("/Listen&Pick/")}
            className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
          >
            <SvgIcon name="new_3" className="w-[227px] h-[100px]" />
            <div className="text-center mt-[30px] w-full">
              <p className="text-[24px] font-bold text-[#171717]">英翻中</p>
              <p className="text-[20px] text-[#5E5E5E]">
                听录音，选出正确的英语/汉语单词
              </p>
              <div className="flex w-full mt-[10px] rounded-[8px] border-[4px] border-[#000000] gap-[3px] p-[3px]">
                {dataSource?.grade_3.map((item, index) => (
                  <div
                    key={index}
                    className={classnames("rounded-[8px] h-[30px] grow", {
                      "bg-gray-200": item == 0,
                      "bg-[green]": item == 1,
                      "bg-[red]": item == 2,
                    })}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
