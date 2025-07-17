import React, { useState } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import ZinitInit from './pages/ZinitInit';
import Alias from './pages/Alias';
import EnvVar from './pages/EnvVar';
import Plugin from './pages/Plugin';
import PluginDetail from './pages/PluginDetail';
import ZshOption from './pages/ZshOption';
import InitScript from './pages/InitScript';
import ImportExportModal from './components/ImportExportModal';
import ConfigPreviewModal from './components/ConfigPreviewModal';
import { generateZshrc } from './utils/zshrcGenerator';
import { useConfig } from './context/ConfigContext';

const { Sider, Header, Content } = Layout;

const App: React.FC = () => {
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { config, setConfig } = useConfig();

  // 处理顶部栏操作
  const handleImport = () => setImportExportOpen(true);
  const handleExport = () => setImportExportOpen(true);
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
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header className="bg-gray-700 p-0">
            <Topbar
              onImport={handleImport}
              onExport={handleExport}
              onPreview={handlePreview}
              onDownload={handleDownload}
            />
          </Header>
          <Layout>
            <Sider width={220} className="bg-white shadow-md">
              <Sidebar />
            </Sider>
            <Content className="bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/zinit" element={<ZinitInit />} />
                <Route path="/alias" element={<Alias />} />
                <Route path="/env" element={<EnvVar />} />
                <Route path="/plugin" element={<Plugin />} />
              <Route path="/plugin/:pluginIndex" element={<PluginDetail />} />
                <Route path="/zshopt" element={<ZshOption />} />
                <Route path="/init" element={<InitScript />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
        {/* 导入/导出弹窗 */}
        <ImportExportModal
          open={importExportOpen}
          onClose={() => setImportExportOpen(false)}
          config={config}
          onImport={setConfig}
        />
        {/* zshrc预览弹窗 */}
        <ConfigPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          zshrc={generateZshrc(config)}
        />
      </Router>
    </ConfigProvider>
  );
};

export default App;
