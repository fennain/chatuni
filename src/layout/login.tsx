import vchain from "@/assets/images/Vchain.png";
import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Modal, Button,Select } from "antd";
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
  const [isEmail, setIsEmail] = useState(false);
  const [open, setOpen] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);

  const key = "loading";
  const codeList = [
    { value: "+1", label: "+1" },
    { value: "+44", label: "+44" },
    { value: "+86", label: "+86" },
    { value: "+49", label: "+49" },
    { value: "+33", label: "+33" },
    { value: "+91", label: "+91" },
    { value: "+81", label: "+81" },
    { value: "+61", label: "+61" },
    { value: "+7", label: "+7" },
    { value: "+55", label: "+55" },
    { value: "+39", label: "+39" },
    { value: "+82", label: "+82" },
    { value: "+34", label: "+34" },
    { value: "+46", label: "+46" },
    { value: "+27", label: "+27" },
  ];

  const wxLogin = () => {};

  const onFinish = async (values: ReqLogin) => {
    // if (!/^1[3456789]\d{9}$/.test(values?.phone))
    //   return message.error("请输入正确的手机号");
    try {
      // loading
      setLoading(true);

      message.open({ key, type: "loading", content: "logining..." });

      // user login
      const { result } = await loginApi({
        identifier: isEmail ? values?.email : values?.phone,
        type: isEmail ? "2" : "1",
        ...values,
      });
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
      title={
        <div className="flex justify-between items-center">
          <span>ChatUni</span>
          <Button
            type="primary"
            size="small"
            onClick={() => setIsEmail((pre) => !pre)}
          >
            {isEmail ? "手机登录" : "邮箱登录"}
          </Button>
        </div>
      }
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
        initialValues={{ countrycode: "+86" }}
      >
        {isEmail ? (
          <Form.Item name="email" label="邮箱号" rules={[{ required: true }]}>
            <Input className="" placeholder="" allowClear />
          </Form.Item>
        ) : (
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <div className="flex gap-1">
              <Form.Item name="countrycode" noStyle>
                <Select style={{ width: 120 }} options={codeList} />
              </Form.Item>
              <Input className="" placeholder="" allowClear />
            </div>
          </Form.Item>
        )}

        <Form.Item name="code" label="验证码" rules={[{ required: true }]}>
          <div className="h-full flex items-center gap-[17.87px] md:gap-[17.87PX]">
            <Input
              className="flex-1 relative z-10 tracking-widest"
              placeholder=""
              maxLength={6}
            />
            <SendButton isEmail={isEmail} form={formRef}></SendButton>
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
