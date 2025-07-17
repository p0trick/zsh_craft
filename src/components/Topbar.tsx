import React from 'react';
import { Button, Space, Dropdown } from 'antd';
import { UploadOutlined, DownloadOutlined, EyeOutlined, FileTextOutlined, DownOutlined } from '@ant-design/icons';

interface TopbarProps {
  onImport: () => void;
  onExport: () => void;
  onPreview: () => void;
  onDownload: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onImport, onExport, onPreview, onDownload }) => {
  const importExportItems = [
    {
      key: 'import',
      icon: <UploadOutlined />,
      label: '导入配置',
      onClick: onImport,
    },
    {
      key: 'export',
      icon: <DownloadOutlined />,
      label: '导出配置',
      onClick: onExport,
    },
  ];

  return (
    <div className="flex items-center justify-between px-6 h-16 bg-gray-700 shadow-sm border-b">
      <div className="text-xl font-bold tracking-wide text-white">Zsh 配置生成器</div>
      <Space size="middle">
        <Dropdown
          menu={{
            items: importExportItems,
          }}
          placement="bottomRight"
        >
          <Button icon={<UploadOutlined />}>
            配置管理 <DownOutlined />
          </Button>
        </Dropdown>
        <Button icon={<EyeOutlined />} onClick={onPreview}>
          预览zshrc
        </Button>
        <Button icon={<FileTextOutlined />} type="primary" onClick={onDownload}>
          下载zshrc
        </Button>
      </Space>
    </div>
  );
};

export default Topbar; 