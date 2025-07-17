export interface ZinitInitConfig {
  brewPath: string;
  zinitHome: string;
  [key: string]: any;
}

export interface AliasItem {
  name: string;
  alias: string;
  description?: string;
}

export interface PathVarItem {
  name: string;
  path: string;
}

export interface EnvVarItem {
  key: string;
  value: string;
}

export interface PluginItem {
  name: string;
  description?: string;
  loadType: 'load' | 'light' | 'snippet' | 'wait' | 'wait lucid';
  waitTime?: string; // 可选的等待时间，仅在loadType为wait或wait lucid时使用
  ice?: {
    from?: string;
    as?: string;
    pick?: string;
    atinit?: string;
    atload?: string;
    atclone?: string;
    depth?: number;
    blockf?: boolean;
    compile?: boolean;
    wait?: string;
    lucid?: boolean;
    if?: string;
    has?: string;
    on?: string;
    bindmap?: string;
    mv?: string;
    bpick?: string;
  };
  conditions?: {
    wait?: string;
    lucid?: boolean;
    if?: string;
    has?: string;
    on?: string;
  };
}

export interface ZshOptionItem {
  option: string;
  description?: string;
}

export interface ZshConfig {
  zinitInit: ZinitInitConfig;
  aliases: AliasItem[];
  pathVars: PathVarItem[];
  envVars: EnvVarItem[];
  plugins: PluginItem[];
  zshOptions: ZshOptionItem[];
  initScript: string;
} 