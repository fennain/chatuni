import React, { useState, useEffect, useMemo } from "react";
import { Breadcrumb, Button, Empty } from "antd";
import { goodsListApi, createpayorder } from "@/api/modules/shop";
import NavBar from "@/components/NavBar";
import PayTypeForm from "./components/PayTypeForm";
import { message, modal } from "@/hooks/useMessage";
import { setGlobalState } from "@/redux/modules/global";
import { RootState, useSelector, useDispatch } from "@/redux";
import { useNavigate, useParams, Link } from "react-router-dom";

const Shop: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.user.token);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // 判断是否微信浏览器
  const isWechat = useMemo(
    () =>
      String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) ===
      "micromessenger",
    []
  );
  // 判断是否PC
  const isPC = useMemo(() => {
    const flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return !flag;
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [goodsList, setGoodsList] = useState<Shop.goodsList[] | null>(null);
  const [currentId, setCurrentId] = useState<number>(-1);

  const back = () => navigate("/me");

  const getList = async () => {
    const { result } = await goodsListApi();
    setGoodsList(result);
  };

  const handleclick = (item: Shop.goodsList) => {
    setCurrentId(item.id);
    setOpenModal(true);
  };

  const onCreate = async (values: any) => {
    console.log("Received values of form: ", values);
    setConfirmLoading(true);
    try {
      const { result } = await createpayorder({
        ...values,
        // scenariocode: "ONLINE_QRCODE", // 二维码支付
        scenariocode: "ONLINE_WAP", // 移动h5支付
        id: currentId,
      });
      if (result?.payurl) {
        window.open(result?.payurl); // 浏览器直接打开
      }
      // message.success("Add success");
      setOpenModal(false); //关闭modal
      getList();
    } finally {
      setConfirmLoading(false); //关闭loading
    }
  };

  useEffect(() => {
    dispatch(setGlobalState({ key: "tabbarKey", value: "me" }));
    getList();
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
    <div className="flex flex-col h-full px-[30px] py-[10px]">
      <NavBar onBack={back}>商店</NavBar>
      <Breadcrumb
        className="ipad:hidden mx-[30px] mt-[10px]"
        itemRender={itemRender}
        items={[
          {
            path: "/me",
            title: "我的",
          },
          {
            title: `商店`,
          },
        ]}
      />
      {goodsList?.length == 0 && <Empty />}
      <div className="flex-1 grid auto-rows-min grid-cols-4 mobile:grid-cols-2 overflow-y-auto w-full mx-auto gap-[20px] mobile:gap-2 mobile:pt-[30px] pt-[10px]">
        {goodsList?.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer shadow rounded-md h-10 overflow-hidden flex flex-col"
            onClick={() => handleclick(item)}
          >
            <div className="w-full h-1/2 bg-[#F2F2F2] text-[36px] flex justify-center items-center">
              {item.description}
            </div>
            <div className="w-full h-1/2 bg-[#92D050] text-white text-[36px] flex justify-center items-center">{`${
              item.fee / 100
            } ${item.currency}`}</div>
          </div>
        ))}
      </div>
      <PayTypeForm
        initialValues={{ method: "Wechat" }}
        open={openModal}
        confirmLoading={confirmLoading}
        onCreate={onCreate}
        onCancel={() => setOpenModal(false)}
      />
    </div>
  );
};

export default Shop;
