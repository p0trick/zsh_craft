import React, { useRef } from 'react';
import { Button, Space, message } from 'antd';
import { UploadOutlined, DownloadOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ZshConfig } from '../utils/configSchema';
import { appConfig } from '../config/appConfig';

interface TopbarProps {
  onImport: (config: ZshConfig) => void;
  onPreview: () => void;
  onDownload: () => void;
  config: ZshConfig;
}

const Topbar: React.FC<TopbarProps> = ({ 
  onImport, 
  onPreview, 
  onDownload, 
  config
}) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const fileInput = useRef<HTMLInputElement>(null);

  // 处理文件导入
  const handleFileImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        onImport(json);
        messageApi.success('导入成功');
      } catch {
        messageApi.error('配置文件格式错误');
      }
    };
    reader.readAsText(file);
  };

  // 处理导入按钮点击
  const handleImportClick = () => {
    fileInput.current?.click();
  };

  // 处理导出按钮点击
  const handleExportClick = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zsh_config.json';
    a.click();
    URL.revokeObjectURL(url);
    messageApi.success('导出成功');
  };

  return (
    <>
      {messageContextHolder}
      <div className="flex items-center justify-between px-6 h-16 bg-gray-700 shadow-sm border-b">
      <div className="text-xl font-bold tracking-wide text-white">Zsh 配置生成器</div>
      <Space size="middle">
        {/* 隐藏的文件输入 */}
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileImport(file);
          }}
          style={{ display: 'none' }}
          ref={fileInput}
        />
        {appConfig.showImportExport && (
          <>
            <Button icon={<UploadOutlined />} onClick={handleImportClick}>
              导入配置
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportClick}>
              导出配置
            </Button>
          </>
        )}
        <Button icon={<EyeOutlined />} onClick={onPreview}>
          预览zshrc
        </Button>
        <Button icon={<FileTextOutlined />} type="primary" onClick={onDownload}>
          下载zshrc
        </Button>
      </Space>
      </div>
    </>
  );
};

export default Topbar; 