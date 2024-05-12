import React, { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import { Button, Form, Input, Modal, Select } from "antd";

interface Values {
  nickname: string;
  sex: string;
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
    { value: "0", label: "男" },
    { value: "1", label: "女" },
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
      <Form.Item name="sex" rules={[{ required: true, message: "请选择性别" }]}>
        <Select options={originList} placeholder="请选择性别" size="large" />
      </Form.Item>
      <Form.Item
        name="nickname"
        rules={[{ required: true, message: "请输入昵称" }]}
      >
        <Input placeholder="请输入昵称" size="large" />
      </Form.Item>
    </Form>
  );
};

interface CollectionCreateFormModalProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  initialValues: Values;
}

const CollectionCreateFormModal: React.FC<CollectionCreateFormModalProps> = ({
  open,
  onCreate,
  onCancel,
  initialValues,
}) => {
  const [formInstance, setFormInstance] = useState<FormInstance>();

  return (
    <Modal
      open={open}
      title="编辑个人信息"
      okText="确认"
      cancelText="取消"
      okButtonProps={{ autoFocus: true }}
      onCancel={onCancel}
      destroyOnClose
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
