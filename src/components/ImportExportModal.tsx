import React, { useRef } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ZshConfig } from '../utils/configSchema';
import type { RcFile } from 'antd/es/upload/interface';

interface ImportExportModalProps {
  open: boolean;
  onClose: () => void;
  config: ZshConfig;
  onImport: (config: ZshConfig) => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ open, onClose, config, onImport }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  // 导出json
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zsh_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入json
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        onImport(json);
        message.success('导入成功');
        onClose();
      } catch {
        message.error('配置文件格式错误');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal open={open} onCancel={onClose} title="导入/导出配置" footer={null}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
            }}
            style={{ display: 'none' }}
            ref={fileInput}
          />
          <Button 
            icon={<UploadOutlined />} 
            onClick={() => fileInput.current?.click()}
          >
            导入zsh_config.json
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出zsh_config.json</Button>
        </div>
        <div>
          <div className="font-semibold mb-1">当前配置预览：</div>
          <pre className="bg-gray-100 rounded p-2 text-xs max-h-60 overflow-auto">{JSON.stringify(config, null, 2)}</pre>
        </div>
      </div>
    </Modal>
  );
};

export default ImportExportModal; 