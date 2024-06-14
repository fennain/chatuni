import React, { useState, useEffect, useMemo } from "react";
import { Result, Button, Collapse } from "antd";
import { List } from "antd-mobile";
import { getUserInfoApi, setUserInfoApi } from "@/api/modules/user";
import NavBar from "@/components/NavBar";
import defaultAvatar from "@/assets/images/defaultAvatar.png";
import { message, modal } from "@/hooks/useMessage";
import { setGlobalState } from "@/redux/modules/global";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { setToken, setUserInfo } from "@/redux/modules/user";
import { RootState, useSelector, useDispatch } from "@/redux";
import SvgIcon from "@/components/SvgIcon";
import { useNavigate } from "react-router-dom";

const Me: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const [formValues, setFormValues] = useState<any>();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(setGlobalState({ key: "tabbarKey", value: "me" }));
  }, []);

  return (
    <Result
      status="success"
      title="Successfully Purchased Cloud Server ECS!"
      subTitle="Cloud server configuration takes 1-5 minutes, please wait."
      extra={[
        <Button type="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      ]}
    />
  );
};

export default Me;
