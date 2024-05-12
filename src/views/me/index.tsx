import React, { useState, useEffect, useMemo } from "react";
import { Avatar, Button, Collapse } from "antd";
import { List } from "antd-mobile";
import { getUserInfoApi, setUserInfoApi } from "@/api/modules/user";
import NavBar from "@/components/NavBar";
import MillisecondsToDuration from "./components/MillisecondsToDuration";
import UserInfoForm from "./components/UserInfoForm";
import defaultAvatar from "@/assets/images/defaultAvatar.png";
import { message, modal } from "@/hooks/useMessage";
import { setGlobalState } from "@/redux/modules/global";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { setToken, setUserInfo } from "@/redux/modules/user";
import { RootState, useSelector, useDispatch } from "@/redux";
import SvgIcon from "@/components/SvgIcon";

const Me: React.FC = () => {
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [goodsIndex, setGoodsIndex] = useState<number>(0);

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

  /**
   * 登出
   */
  const logout = () => {
    modal.confirm({
      title: "退出登录",
      icon: <ExclamationCircleOutlined />,
      content: "你想退出登录吗？",
      okText: "确认",
      cancelText: "取消",
      maskClosable: true,
      centered: true,
      okType: "danger",
      onOk: async () => {
        dispatch(setToken(""));
        // location.reload();
      },
    });
  };

  const getInfo = async () => {
    if (!token) return;
    const { result } = await getUserInfoApi();
    console.log(result);
    dispatch(setUserInfo(result));
  };

  const [formValues, setFormValues] = useState<any>();
  const [openModal, setOpenModal] = useState(false);

  const onCreate = async (values: any) => {
    console.log("Received values of form: ", values);
    setFormValues(values);
    setOpenModal(false);
    await setUserInfoApi(values);
    getInfo();
  };

  useEffect(() => {
    dispatch(setGlobalState({ key: "tabbarKey", value: "me" }));
    getInfo();
    // 获取openid
    if (isWechat && !userInfo.openid) {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        import.meta.env.VITE_APP_WEIXIN_USERINFO_APPID
      }&redirect_uri=${encodeURIComponent(
        "https://chatuni.smartkit.vip/teacher/me"
      )}&response_type=code&scope=snsapi_userinfo&state=recharge#wechat_redirect`;
    }
  }, []);

  return (
    <div className="flex flex-col h-full px-[30px] py-[10px] bg-[#F2F2F2]">
      <NavBar backArrow={false}>我的</NavBar>
      <div className="flex-1 overflow-y-auto w-full desktop:w-[572px] mx-auto space-y-[10px] mobile:space-y-[20px] desktop:pt-[50px]">
        <div className="flex items-center gap-[40px] ipad:gap-[20px]">
          <div className="relative">
            <Avatar
              src={defaultAvatar}
              className="size-[70px] ipad:size-[140px]"
            />
            <SvgIcon
              name={`sex${userInfo.sex}`}
              className="ipad:text-[44px] text-[20px] absolute top-0 -right-[20px]"
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center">
              <h1 className="ipad:text-[50px] text-[30px] flex-1 truncate">
                {userInfo.nickname || "游客"}
              </h1>
              <SvgIcon
                name="edit"
                className="ipad:text-[44px] text-[22px] cursor-pointer hover:text-[#3AE3B9]"
                onClick={() => setOpenModal(true)}
              />
            </div>

            <div className="flex justify-between">
              <p>ID：{userInfo.userid}</p>
              <p></p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mobile:text-[25px]">
          <div className="flex flex-col items-center">
            <MillisecondsToDuration milliseconds={parseInt(userInfo.remainingduration)} />
            <p>目前剩余时长</p>
          </div>
          <div className="flex flex-col items-center">
            <MillisecondsToDuration milliseconds={parseInt(userInfo.usageduration)} />
            <p>累计使用时长</p>
          </div>
          <div className="flex flex-col items-center">
            <MillisecondsToDuration milliseconds={parseInt(userInfo.giftduration)} />
            <p>已累积获得赠送时长</p>
          </div>
        </div>

        <List mode="card" className="m-0">
          <List.Item
            className="text-black desktop:text-[25px]"
            onClick={() => {}}
          >
            我的VIP
          </List.Item>
          <List.Item
            className="text-black desktop:text-[25px]"
            onClick={() => {}}
          >
            邀请有礼
          </List.Item>
          <List.Item
            className="text-black desktop:text-[25px]"
            onClick={() => {}}
          >
            兑换码
          </List.Item>
        </List>
        <List mode="card" className="m-0">
          <List.Item
            className="text-black desktop:text-[25px]"
            onClick={() => {}}
          >
            用户协议
          </List.Item>
          <List.Item
            className="text-black desktop:text-[25px]"
            onClick={() => {}}
          >
            问题反馈
          </List.Item>
          <List.Item
            className="text-black desktop:text-[25px]"
            onClick={logout}
          >
            退出登录
          </List.Item>
        </List>
      </div>
      <UserInfoForm
        initialValues={{ nickname: userInfo.nickname, sex: userInfo.sex }}
        open={openModal}
        onCreate={onCreate}
        onCancel={() => setOpenModal(false)}
      />
    </div>
  );
};

export default Me;
