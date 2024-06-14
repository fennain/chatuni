import type { FormInstance } from "antd/es/form";
import { Button, Form } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { message } from "@/hooks/useMessage";
import { sendCode } from "@/api/modules/login";

interface SubmitButtonProps {
  form: FormInstance;
  loading?: boolean;
  isEmail?: boolean;
}

/**
 * 登录按钮
 * @param param0
 * @returns
 */
export const SubmitButton: React.FC<
  React.PropsWithChildren<SubmitButtonProps>
> = ({ form, loading, children }) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button
      className="loginBtn"
      type="primary"
      loading={loading}
      htmlType="submit"
      block
    >
      {children}
    </Button>
  );
};

/**
 * 发送按钮
 * @param param0
 * @returns
 */
export const SendButton: React.FC<
  React.PropsWithChildren<SubmitButtonProps>
> = ({ form, isEmail }) => {
  const [sendable, setSendable] = useState<boolean>(true);
  const [codeNumber, setCodeNumber] = useState<number>(-1);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState(false);

  const clearId = useRef<number | null>(null);

  // Watch all values
  const values = Form.useWatch([], form);
  const key = "loading";

  useEffect(() => {
    // console.log("sendable", values);
    if (isSend) return;
    switch (isEmail) {
      case true:
        if (values?.email && !isSend) {
          setSendable(false);
        } else {
          setSendable(true);
        }
        break;
      case false:
        if (values?.phone && !isSend) {
          setSendable(false);
        } else {
          setSendable(true);
        }
        break;

      default:
        break;
    }
  }, [form, isSend, values]);

  /**
   * 发送验证码
   */
  const handleSend = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // 阻止默认的表单提交行为
    console.log("handleSend", values);
    // if (!/^1[3456789]\d{9}$/.test(values?.phone))
    //   return message.error("请输入正确的手机号");
    try {
      // loading
      setSendLoading(true);
      message.open({ key, type: "loading", content: "发送中..." });

      // send verification code
      await sendCode({
        identifier: isEmail ? values?.email : values?.phone,
        countrycode: isEmail ? undefined : values?.countrycode,
        type: isEmail ? "2" : "1",
      });

      // show success message
      message.success("验证码已发送");
      setSendable(true);
      setIsSend(true);

      setCodeNumber(60);
    } finally {
      setSendLoading(false);
      message.destroy(key);
    }
  };

  // 启动定时器
  useEffect(() => {
    if (codeNumber >= 0) {
      clearId.current = setInterval(() => {
        setCodeNumber((prevNumber) => prevNumber - 1);
        console.log("定时器打印", codeNumber);
        if (codeNumber == 0) {
          setSendable(false);
          setIsSend(false);
        }
      }, 1000) as unknown as number;
    }
    return () => {
      if (clearId.current) clearInterval(clearId.current);
    };
  }, [codeNumber]);

  return (
    <Button
      className="sendBtn relative z-10"
      type="primary"
      loading={sendLoading}
      disabled={sendable}
      onClick={handleSend}
    >
      {codeNumber >= 0 ? `${codeNumber}s` : "发送"}
    </Button>
  );
};
