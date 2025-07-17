import React, { createContext, useContext, useState, ReactNode } from "react";
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

type ConfigContextType = {
  config: ZshConfig;
  setConfig: (c: ZshConfig) => void;
  updateConfig: (patch: Partial<ZshConfig>) => void;
  resetConfig: () => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ZshConfig>(defaultConfig);

  const updateConfig = (patch: Partial<ZshConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const resetConfig = () => setConfig(defaultConfig);

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