import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ZshConfig } from "../utils/configSchema";
import { appConfig } from "../config/appConfig";
import { message } from "antd";
import { generateZshrc } from "../utils/zshrcGenerator";

// 默认配置
const defaultConfig: ZshConfig = {
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
};

// localStorage 键名
const STORAGE_KEY = 'zsh_craft_config';

// 从 localStorage 加载配置
const loadConfigFromStorage = (): ZshConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 确保所有必需的字段都存在
      return {
        ...defaultConfig,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('从localStorage加载配置失败:', error);
  }
  return defaultConfig;
};

// 从服务器加载配置
const loadConfigFromServer = async (): Promise<ZshConfig> => {
  try {
    const response = await fetch('/api/load_config');
    const result = await response.json();
    
    if (result.success && result.config) {
      const parsed = JSON.parse(result.config);
      return {
        ...defaultConfig,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('从服务器加载配置失败:', error);
  }
  return defaultConfig;
};

// 保存配置到服务器
const saveConfigToServer = async (config: ZshConfig): Promise<boolean> => {
  try {
    const zshrc = generateZshrc(config);
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
    return result.success;
  } catch (error) {
    console.error('保存配置到服务器失败:', error);
    return false;
  }
};

// 保存配置到 localStorage
const saveConfigToStorage = (config: ZshConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('保存配置到localStorage失败:', error);
  }
};

type ConfigContextType = {
  config: ZshConfig;
  setConfig: (c: ZshConfig) => void;
  updateConfig: (patch: Partial<ZshConfig>) => void;
  resetConfig: () => void;
  isLoading: boolean;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ZshConfig>(() => loadConfigFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();

  // 初始化时从服务器加载配置（生产环境）
  useEffect(() => {
    if (appConfig.autoSave) {
      setIsLoading(true);
      loadConfigFromServer().then((serverConfig) => {
        setConfig(serverConfig);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  }, []);

  // 当配置发生变化时，自动保存
  useEffect(() => {
    if (appConfig.autoSave) {
      // 生产环境：保存到服务器
      saveConfigToServer(config).then((success) => {
        if (!success) {
          messageApi.error('配置保存失败，请检查网络连接');
        }
      });
    } else {
      // 开发环境：保存到 localStorage
      saveConfigToStorage(config);
    }
  }, [config]);

  const updateConfig = (patch: Partial<ZshConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    if (appConfig.autoSave) {
      saveConfigToServer(defaultConfig);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <>
      {messageContextHolder}
      <ConfigContext.Provider value={{ config, setConfig, updateConfig, resetConfig, isLoading }}>
        {children}
      </ConfigContext.Provider>
    </>
  );
};

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}; 