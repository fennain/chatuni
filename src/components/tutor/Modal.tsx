import { useState, useImperativeHandle, forwardRef } from "react";
import { Modal } from "antd";
import { require } from "@/utils/require";
// import styles from "./index.module.less";

export interface ModalRef {
  showModal: (data: any) => void;
}

const ModalIndex = forwardRef<ModalRef, object>((_props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  useImperativeHandle(ref, () => ({ showModal }));

  const showModal = (data: any) => {
    console.log(data);
    setData(data);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title=""
      centered
      width={920}
      open={isModalOpen}
      destroyOnClose={true}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="bg-white desktop:px-[30px] py-[30px]">
        <div className="mx-auto flex flex-col items-center">
          <img
            className="w-[213px]"
            src={require(`tutoricons/${data?.icon}.png`)}
          />
          <span className="text-[#171717] text-[36px]">{data?.name}</span>
        </div>
        <div className="space-y-[16px] mt-[30px]">
          <p>
            <span className="desktop:text-[20px] text-[24px] font-bold">
              语速
            </span>
            <span className="text-[24px] font-bold text-[#2CBE99] ml-[10px]">
              {data?.speed2}
            </span>
          </p>
          <p className="desktop:text-[20px] text-[24px] font-bold">性格</p>
          <div className="flex flex-wrap gap-[12px]">
            {data?.personality.split("|").map((item, index) => (
              <div
                key={index}
                className="rounded-full border-[2px] border-[#DDDDDD] px-[24px] py-[6px]"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="desktop:text-[20px] text-[24px] font-bold">技能</p>
          <div className="flex flex-wrap gap-[12px]">
            {data?.skill.split("|").map((item, index) => (
              <div
                key={index}
                className="rounded-full border-[2px] border-[#DDDDDD] px-[24px] py-[6px]"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="desktop:text-[20px] text-[24px] font-bold">描述</p>
          <p className="desktop:text-[20px] text-[24px] text-[#727272]">
            {data?.desc}
          </p>
        </div>
      </div>
    </Modal>
  );
});

export default ModalIndex;
