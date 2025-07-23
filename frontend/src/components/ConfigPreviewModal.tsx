import React from 'react';
import { Modal, Button, message } from 'antd';
import { CopyOutlined, DownloadOutlined, PlayCircleOutlined } from '@ant-design/icons';

interface ConfigPreviewModalProps {
  open: boolean;
  onClose: () => void;
  zshrc: string;
  showApplyButton?: boolean;
  config?: any;
}

const ConfigPreviewModal: React.FC<ConfigPreviewModalProps> = ({ 
  open, 
  onClose, 
  zshrc, 
  showApplyButton = false,
  config 
}) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
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

  const handleApply = async () => {
    // 显示确认对话框
    modal.confirm({
      title: '确认应用配置',
      content: (
        <div>
          <p>此操作将：</p>
          <ul className="list-disc list-inside">
            <li>更新您的 ~/.zshrc 文件</li>
            <li>保存配置文件到 ~/.zsh_cfg/zsh_config.json</li>
            <li>自动创建备份文件（.backup 后缀）</li>
          </ul>
          <p className="mt-2 text-orange-600">⚠️ 请确保您已备份重要配置</p>
        </div>
      ),
      okText: '确认应用',
      cancelText: '取消',
      okType: 'primary',
      onOk: async () => {
        // 显示加载提示
        const loadingMessage = messageApi.loading('正在应用配置...', 0);
        
        try {
          const response = await fetch('/api/apply_config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              zshrc_content: zshrc,
              zsh_config: JSON.stringify(config),
            }),
          });

          const result = await response.json();
          
          // 关闭加载提示
          loadingMessage();
          
          if (result.success) {
            messageApi.success('配置应用成功！zshrc已更新到 ~/.zshrc，配置文件已保存到 ~/.zsh_cfg/zsh_config.json');
            // 应用成功后关闭预览弹窗
            onClose();
          } else {
            messageApi.error(`配置应用失败: ${result.message}`);
          }
        } catch (error) {
          // 关闭加载提示
          loadingMessage();
          messageApi.error('网络错误，请检查后端服务是否正在运行在 http://localhost:8080');
        }
      },
    });
  };

  return (
    <>
      {messageContextHolder}
      {modalContextHolder}
      <Modal open={open} onCancel={onClose} title="zshrc 预览" footer={null} width={800}>
      <div className="flex gap-2 mb-2">
        <Button icon={<CopyOutlined />} onClick={handleCopy}>复制全部</Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownload}>下载zshrc</Button>
        {showApplyButton && (
          <Button 
            icon={<PlayCircleOutlined />} 
            type="primary" 
            onClick={handleApply}
          >
            应用zshrc
          </Button>
        )}
      </div>
      <pre className="bg-gray-100 rounded p-3 text-xs max-h-[60vh] overflow-auto font-mono whitespace-pre-wrap">{zshrc}</pre>
      </Modal>
    </>
  );
};

export default ConfigPreviewModal; 