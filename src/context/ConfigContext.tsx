import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ZshConfig } from "../utils/configSchema";

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
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ZshConfig>(() => loadConfigFromStorage());

  // 当配置发生变化时，自动保存到 localStorage
  useEffect(() => {
    saveConfigToStorage(config);
  }, [config]);

  const updateConfig = (patch: Partial<ZshConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ConfigContext.Provider value={{ config, setConfig, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}; 