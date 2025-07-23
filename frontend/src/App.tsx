import React, { useState } from 'react';
import { Layout, ConfigProvider, theme, message, Modal, Spin } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import ZinitInit from './pages/ZinitInit';
import Alias from './pages/Alias';
import EnvVar from './pages/EnvVar';
import PathVar from './pages/PathVar';
import Plugin from './pages/Plugin';
import PluginDetail from './pages/PluginDetail';
import ZshOption from './pages/ZshOption';
import InitScript from './pages/InitScript';
import ConfigPreviewModal from './components/ConfigPreviewModal';
import { generateZshrc } from './utils/zshrcGenerator';
import { useConfig } from './context/ConfigContext';
import { appConfig } from './config/appConfig';

const { Sider, Header, Content } = Layout;

const App: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { config, setConfig, isLoading } = useConfig();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  // 处理顶部栏操作
  const handleImport = (importedConfig: any) => {
    setConfig(importedConfig);
  };
  const handlePreview = () => setPreviewOpen(true);
  const handleDownload = () => {
    const zshrc = generateZshrc(config);
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
        const zshrc = generateZshrc(config);
        
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

  // Ant Design主题配置
  const themeConfig = {
    token: {
      colorPrimary: '#6b7280', // 更浅的灰色主题色
      colorPrimaryHover: '#9ca3af',
      colorPrimaryActive: '#4b5563',
    },
    components: {
      Menu: {
        itemSelectedBg: '#6b7280',
        itemHoverBg: '#9ca3af',
        itemActiveBg: '#6b7280',
        itemSelectedColor: '#ffffff', // 选中项文字颜色为白色
        itemColor: '#374151', // 普通项文字颜色为深灰色
      },
      Progress: {
        defaultColor: '#6b7280',
        remainingColor: '#e5e7eb',
        successColor: '#10b981',
      },
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      {messageContextHolder}
      {modalContextHolder}
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header className="bg-gray-700 p-0">
            <Topbar
              onImport={handleImport}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onApply={handleApply}
              config={config}
              showApplyButton={appConfig.showApplyButton}
            />
          </Header>
          <Layout>
            <Sider width={220} className="bg-white shadow-md">
              <Sidebar />
            </Sider>
            <Content className="bg-gray-50">
              <Spin spinning={isLoading} tip="正在加载配置..." size="large">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/zinit" element={<ZinitInit />} />
                  <Route path="/alias" element={<Alias />} />
                  <Route path="/pathvar" element={<PathVar />} />
                  <Route path="/env" element={<EnvVar />} />
                  <Route path="/plugin" element={<Plugin />} />
                  <Route path="/plugin/:pluginIndex" element={<PluginDetail />} />
                  <Route path="/zshopt" element={<ZshOption />} />
                  <Route path="/init" element={<InitScript />} />
                </Routes>
              </Spin>
            </Content>
          </Layout>
        </Layout>
        {/* zshrc预览弹窗 */}
        <ConfigPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          zshrc={generateZshrc(config)}
          showApplyButton={appConfig.showApplyButton}
          config={config}
        />
      </Router>
    </ConfigProvider>
  );
};

export default App;
