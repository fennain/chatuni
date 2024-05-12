import { useState, useEffect } from "react";
import { Toast } from "antd-mobile";
import "./MicButton.css";
//必须引入的核心
import Recorder from "recorder-core";

import "recorder-core/src/engine/wav";

interface MicButtonProps {
  onAudioBlob: (audioBlob: Blob) => void;
}

const MicButton = ({ onAudioBlob }: MicButtonProps) => {
  const [rec, setRec] = useState(null);
  let recordTimeout: number; // 定义一个变量来存储定时器

  const handleMouseDown = (e) => {
    console.log(Recorder.IsOpen(), rec);
    // 防止默认的长按行为，如文本选择等
    e.preventDefault();
    // 设置定时器，长按后开始录音
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
    }, 600);
  };

  const handleMouseUp = () => {
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
        onAudioBlob(blob);
        // rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
        // setRec(() => null);
      },
      (err) => {
        console.error("结束录音出错：" + err);
        // Toast.show({
        //   content: err,
        //   duration: 1000,
        // });
        // rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
        // setRec(() => null);
      }
    );
  };

  useEffect(() => {
    recOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      // console.log(rec);
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
        return console.error(
          "未识别到系统声音输入设备，无法使用麦克风录制声音"
        );
      }
      if (error?.message == "Permission denied") {
        return console.error("未获取到麦克风权限，可在导航栏打开对应权限");
      }
      if (error?.message == "Permission dismissed") {
        return console.error("请允许麦克风权限");
      }
    }
  };

  return (
    <button
      className="micButton desktop:w-[100px] w-[130px] desktop:h-[100px] h-[130px] desktop:text-[40px] text-[50px]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <i className="bi bi-mic-fill"></i>
    </button>
  );
};

export default MicButton;
