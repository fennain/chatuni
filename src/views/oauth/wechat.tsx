import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SvgIcon from "@/components/SvgIcon";
import { RootState, useSelector, useDispatch } from "@/redux";
import { message } from "@/hooks/useMessage";
import { SubmitButton, SendButton } from "./components/buttons";
import type { FormProps } from "antd/es/form";
import { Spin, Form, Input } from "antd";
import { setToken, setUserInfo } from "@/redux/modules/user";

const Wechat: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const token = useSelector((state: RootState) => state.user.token);

  const [bindPhone, setBindPhone] = useState(false);
  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ReqLogin) => {
    if (!/^1[3456789]\d{9}$/.test(values?.phone))
      return message.error("请输入正确的手机号");
    try {
      // loading
      setLoading(true);

      message.open({ key, type: "loading", content: "logining..." });

      // user login
      const { token, id, name, email, metamask } = await loginApi(values);
      dispatch(setToken(token));
      dispatch(setUserInfo({ id, name, email, metamask }));
      message.success("Login success");
      // navigate to home
      navigate(HOME_URL, { replace: true });
    } finally {
      setLoading(false);
      message.destroy(key);
    }
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {}, []);

  const wxLogin = async () => {
    try {
      const { data } = await wxLoginApi<Login.loginRes>(code);
      // console.log(data.accessToken)
      if (data.accessToken) {
        authStore.setToken(data.accessToken);
        authStore.setRefreshToken(data.refreshToken);
        userStore.updateUserInfo({
          avatar: data.headImgUrl,
          name: data.nickname,
        });
        await authStore.getIntegralList();
        return window.location.replace(homeUrl);
      }
      navigate("/", { replace: true });
    } catch (error) {
      return navigate("/500");
    }
  };

  useEffect(() => {
    if (code && !token) {
      // 有code并且没有本地token,走微信登录
      wxLogin();
    }
  }, [code, token]);

  return (
    <div className="flex flex-col h-full justify-center items-center px-[30px]">
      {bindPhone ? (
        <Form
          className="w-[400px] mobile:w-full"
          name="bind"
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
                type="number"
              />
              <SendButton form={formRef}></SendButton>
            </div>
          </Form.Item>
          <Form.Item className="login-form-button">
            <div className="flex flex-col justify-center items-center gap-[10px]">
              <SubmitButton form={formRef} loading={loading}>
                绑定手机号
              </SubmitButton>
            </div>
          </Form.Item>
        </Form>
      ) : (
        <Spin size="large" tip="Loading">
          <div className="p-[50px]" />
        </Spin>
      )}
    </div>
  );
};

export default Wechat;
