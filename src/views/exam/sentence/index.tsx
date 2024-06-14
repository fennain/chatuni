/* eslint-disable @typescript-eslint/no-explicit-any */
import classnames from "classnames";
import zhongkao_sentence from "@/assets/json/zhongkao/zhongkao_sentence.json";
import gaokao_sentence from "@/assets/json/gaokao/gao_sentence.json";
import ielts_sentence from "@/assets/json/ielts/ielts_sentence.json";
import React, { useState, useEffect } from "react";
import { Button, Breadcrumb } from "antd";
import { Toast } from "antd-mobile";
import { uploadApi, speech2textApi, text2speechApi,recordaudioApi } from "@/api/modules/user";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import NavBar from "@/components/NavBar";
import { useNavigate, useParams, Link } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";
import { RootState, useSelector, useDispatch } from "@/redux";
import { setCurrentSentence } from "@/redux/modules/user";
import { message } from "@/hooks/useMessage";
import { debounce } from "@/utils/debounce";
import { ExamType, formatExamType } from "../interface";
import { diffChars, Change } from "diff";

//必须引入的核心
import Recorder from "recorder-core";

//引入mp3格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
// import "recorder-core/src/engine/mp3";
// import "recorder-core/src/engine/mp3-engine";
//录制wav格式的用这一句就行
import "recorder-core/src/engine/wav";

