import classnames from "classnames";
import chooseOptions from "@/assets/json/chooseOptions.json";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Breadcrumb } from "antd";
import { text2speechApi } from "@/api/modules/user";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import NavBar from "@/components/NavBar";
import { useNavigate, useParams, Link } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import { debounce } from "@/utils/debounce";
import { RootState, useSelector, useDispatch } from "@/redux";
import { setCurrentDay, setGrades } from "@/redux/modules/user";

const ListenCarefully: React.FC = () => {
  const dispatch = useDispatch();
  const { playAudio } = useAudioPlayer();
  const navigate = useNavigate();
  const params = useParams();

  const currentDay = useSelector(
    (state: RootState) => state.user.currentDay ?? 1
  );
  const Grades = useSelector((state: RootState) => state.user.Grades);

  const [dataSource, setDataSource] = useState<chooseOptions_lesson | null>(
    null
  );
  const [level, setLevel] = useState<number>(1);
  const [canNext, setCanNext] = useState<boolean>(true);

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

  const back = () => navigate(`/Course/${params.id}`);

  const handleChoose = (index: number) => {
    const newDataSource = JSON.parse(JSON.stringify(dataSource));
    newDataSource.content[level - 1].active = index;
    setDataSource(newDataSource);
    if (
      dataSource?.content[level - 1].options[index].en ===
      dataSource?.content[level - 1].word_en
    ) {
      // 正确
      setCanNext(true);
      const newGrades = JSON.parse(JSON.stringify(Grades));
      newGrades[parseInt(params.id as string) - 1].grade_2[level - 1] = 1;
      dispatch(setGrades(newGrades));
      // setTimeout(() => {
      //   handleNext();
      // }, 500);
    } else {
      setCanNext(true);
      const newGrades = JSON.parse(JSON.stringify(Grades));
      newGrades[parseInt(params.id as string) - 1].grade_2[level - 1] = 2;
      dispatch(setGrades(newGrades));
    }
  };

  const handleNext = () => {
    const data = chooseOptions.find(
      (item) => item.lesson === parseInt(params.id as string)
    );
    // console.log(dataSource);
    if ((data?.content.length ?? 0) > level) {
      setLevel(level + 1);
      setCanNext(true);
    } else {
      // 完成阅读
      if ((currentDay ?? 1) === data?.lesson)
        dispatch(setCurrentDay(data?.lesson + 1));
      back();
    }
  };

  useEffect(() => {
    console.log(params);
    function compareRandom() {
      return Math.random() - 0.5;
    }
    if (params.id) {
      const data = chooseOptions.find(
        (item) => item.lesson === parseInt(params.id as string)
      );
      if (data) {
        data.content = data?.content.map((item) => {
          return {
            ...item,
            active: -1,
            options: item.options.sort(compareRandom),
          };
        });
        setDataSource(data as chooseOptions_lesson);
      }
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
    <div className="flex flex-col h-full bg-white">
      <NavBar onBack={back}>仔细听</NavBar>
      <Breadcrumb
        className="ipad:hidden mx-[30px] mt-[10px]"
        itemRender={itemRender}
        items={[
          {
            path: "/level",
            title: "选择课程",
          },
          {
            path: `/Course/${params.id}`,
            title: `Lesson ${params?.id}`,
          },
          {
            title: "仔细听",
          },
        ]}
      />
      <div className="flex-1 py-[74px] px-[32px] text-[#171717] flex flex-col justify-between items-center">
        <div>
          <p className="text-center mb-[32px] text-[24px]">
            听一个英语单词并选择正确的书写方式
          </p>
        </div>
        <span className="text-[#2CBE99] text-[32px] font-bold">{`第${level}题`}</span>
        <div className="space-y-[48px] w-full">
          <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] min-h-[353px] border-[2px] border-[#DDDDDD] rounded-[48px] p-[48px] grid grid-cols-2 ipad:grid-cols-1 gap-[32px]">
            {dataSource?.content[level - 1].options.map((item, index) => (
              <div
                key={index}
                className={classnames(
                  "relative flex justify-center items-center text-[36px] text-white rounded-[16px] h-[112px] cursor-pointer",
                  {
                    "bg-[#7DBCF9]":
                      dataSource?.content[level - 1].active != index,
                    "bg-[#3AE3B9]":
                      item.en === dataSource?.content[level - 1].word_en &&
                      dataSource?.content[level - 1].active == index,
                    "bg-[#DD4848]":
                      item.en !== dataSource?.content[level - 1].word_en &&
                      dataSource?.content[level - 1].active == index,
                  }
                )}
                onClick={() => handleChoose(index)}
              >
                {item.en === dataSource?.content[level - 1].word_en &&
                dataSource?.content[level - 1].active == index ? (
                  <div className="absolute top-0 bottom-0 my-auto -left-[15px] w-[58px] h-[58px] bg-[#2CBE99] flex justify-center items-center rounded-full">
                    <SvgIcon name="dui" className="w-[30px] h-[25px]" />
                  </div>
                ) : null}

                {item.en}
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
                onClick={() =>
                  debouncedText2speech(dataSource?.content[level - 1].word_en)
                }
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
                onClick={handleNext}
              >
                {level < (dataSource?.content.length ?? 0)
                  ? "下一个"
                  : "完成阅读"}
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
