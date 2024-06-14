import { RootState, useSelector } from "@/redux";
import classnames from "classnames";
import chooseOptions from "@/assets/json/chooseOptions.json";
import NavBar from "@/components/NavBar";
import { useNavigate } from "react-router-dom";
import SvgIcon from "@/components/SvgIcon";

const Choose: React.FC = () => {
  const navigate = useNavigate();

  const currentDay = useSelector((state: RootState) => state.user.currentDay);

  const back = () => navigate('/Course/1');
  const handleClick = (id: number) => {
    if (id <= currentDay) navigate(`/ListenCarefully/${id}`);
  };

  return (
    <div className="flex flex-col h-full">
      <NavBar onBack={back}>仔细听</NavBar>
      <div className="flex-1 overflow-hidden py-[74px] px-[32px] text-[#171717] text-[24px] flex flex-col">
        <p className="text-center mb-[32px]">听一个英语单词并选择正确的书写方式</p>
        <div className="flex-1 overflow-hidden overflow-y-auto flex flex-col gap-[48px]">
          {chooseOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.lesson)}
              className={classnames(
                "flex justify-between items-center gap-[41px]",
                {
                  active: currentDay == item.lesson,
                  "cursor-pointer": currentDay >= item.lesson,
                }
              )}
            >
              <div
                className={classnames(
                  "rounded-full bg-white w-[120px] h-[120px] border-[4px] flex flex-col justify-center items-center gap-[4px]",
                  {
                    "border-[#E3B700]": currentDay == item.lesson,
                    "text-[#E3B700]": currentDay == item.lesson,
                    "border-[#2CBE99]": currentDay > item.lesson,
                    "text-[#2CBE99]": currentDay > item.lesson,
                    "border-[#C6C6C6]": currentDay < item.lesson,
                    "text-[#C6C6C6]": currentDay < item.lesson,
                  }
                )}
              >
                <span className="text-[24px] font-bold">Day</span>
                <span className="text-[48px] font-bold leading-none">
                  {item.lesson}
                </span>
              </div>
              <div
                className={classnames(
                  "relative flex-1 text-[24px] h-full bg-white border-[4px] rounded-[24px] text-[#171717] p-[24px] flex items-center",
                  {
                    "border-[#E3B700]": currentDay == item.lesson,
                    "border-[#2CBE99]": currentDay > item.lesson,
                    "border-[#C6C6C6]": currentDay < item.lesson,
                  }
                )}
              >
                {item.topic}
                {currentDay > item.lesson && (
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

export default Choose;
