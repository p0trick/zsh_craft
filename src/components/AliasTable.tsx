import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Popconfirm, Form, Select, Tooltip, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AliasItem } from '../utils/configSchema';
import { loadYamlFile } from '../utils/yamlLoader';

interface AliasTableProps {
  value: AliasItem[];
  onChange: (list: AliasItem[]) => void;
}

const AliasTable: React.FC<AliasTableProps> = ({ value, onChange }) => {
  const [data, setData] = useState<AliasItem[]>(value);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [commonAlias, setCommonAlias] = useState<AliasItem[]>([]);

  useEffect(() => { setData(value); }, [value]);
  useEffect(() => {
    loadYamlFile<AliasItem[]>('/src/assets/alias.yaml').then((data) => {
      setCommonAlias(data);
      console.log('commonAlias', data);
    }).catch(() => {
      setCommonAlias([]);
      // 调用antd的错误通知
      message.error('加载别名失败，请检查文件路径');
    });
  }, []);

  const isEditing = (record: AliasItem) => editingKey === record.name;

  const edit = (record: AliasItem) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.name);
  };

  const cancel = () => setEditingKey(null);

  const save = async (name: string) => {
    try {
      const row = (await form.validateFields()) as AliasItem;
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
    const newItem: AliasItem = { name: '', alias: '', description: '' };
    setData([newItem, ...data]);
    setEditingKey('');
    form.setFieldsValue(newItem);
  };

  const columns = [
    {
      title: '原命令',
      dataIndex: 'name',
      width: 120,
      editable: true,
      render: (_: any, record: AliasItem) => {
        if (!isEditing(record)) return record.name;
        console.log('commonAlias', commonAlias);
        return (
          <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: '请输入原命令' }]}> 
            <Select
              showSearch
              allowClear
              placeholder="选择或输入命令"
              style={{ width: 100 }}
              options={commonAlias.map(a => ({ value: a.name, label: a.name }))}
              filterOption={(input, option) => (option?.label as string).includes(input)}
            />
          </Form.Item>
        );
      },
    },
    {
      title: '别名',
      dataIndex: 'alias',
      width: 120,
      editable: true,
      render: (_: any, record: AliasItem) => {
        if (!isEditing(record)) return record.alias;
        return (
          <Form.Item name="alias" style={{ margin: 0 }} rules={[{ required: true, message: '请输入别名' }]}> 
            <Input placeholder="别名" style={{ width: 100 }} />
          </Form.Item>
        );
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: 180,
      editable: true,
      render: (_: any, record: AliasItem) => {
        if (!isEditing(record)) return (
          <Tooltip title={record.description}>{record.description}</Tooltip>
        );
        return (
          <Form.Item name="description" style={{ margin: 0 }}>
            <Input placeholder="说明" style={{ width: 150 }} />
          </Form.Item>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      render: (_: any, record: AliasItem) => {
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
      <Button icon={<PlusOutlined />} type="dashed" onClick={handleAdd} style={{ marginBottom: 12 }}>新增别名</Button>
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

export default AliasTable; 