import classnames from "classnames";
import NavBar from "@/components/NavBar";
import { useNavigate } from "react-router-dom";
import { Tabs as TabsPC } from "antd";
import React, { useRef, useEffect } from "react";
import { Tabs, Swiper } from "antd-mobile";
import { SwiperRef } from "antd-mobile/es/components/swiper";
import SvgIcon from "@/components/SvgIcon";
import { RootState, useSelector, useDispatch } from "@/redux";
import { shallowEqual } from "react-redux";
import { setGlobalState } from "@/redux/modules/global";
import sentence from "@/assets/images/sentence.png";
import words from "@/assets/images/words.png";
import mp3 from "@/assets/images/mp3.png";

const tabItems = [
  { key: "base", title: "ChatUni课程" },
  { key: "zk", title: "中考课程" },
  { key: "gk", title: "高考课程" },
  { key: "ielts", title: "雅思课程" },
];

const Level: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const back = () => {
    window.location.href = "https://meta.smartkit.vip/teacher/";
  };

  const swiperRef = useRef<SwiperRef>(null);
  const { courseKey } = useSelector(
    (state: RootState) => ({
      courseKey: state.global.courseKey ?? 0,
    }),
    shallowEqual
  );
  const onChange = (key: string) => {
    const index = tabItems.findIndex((item) => item.key === key);
    dispatch(setGlobalState({ key: "courseKey", value: index }));
    swiperRef.current?.swipeTo(index);
  };

  const Grades = useSelector((state: RootState) => state.user.Grades);
  console.log(Grades);

  useEffect(() => {
    dispatch(setGlobalState({ key: "tabbarKey", value: "course" }));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <NavBar backArrow={false}>选择课程</NavBar>
      <div className="flex-1 overflow-hidden pb-[32px] text-[#171717] text-[24px] flex flex-col gap-[20px]">
        <Tabs
          className="desktop:hidden"
          activeKey={tabItems[courseKey].key}
          onChange={onChange}
        >
          {tabItems.map((item) => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
        </Tabs>
        <TabsPC
          className="ipad:hidden"
          size="large"
          activeKey={tabItems[courseKey].key}
          onChange={onChange}
          centered
          items={tabItems.map((tab) => {
            return {
              label: tab.title,
              key: tab.key,
            };
          })}
        />
        <Swiper
          direction="horizontal"
          indicator={() => null}
          ref={swiperRef}
          defaultIndex={courseKey}
          onIndexChange={(index) => {
            dispatch(setGlobalState({ key: "courseKey", value: index }));
          }}
        >
          <Swiper.Item>
            <div className="h-full overflow-hidden overflow-y-auto grid ipad:grid-cols-1 grid-cols-2 gap-[48px] px-[20px] select-none">
              {new Array(4).fill(null).map((_, index) => (
                <div
                  key={index}
                  className={classnames(
                    "flex desktop:flex-col justify-between items-center gap-[16px] h-fit",
                    {
                      "cursor-pointer": false,
                    }
                  )}
                >
                  <div
                    className={classnames(
                      "rounded-full bg-white w-[160px] h-[160px] border-[4px] flex flex-col justify-center items-center gap-[4px]",
                      {
                        "border-[#E3B700]": true,
                        "text-[#E3B700]": true,
                        "border-[#2CBE99]": false,
                        "text-[#2CBE99]": false,
                        "border-[#C6C6C6]": false,
                        "text-[#C6C6C6]": false,
                      }
                    )}
                  >
                    <span className="text-[24px] font-bold">等级</span>
                    <span className="text-[64px] font-bold leading-none">
                      0{index + 1}
                    </span>
                  </div>
                  <div
                    className={classnames(
                      "relative flex-1 text-[24px] desktop:w-full h-full bg-white border-[4px] rounded-[48px] text-[#171717] p-[24px] grid grid-cols-4 gap-[24px]",
                      {
                        "border-[#E3B700]": true,
                      }
                    )}
                  >
                    {Grades?.slice(0 + index * 10, 10 + index * 10).map(
                      (item, i) => (
                        <div
                          key={i}
                          className={classnames("text-center cursor-pointer", {
                            "text-black":
                              item.grade_1.every((num) => num == 0) &&
                              item.grade_2.every((num) => num == 0) &&
                              item.grade_3.every((num) => num == 0),
                            "text-[green]":
                              item.grade_1.every((num) => num == 1) &&
                              item.grade_2.every((num) => num == 1) &&
                              item.grade_3.every((num) => num == 1),
                            "text-[red]":
                              item.grade_1.some(
                                (num) => num == 2 || num == 0
                              ) ||
                              item.grade_2.some(
                                (num) => num == 2 || num == 0
                              ) ||
                              item.grade_3.some((num) => num == 2 || num == 0),
                          })}
                          onClick={() => navigate(`/Course/${item.lesson}`)}
                        >{`${index + 1}-${i + 1}`}</div>
                      )
                    )}
                  </div>
                </div>
              ))}

              {/* {new Array(8).fill(null).map((_, index) => (
                <div
                  key={index}
                  className={classnames(
                    "flex desktop:flex-col justify-between items-center gap-[16px]",
                    {
                      "cursor-pointer": false,
                    }
                  )}
                >
                  <div
                    className={classnames(
                      "rounded-full bg-white w-[160px] h-[160px] border-[4px] flex flex-col justify-center items-center gap-[4px]",
                      {
                        "border-[#E3B700]": false,
                        "text-[#E3B700]": false,
                        "border-[#2CBE99]": false,
                        "text-[#2CBE99]": false,
                        "border-[#C6C6C6]": true,
                        "text-[#C6C6C6]": true,
                      }
                    )}
                  >
                    <span className="text-[24px] font-bold">等级</span>
                    <span className="text-[64px] font-bold leading-none">
                      0{index + 2}
                    </span>
                  </div>
                  <div
                    className={classnames(
                      "relative flex-1 text-[24px] desktop:w-full h-full bg-white border-[4px] rounded-[48px] text-[#171717] p-[24px] grid grid-cols-4 gap-[24px] gap-[24px]",
                      {
                        "border-[#C6C6C6]": true,
                      }
                    )}
                  >
                    {Grades?.map((item, i) => (
                      <div
                        key={i}
                        className={classnames("text-center", {
                          "text-black": true,
                        })}
                      >{`${index + 2}-${item.lesson}`}</div>
                    ))}
                  </div>
                </div>
              ))} */}
            </div>
          </Swiper.Item>
          <Swiper.Item>
            <div className="max-h-full overflow-hidden overflow-y-auto ipad:mt-[44px] grid grid-cols-2 gap-[16px] w-full px-[20px]">
              <div
                onClick={() => navigate("/exam/listen_sentence/zk")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                <img src={sentence} className="w-[150px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    中考，听句子背单词
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    跟AI读单词和句子，提升单词量
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/exam/ListenCarefully/zk")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                <img src={words} className="w-[130px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    每日中考必背单词
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    听英语并选择正确的单词
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/exam/listen_mp3/zk")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                <img src={mp3} className="w-[200px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    听力训练
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    听句子选择正确答案
                  </p>
                </div>
              </div>
            </div>
          </Swiper.Item>
          <Swiper.Item>
            <div className="max-h-full overflow-hidden overflow-y-auto ipad:mt-[44px]  grid grid-cols-2 gap-[16px] w-full px-[20px]">
              <div
                onClick={() => navigate("/exam/listen_sentence/gk")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                <img src={sentence} className="w-[150px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    高考，听句子背单词
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    跟AI读单词和句子，提升单词量
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/exam/ListenCarefully/gk")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                <img src={words} className="w-[130px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    每日高考必背单词
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    听英语并选择正确的单词
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/exam/listen_mp3/gk")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                <img src={mp3} className="w-[200px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    听力训练
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    听句子选择正确答案
                  </p>
                </div>
              </div>
            </div>
          </Swiper.Item>
          <Swiper.Item>
            <div className="max-h-full overflow-hidden overflow-y-auto ipad:mt-[44px]  grid grid-cols-2 gap-[16px] w-full px-[20px]">
              <div
                onClick={() => navigate("/exam/listen_sentence/ielts")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                <img src={sentence} className="w-[150px]" alt="" />
                {/* <SvgIcon name="1" className="w-[227px] h-[100px]" /> */}
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    雅思，听句子背单词
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    跟AI读单词和句子，提升单词量
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/exam/ListenCarefully/ielts")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                {/* <SvgIcon name="2" className="w-[227px] h-[100px]" /> */}
                <img src={words} className="w-[130px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    每日雅思必背单词
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    听英语并选择正确的单词
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/exam/listen_mp3/ielts")}
                className="cursor-pointer rounded-[48px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] h-[340px] border-[2px] border-[#DDDDDD] p-[32px] flex flex-col items-center"
              >
                {/* <SvgIcon name="4" className="w-[227px] h-[100px]" /> */}
                <img src={mp3} className="w-[200px]" alt="" />
                <div className="text-center mt-[30px]">
                  <p className="text-[24px] font-bold text-[#171717]">
                    听力训练
                  </p>
                  <p className="text-[20px] text-[#5E5E5E]">
                    听句子选择正确答案
                  </p>
                </div>
              </div>
            </div>
          </Swiper.Item>
        </Swiper>
      </div>
    </div>
  );
};

export default Level;
