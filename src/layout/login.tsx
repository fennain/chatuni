import vchain from "@/assets/images/Vchain.png";
import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Modal, Button } from "antd";
import { HOME_URL } from "@/config";
import { setToken, setUserInfo } from "@/redux/modules/user";
import { RootState, useSelector, useDispatch } from "@/redux";
import { loginApi } from "@/api/modules/login";
import { ReqLogin } from "@/api/interface";
import { useNavigate } from "react-router-dom";
import { message } from "@/hooks/useMessage";
import { SubmitButton, SendButton } from "./components/buttons";
import type { FormProps } from "antd/es/form";
// import {
//   showFullScreenLoading,
//   tryHideFullScreenLoading,
// } from "@/components/Loading/fullScreen";

const Login: React.FC = () => {
  console.log("login重新渲染");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 判断是否微信浏览器
  const isWechat = useMemo(
    () =>
      String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) ===
      "micromessenger",
    []
  );
  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);

  const key = "loading";

  const wxLogin = () => {};

  const onFinish = async (values: ReqLogin) => {
    // if (!/^1[3456789]\d{9}$/.test(values?.phone))
    //   return message.error("请输入正确的手机号");
    try {
      // loading
      setLoading(true);

      message.open({ key, type: "loading", content: "logining..." });

      // user login
      const {result} = await loginApi(values);
      console.log(result);
      // return
      dispatch(setToken(result.token));
      dispatch(setUserInfo({ ...result, token: undefined }));
      message.success("登录成功");
      // navigate to home
      navigate(HOME_URL);
    } finally {
      setLoading(false);
      message.destroy(key);
    }
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log(isWechat);
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    document.onkeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        formRef.submit();
      }
    };
    return () => {
      document.onkeydown = () => {};
    };
  }, []);

  useEffect(() => {
    if (token) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [token]);

  return (
    <Modal
      className=""
      title="ChatUni"
      centered
      width={540}
      open={open}
      destroyOnClose={true}
      maskClosable={false}
      keyboard={false}
      closeIcon={null}
      footer={null}
    >
      <Form
        name="login"
        layout="vertical"
        autoComplete="off"
        size="large"
        form={formRef}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
          <Input className="" placeholder="" allowClear />
        </Form.Item>
        <Form.Item name="code" label="验证码" rules={[{ required: true }]}>
          <div className="h-full flex items-center gap-[17.87px] md:gap-[17.87PX]">
            <Input
              className="flex-1 relative z-10 tracking-widest"
              placeholder=""
              maxLength={6}
            />
            <SendButton form={formRef}></SendButton>
          </div>
        </Form.Item>
        <Form.Item className="login-form-button">
          <div className="flex flex-col justify-center items-center gap-[10px]">
            <SubmitButton form={formRef} loading={loading}>
              登录
            </SubmitButton>
            {/* <Button type="primary" block onClick={wxLogin}>
              微信登录
            </Button> */}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
