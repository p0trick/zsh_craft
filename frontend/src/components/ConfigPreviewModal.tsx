import React from 'react';
import { Modal, Button, message } from 'antd';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';

interface ConfigPreviewModalProps {
  open: boolean;
  onClose: () => void;
  zshrc: string;
  config?: any;
}

const ConfigPreviewModal: React.FC<ConfigPreviewModalProps> = ({ 
  open, 
  onClose, 
  zshrc, 
  config 
}) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(zshrc);
      messageApi.success('已复制到剪贴板');
    } catch {
      messageApi.error('复制失败');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([zshrc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zshrc';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {messageContextHolder}
      <Modal open={open} onCancel={onClose} title="zshrc 预览" footer={null} width={800}>
      <div className="flex gap-2 mb-2">
        <Button icon={<CopyOutlined />} onClick={handleCopy}>复制全部</Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownload}>下载zshrc</Button>
      </div>
      <pre className="bg-gray-100 rounded p-3 text-xs max-h-[60vh] overflow-auto font-mono whitespace-pre-wrap">{zshrc}</pre>
      </Modal>
    </>
  );
};

export default ConfigPreviewModal; 