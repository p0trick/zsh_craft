import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EnvVarItem } from '../utils/configSchema';

interface EnvVarTableProps {
  value: EnvVarItem[];
  onChange: (list: EnvVarItem[]) => void;
}

const EnvVarTable: React.FC<EnvVarTableProps> = ({ value, onChange }) => {
  const [data, setData] = useState<EnvVarItem[]>(value);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { setData(value); }, [value]);

  const isEditing = (record: EnvVarItem) => editingKey === record.key;

  const edit = (record: EnvVarItem) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey(null);

  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as EnvVarItem;
      const newData = [...data];
      const idx = newData.findIndex((item) => item.key === key);
      if (idx > -1) {
        newData[idx] = row;
        setData(newData);
        onChange(newData);
        setEditingKey(null);
      }
    } catch {}
  };

  const handleDelete = (key: string) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    onChange(newData);
  };

  const handleAdd = () => {
    const newItem: EnvVarItem = { key: '', value: '' };
    setData([newItem, ...data]);
    setEditingKey('');
    form.setFieldsValue(newItem);
  };

  const columns = [
    {
      title: '变量名',
      dataIndex: 'key',
      width: 120,
      editable: true,
      render: (_: any, record: EnvVarItem) => {
        if (!isEditing(record)) return record.key;
        return (
          <Form.Item name="key" style={{ margin: 0 }} rules={[{ required: true, message: '请输入变量名' }]}> 
            <Input placeholder="如 EDITOR" style={{ width: 100 }} />
          </Form.Item>
        );
      },
    },
    {
      title: '变量值',
      dataIndex: 'value',
      width: 220,
      editable: true,
      render: (_: any, record: EnvVarItem) => {
        if (!isEditing(record)) return record.value;
        return (
          <Form.Item name="value" style={{ margin: 0 }} rules={[{ required: true, message: '请输入变量值' }]}> 
            <Input placeholder="如 nvim" style={{ width: 180 }} />
          </Form.Item>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      render: (_: any, record: EnvVarItem) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <a onClick={() => save(record.key)}>保存</a>
            <a onClick={cancel}>取消</a>
          </Space>
        ) : (
          <Space>
            <a onClick={() => edit(record)}>编辑</a>
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Button icon={<PlusOutlined />} type="dashed" onClick={handleAdd} style={{ marginBottom: 12 }}>新增环境变量</Button>
      <Form form={form} component={false}>
        <Table
          rowKey="key"
          columns={columns as any}
          dataSource={data}
          pagination={false}
          size="middle"
        />
      </Form>
    </div>
  );
};

export default EnvVarTable; 