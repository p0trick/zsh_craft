import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PathVarItem } from '../utils/configSchema';

interface PathVarTableProps {
  value: PathVarItem[];
  onChange: (list: PathVarItem[]) => void;
}

const PathVarTable: React.FC<PathVarTableProps> = ({ value, onChange }) => {
  const [data, setData] = useState<PathVarItem[]>(value);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { setData(value); }, [value]);

  const isEditing = (record: PathVarItem) => editingKey === record.name;

  const edit = (record: PathVarItem) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.name);
  };

  const cancel = () => setEditingKey(null);

  const save = async (name: string) => {
    try {
      const row = (await form.validateFields()) as PathVarItem;
      const newData = [...data];
      const idx = newData.findIndex((item) => item.name === name);
      if (idx > -1) {
        newData[idx] = row;
        setData(newData);
        onChange(newData);
        setEditingKey(null);
      }
    } catch {}
  };

  const handleDelete = (name: string) => {
    const newData = data.filter((item) => item.name !== name);
    setData(newData);
    onChange(newData);
  };

  const handleAdd = () => {
    const newItem: PathVarItem = { name: '', path: '' };
    setData([newItem, ...data]);
    setEditingKey('');
    form.setFieldsValue(newItem);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
      editable: true,
      render: (_: any, record: PathVarItem) => {
        if (!isEditing(record)) return record.name;
        return (
          <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: '请输入名称' }]}> 
            <Input placeholder="如 本地命令" style={{ width: 100 }} />
          </Form.Item>
        );
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
      width: 220,
      editable: true,
      render: (_: any, record: PathVarItem) => {
        if (!isEditing(record)) return record.path;
        return (
          <Form.Item name="path" style={{ margin: 0 }} rules={[{ required: true, message: '请输入路径' }]}> 
            <Input placeholder="/Users/xxx/.local/bin" style={{ width: 180 }} />
          </Form.Item>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      render: (_: any, record: PathVarItem) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <a onClick={() => save(record.name)}>保存</a>
            <a onClick={cancel}>取消</a>
          </Space>
        ) : (
          <Space>
            <a onClick={() => edit(record)}>编辑</a>
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.name)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Button icon={<PlusOutlined />} type="dashed" onClick={handleAdd} style={{ marginBottom: 12 }}>新增路径变量</Button>
      <Form form={form} component={false}>
        <Table
          rowKey="name"
          columns={columns as any}
          dataSource={data}
          pagination={false}
          size="middle"
        />
      </Form>
    </div>
  );
};

export default PathVarTable; 