const ReadWithMe: React.FC = () => {
  const dispatch = useDispatch();
  const { playAudio } = useAudioPlayer();
  const navigate = useNavigate();
  const params = useParams();

  const currentSentence = useSelector(
    (state: RootState) => state.user.currentSentence
  );

  const [dataSource, setDataSource] = useState<zhongkao_sentence | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
  //   null
  // );
  const [rec, setRec] = useState(null);
  let recordTimeout: NodeJS.Timeout; // 定义一个变量来存储定时器

  const recOpen = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("已获取录音权限");
      //创建录音对象
      const mediaRecorder = Recorder({
        type: "wav", //录音格式，可以换成wav等其他格式
        sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
        bitRate: 16, //录音的比特率，越大音质越好
      });

      console.log(rec);
      //打开录音，获得权限
      mediaRecorder.open(
        () => {
          console.log("录音已打开");
        },
        (msg, isUserNotAllow) => {
          //用户拒绝了录音权限，或者浏览器不支持录音
          console.log(
            (isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg
          );
        }
      );
      setRec(() => mediaRecorder);
    } catch (error: any) {
      console.log(error?.message);
      if (error?.message == "Requested device not found") {
        return message.error(
          "未识别到系统声音输入设备，无法使用麦克风录制声音"
        );
      }
      if (error?.message == "Permission denied") {
        return message.error("未获取到麦克风权限，可在导航栏打开对应权限");
      }
      if (error?.message == "Permission dismissed") {
        return message.error("请允许麦克风权限");
      }
    }
  };

  useEffect(() => {
    console.log(params);
    if (params.id && params.type) {
      let localData;
      switch (params.type) {
        case ExamType.ZHONGKAO:
          localData = zhongkao_sentence;
          break;
        case ExamType.GAOKAO:
          localData = gaokao_sentence;
          break;
        case ExamType.IELTS:
          localData = ielts_sentence;
          break;

        default:
          localData = zhongkao_sentence;
          break;
      }
      const data = localData.find(
        (item) => item.id === parseInt(params.id as string)
      );
      if (data) setDataSource(data as unknown as zhongkao_sentence);
      console.log(data);
    }
    recOpen();
  }, []);

  const handleStartRecording = (e) => {
    // 防止默认的长按行为，如文本选择等
    e.preventDefault();
    // 设置定时器，长按1秒后开始录音
    recordTimeout = setTimeout(async () => {
      if (!rec || !Recorder.IsOpen()) {
        console.error("未打开录音");
        recOpen();
        return;
      }
      rec.start();
      console.log("已开始录音");
      Toast.show({
        content: "开始录音",
        duration: 1000,
      });
    }, 600); // 1秒后开始录音
  };

  const handleStopRecording = () => {
    clearTimeout(recordTimeout); // 停止定时器
    if (!rec) {
      console.error("未打开录音");
      return;
    }

    rec.stop(
      (blob: Blob, duration: number) => {
        Toast.show({
          content: "录音结束",
          duration: 1000,
        });
        //blob就是我们要的录音文件对象，可以上传，或者本地播放
        // blob = blob;
        //简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
        const localUrl = (window.URL || webkitURL).createObjectURL(blob);
        console.log("录音成功", blob, localUrl, "时长:" + duration + "ms");

        console.log(blob); //把blob文件上传到服务器
        upload(blob);
        // rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
        // setRec(() => null);
      },
      (err) => {
        console.error("结束录音出错：" + err);
        // rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
        // setRec(() => null);
      }
    );
  };

  /**
   * 上传录音文件
   * @returns
   */
  const upload = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("language", "en");
      const { data } = await uploadApi<{ name: string }>(formData);
      console.log(data);
      // setTimeout(() => {
      speech2text(data.name);
      // 打点
      let listenertype;
      switch (params.type) {
        case ExamType.ZHONGKAO:
          listenertype = 2;
          break;
        case ExamType.GAOKAO:
          listenertype = 3;
          break;
        case ExamType.IELTS:
          listenertype = 4;
          break;

        default:
          listenertype = 2;
          break;
      }
      recordaudioApi({
        filename: data.name,
        listenertype,
        subtype: 1,
        listenerid: params.id,
        subid: level - 1,
      });
      // }, 5000);
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * 语音转文本
   * @returns
   */
  const speech2text = async (filename: string) => {
    try {
      const { result } = await speech2textApi({
        filename,
        fromlanguage: "en",
        tolanguage: "en",
        language: "zh",
      });
      console.log(result);
      if (result?.text) {
        const oldText = replacePunctuationWithSpace(
          dataSource?.content[level - 1].word_en.toLowerCase() as string
        );
        const diff = diffChars(
          oldText,
          replacePunctuationWithSpace(result.text.toLowerCase())
        );
        // if (diff.length == 1) {
        //   setTimeout(() => {
        //     handleNext();
        //   }, 800);
        // }
        setDiffResult(diff);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * 标点符号替换为空格
   * @param str
   * @returns
   */
  function replacePunctuationWithSpace(str: string) {
    return str.replace(/[^\w\s]|_/g, " ");
  }

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

  const downloadRecording = (audioBlob: Blob) => {
    // const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const back = () => navigate(`/exam/listen_sentence/${params.type}`);

  const handleNext = () => {
    if ((dataSource?.content.length ?? 0) > level) {
      setLevel(level + 1);
      setDiffResult([]);
    } else {
      // 完成阅读
      if ((currentSentence ?? 1) === dataSource?.id)
        dispatch(setCurrentSentence(dataSource?.id + 1));
      navigate(`/exam/listen_sentence/${params.type}`);
    }
  };

  function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={currentRoute?.path}>{currentRoute.title}</Link>
    );
  }

  return (
    <div className="flex flex-col bg-white ipad:min-h-full">
      <NavBar onBack={back}>{`${dataSource?.topic ?? ""}`}</NavBar>
      <Breadcrumb
        className="ipad:hidden mx-[30px] mt-[10px]"
        itemRender={itemRender}
        items={[
          {
            path: "/level",
            title: "选择课程",
          },
          {
            path: `/exam/listen_sentence/${params.type}`,
            title: `${formatExamType(params.type as ExamType)}，听句子背单词`,
          },
          {
            title: `${dataSource?.topic ?? ""}`,
          },
        ]}
      />
      <div className="flex-1 p-[32px] desktop:pb-[120px] text-[#171717] flex flex-col justify-between items-center space-y-[30px] relative">
        <div>
          <p className="text-center text-[32px] font-bold">跟我读</p>
          <p className="text-center mb-[32px] text-[24px]">
            用AI正确发音阅读单词和句子
          </p>
        </div>
        <div className="space-y-[48px] w-full desktop:w-[687px] mx-auto">
          <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] min-h-[481px] border-[2px] border-[#DDDDDD] rounded-[48px] p-[28px] flex flex-col items-center justify-between">
            <div className="w-full relative flex justify-center">
              {dataSource?.content[level - 1].phonetic_en && (
                <span className="absolute left-0 top-0 bottom-0 my-auto text-[#2CBE99] text-[32px]">
                  本句核心单词
                </span>
              )}

              <span className="text-[#2CBE99] text-[32px] font-bold">{`${dataSource?.id}/${level}`}</span>
            </div>
            <div className="text-[#171717] text-[36px] font-bold text-center">
              <p>{dataSource?.content[level - 1].word_en}</p>
              {dataSource?.content[level - 1].phonetic_en && (
                <>
                  <p className="space-x-[8px]">
                    <span>{dataSource?.content[level - 1]["n."]}</span>
                    <span>{dataSource?.content[level - 1].phonetic_en}</span>
                  </p>
                  <p className="">{dataSource?.content[level - 1].word_cn}</p>
                </>
              )}
              {diffResult.length > 0 && (
                <p>
                  {diffResult.map((item, index) => (
                    <span
                      key={index}
                      className={classnames({
                        hidden: item.removed,
                        "text-[red]": item.added,
                        "text-[green]": !item.added && !item.removed,
                      })}
                    >
                      {item.value}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <span className="text-[#CB1F1F] text-[24px] font-bold">
              跟我重复读
            </span>
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
                className="border-[4px] border-[#E3B700] text-[#E3B700] bg-white w-[271px] h-[76px] text-[36px]"
                type="primary"
                ghost
                onClick={handleNext}
              >
                {level < (dataSource?.content.length ?? 0)
                  ? "下一个"
                  : "完成阅读"}
              </Button>
            </div>
          </div>
        </div>

        <Button
          className="desktop:absolute desktop:right-0 desktop:bottom-0 border-4 border-[#fff] bg-[#3AE3B9] active:bg-[red] w-[130px] h-[130px] flex justify-center items-center"
          type="primary"
          shape="circle"
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
        >
          <SvgIcon name="mic" className="h-full w-[56px]" />
        </Button>
      </div>
    </div>
  );
};

export default ReadWithMe;
