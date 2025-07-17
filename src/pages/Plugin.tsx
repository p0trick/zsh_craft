import React from 'react';
import { Card, Button, Table, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import type { PluginItem } from '../utils/configSchema';

const Plugin: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate('/plugin/new');
  };

  const handleEdit = (record: PluginItem, index: number) => {
    navigate(`/plugin/${index}`);
  };

  const handleDelete = (index: number) => {
    const newPlugins = config.plugins.filter((_, i) => i !== index);
    updateConfig({ plugins: newPlugins });
    message.success('插件删除成功');
  };

  const columns = [
    {
      title: '插件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PluginItem) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            {record.loadType}
            {(record.loadType === 'wait' || record.loadType === 'wait lucid') && record.waitTime && ` (${record.waitTime}s)`}
            {record.ice?.from && ` (${record.ice.from})`}
          </div>
        </div>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span className="text-gray-600">{text || '-'}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: PluginItem, index: number) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record, index)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(index)}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card 
        title="插件配置 (zinit)" 
        bordered={false}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
          >
            新增插件
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={config.plugins}
          rowKey={(record, index) => index?.toString() || '0'}
          pagination={false}
          locale={{
            emptyText: '暂无插件配置，点击"新增插件"开始配置',
          }}
        />
      </Card>
    </div>
  );
};

export default Plugin; 