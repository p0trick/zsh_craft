import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SettingOutlined, BranchesOutlined, AppstoreOutlined, ToolOutlined, CodeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useConfig } from '../context/ConfigContext';

const modules = [
  { key: '/zinit', icon: <SettingOutlined />, title: '初始化zinit', desc: 'zinit插件管理器初始化配置' },
  { key: '/alias', icon: <BranchesOutlined />, title: 'Alias配置', desc: '常用命令别名设置' },
  { key: '/env', icon: <AppstoreOutlined />, title: '环境变量', desc: 'PATH与环境变量管理' },
  { key: '/plugin', icon: <ToolOutlined />, title: '插件配置', desc: 'zinit插件与参数管理' },
  { key: '/zshopt', icon: <CodeOutlined />, title: 'zsh选项', desc: 'zsh行为选项设置' },
  { key: '/init', icon: <FileTextOutlined />, title: '初始化脚本', desc: '自定义zshrc脚本片段' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useConfig();
  // 简单进度：已填写模块数/总模块数
  const filled = [
    config.zinitInit && Object.keys(config.zinitInit).length > 0,
    config.aliases.length > 0,
    config.pathVars.length > 0 || config.envVars.length > 0,
    config.plugins.length > 0,
    config.zshOptions.length > 0,
    !!config.initScript,
  ].filter(Boolean).length;
  const percent = Math.round((filled / modules.length) * 100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-2xl font-bold mb-2">欢迎使用 Zsh 配置生成器</div>
        <div className="text-gray-500 mb-2">可视化编辑zshrc，导入导出配置，快速生成高质量zshrc文件。</div>
        <Progress percent={percent} status="active" />
      </div>
      <Row gutter={[24, 24]}>
        {modules.map((m) => (
          <Col xs={24} sm={12} md={8} key={m.key}>
            <Card
              hoverable
              onClick={() => navigate(m.key)}
              className="transition-transform duration-150 hover:scale-105 shadow"
              title={<span className="flex items-center gap-2">{m.icon}{m.title}</span>}
            >
              <div className="text-gray-600 text-sm min-h-[40px]">{m.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home; 