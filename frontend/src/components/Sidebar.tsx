import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SettingOutlined, BranchesOutlined, CodeOutlined, AppstoreOutlined, FileTextOutlined, ToolOutlined, FolderOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/zinit', icon: <SettingOutlined />, label: '初始化zinit' },
  { key: '/alias', icon: <BranchesOutlined />, label: 'Alias配置' },
  { key: '/pathvar', icon: <FolderOutlined />, label: '路径变量' },
  { key: '/env', icon: <AppstoreOutlined />, label: '环境变量' },
  { key: '/plugin', icon: <ToolOutlined />, label: '插件配置' },
  { key: '/zshopt', icon: <CodeOutlined />, label: 'zsh选项' },
  { key: '/init', icon: <FileTextOutlined />, label: '初始化脚本' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      className="min-h-screen text-base"
    />
  );
};

export default Sidebar; 