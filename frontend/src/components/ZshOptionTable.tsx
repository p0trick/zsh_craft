import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Popconfirm, Form, Select, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ZshOptionItem } from '../utils/configSchema';
import { loadYamlFile } from '../utils/yamlLoader';

interface ZshOptionTableProps {
  value: ZshOptionItem[];
  onChange: (list: ZshOptionItem[]) => void;
}

const ZshOptionTable: React.FC<ZshOptionTableProps> = ({ value, onChange }) => {
  const [data, setData] = useState<ZshOptionItem[]>(value);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [commonOptions, setCommonOptions] = useState<ZshOptionItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { setData(value); }, [value]);
  useEffect(() => {
    loadYamlFile<ZshOptionItem[]>('/src/assets/zsh_options.yaml').then(setCommonOptions).catch(() => {});
  }, []);

  const isEditing = (record: ZshOptionItem) => editingKey === record.option;

  const edit = (record: ZshOptionItem) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.option);
  };

  const cancel = () => setEditingKey(null);

  const save = async (option: string) => {
    try {
      const row = (await form.validateFields()) as ZshOptionItem;
      const newData = [...data];
      const idx = newData.findIndex((item) => item.option === option);
      if (idx > -1) {
        newData[idx] = row;
        setData(newData);
        onChange(newData);
        setEditingKey(null);
      }
    } catch {}
  };

  const handleDelete = (option: string) => {
    const newData = data.filter((item) => item.option !== option);
    setData(newData);
    onChange(newData);
  };

  const handleAdd = () => {
    const newItem: ZshOptionItem = { option: '', description: '' };
    setData([newItem, ...data]);
    setEditingKey('');
    form.setFieldsValue(newItem);
  };

  const filteredOptions = search
    ? commonOptions.filter(opt => opt.option.includes(search) || (opt.description || '').includes(search))
    : commonOptions;

  const columns = [
    {
      title: '选项',
      dataIndex: 'option',
      width: 220,
      editable: true,
      render: (_: any, record: ZshOptionItem) => {
        if (!isEditing(record)) return record.option;
        return (
          <Form.Item name="option" style={{ margin: 0 }} rules={[{ required: true, message: '请输入zsh选项' }]}> 
            <Select
              showSearch
              allowClear
              placeholder="选择或输入zsh选项"
              style={{ width: 200 }}
              options={filteredOptions.map(o => ({ value: o.option, label: o.option }))}
              filterOption={(input, option) => (option?.label as string).includes(input)}
              onSelect={val => {
                const found = commonOptions.find(o => o.option === val);
                if (found) {
                  form.setFieldsValue({
                    description: found.description || '',
                  });
                }
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: 220,
      editable: true,
      render: (_: any, record: ZshOptionItem) => {
        if (!isEditing(record)) return (
          <Tooltip title={record.description}>{record.description}</Tooltip>
        );
        return (
          <Form.Item name="description" style={{ margin: 0 }}>
            <Input placeholder="说明" style={{ width: 200 }} />
          </Form.Item>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      render: (_: any, record: ZshOptionItem) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <a onClick={() => save(record.option)}>保存</a>
            <a onClick={cancel}>取消</a>
          </Space>
        ) : (
          <Space>
            <a onClick={() => edit(record)}>编辑</a>
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.option)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center mb-3 gap-2">
        <Button icon={<PlusOutlined />} type="dashed" onClick={handleAdd}>新增选项</Button>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索zsh选项或说明"
          style={{ width: 240 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <Form form={form} component={false}>
        <Table
          rowKey="option"
          columns={columns as any}
          dataSource={data}
          pagination={false}
          size="middle"
        />
      </Form>
    </div>
  );
};

export default ZshOptionTable; 