import classnames from "classnames";
import chooseOptions from "@/assets/json/chooseOptions.json";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Breadcrumb } from "antd";
import { text2speechApi } from "@/api/modules/user";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import NavBar from "@/components/NavBar";
import { useNavigate, useParams, Link } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import { randomNum } from "@/utils";
import { debounce } from "@/utils/debounce";
import { RootState, useSelector, useDispatch } from "@/redux";
import { setCurrentDay, setGrades } from "@/redux/modules/user";

enum Lang {
  ZH = "zh",
  EN = "en",
}

const ListenPick: React.FC = () => {
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

  const [lang, setLang] = useState<Lang>(Lang.ZH);

  const langOptions = [
    { label: "CN", value: Lang.ZH },
    { label: "EN", value: Lang.EN },
  ];

  const handleLangChange = (value: Lang) => {
    setLang(value);
  };

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
        voice: lang == Lang.ZH ? "youxiaozhi" : "youxiaomei",
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
      setCanNext(true);
      // setTimeout(() => {
      //   handleNext();
      // }, 500);
      const newGrades = JSON.parse(JSON.stringify(Grades));
      newGrades[parseInt(params.id as string) - 1].grade_3[level - 1] = 1;
      dispatch(setGrades(newGrades));
    } else {
      setCanNext(true);
      const newGrades = JSON.parse(JSON.stringify(Grades));
      newGrades[parseInt(params.id as string) - 1].grade_3[level - 1] = 2;
      dispatch(setGrades(newGrades));
    }
  };

  const handleNext = () => {
    const data = chooseOptions.find(
      (item) => item.lesson === parseInt(params.id as string)
    );
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
      <NavBar onBack={back}>英翻中</NavBar>
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
            title: "英翻中",
          },
        ]}
      />
      <div className="flex-1 py-[34px] px-[32px] text-[#171717] flex flex-col justify-between items-center">
        <div>
          <p className="text-center mb-[32px] text-[24px]">
            听
            <span className="font-bold">
              {lang == Lang.ZH ? "中文" : "英文"}
            </span>
            单词，选择正确的
            <span className="font-bold">
              {lang == Lang.EN ? "中文" : "英文"}
            </span>
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

                {lang == Lang.ZH ? item.en : item.zh}
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
                  debouncedText2speech(
                    lang == Lang.ZH
                      ? dataSource?.content[level - 1].word_zh
                      : dataSource?.content[level - 1].word_en
                  )
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
        {/* 切换语言 */}
        <Button
          className="border-[3px] border-[#DDDDDD] bg-white w-[184px] h-[80px] p-0 text-[36px] text-black mt-[30px]"
          ghost
          onClick={() => handleLangChange(lang == Lang.ZH ? Lang.EN : Lang.ZH)}
        >
          <div className="flex items-center justify-center gap-[24px]">
            <SvgIcon name={lang} className="w-[56px] h-[56px]" />
            <span>
              {langOptions.find((item) => item.value === lang)?.label}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ListenPick;
