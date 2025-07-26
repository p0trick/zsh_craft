import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all the complex dependencies
jest.mock('react-router', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div data-testid="route">{element}</div>,
}));

jest.mock('antd', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
  ConfigProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="config-provider">{children}</div>,
  Spin: ({ children, spinning }: { children: React.ReactNode; spinning: boolean }) => (
    <div data-testid="spin" data-spinning={spinning}>{children}</div>
  ),
}));

jest.mock('./components/Sidebar', () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock('./components/Topbar', () => () => <div data-testid="topbar">Topbar</div>);
jest.mock('./pages/Home', () => () => <div data-testid="home">Home</div>);
jest.mock('./pages/ZinitInit', () => () => <div data-testid="zinit-init">ZinitInit</div>);
jest.mock('./pages/Alias', () => () => <div data-testid="alias">Alias</div>);
jest.mock('./pages/EnvVar', () => () => <div data-testid="env-var">EnvVar</div>);
jest.mock('./pages/PathVar', () => () => <div data-testid="path-var">PathVar</div>);
jest.mock('./pages/Plugin', () => () => <div data-testid="plugin">Plugin</div>);
jest.mock('./pages/PluginDetail', () => () => <div data-testid="plugin-detail">PluginDetail</div>);
jest.mock('./pages/ZshOption', () => () => <div data-testid="zsh-option">ZshOption</div>);
jest.mock('./pages/InitScript', () => () => <div data-testid="init-script">InitScript</div>);
jest.mock('./components/ConfigPreviewModal', () => () => <div data-testid="config-preview-modal">ConfigPreviewModal</div>);

jest.mock('./context/ConfigContext', () => ({
  useConfig: () => ({
    config: {
      zinitInit: {
        brewPath: "/opt/homebrew/bin/brew",
        zinitHome: "${XDG_DATA_HOME:-${HOME}/.local/share}/zinit/zinit.git",
      },
      aliases: [],
      pathVars: [],
      envVars: [],
      plugins: [],
      zshOptions: [],
      initScript: "",
    },
    setConfig: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('./utils/zshrcGenerator', () => ({
  generateZshrc: jest.fn(() => '# Generated zshrc content'),
}));

// Import App after all mocks are set up
import App from './App';

test('renders App component without crashing', () => {
  render(<App />);
  
  // Check that the main components are rendered
  expect(screen.getByTestId('config-provider')).toBeInTheDocument();
  expect(screen.getByTestId('router')).toBeInTheDocument();
  expect(screen.getByTestId('layout')).toBeInTheDocument();
  expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  expect(screen.getByTestId('topbar')).toBeInTheDocument();
});

test('renders main content area', () => {
  render(<App />);
  
  // Check that the content area is rendered
  expect(screen.getByTestId('spin')).toBeInTheDocument();
  expect(screen.getByTestId('routes')).toBeInTheDocument();
});

test('spin component shows correct loading state', () => {
  render(<App />);
  
  const spinElement = screen.getByTestId('spin');
  expect(spinElement).toHaveAttribute('data-spinning', 'false');
});
