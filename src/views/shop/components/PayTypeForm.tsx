import React, { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import { Button, Form, Input, Modal, Select } from "antd";

interface Values {
  method: string;
}

interface CollectionCreateFormProps {
  initialValues: Values;
  onFormInstanceReady: (instance: FormInstance<Values>) => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  onFormInstanceReady,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const originList = [
    { value: "Alipay", label: "支付宝" },
    { value: "Wechat", label: "微信" },
    // { value: "UnionPay", label: "银联" },
  ];

  useEffect(() => {
    onFormInstanceReady(form);
  }, []);
  return (
    <Form
      initialValues={initialValues}
      layout="vertical"
      requiredMark={false}
      form={form}
      name="form_in_modal"
    >
      <Form.Item
        name="method"
        rules={[{ required: true, message: "请选择支付方式" }]}
      >
        <Select
          options={originList}
          placeholder="请选择支付方式"
          size="large"
        />
      </Form.Item>
    </Form>
  );
};

interface CollectionCreateFormModalProps {
  open: boolean;
  confirmLoading: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  initialValues: Values;
}

const CollectionCreateFormModal: React.FC<CollectionCreateFormModalProps> = ({
  open,
  onCreate,
  onCancel,
  initialValues,
  confirmLoading
}) => {
  const [formInstance, setFormInstance] = useState<FormInstance>();

  return (
    <Modal
      open={open}
      title="选择支付方式"
      okText="确认"
      cancelText="取消"
      okButtonProps={{ autoFocus: true }}
      onCancel={onCancel}
      destroyOnClose
      confirmLoading={confirmLoading}
      centered
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          //   formInstance?.resetFields();
          onCreate(values);
        } catch (error) {
          console.log("Failed:", error);
        }
      }}
    >
      <CollectionCreateForm
        initialValues={initialValues}
        onFormInstanceReady={(instance) => {
          setFormInstance(instance);
        }}
      />
    </Modal>
  );
};

export default CollectionCreateFormModal;
