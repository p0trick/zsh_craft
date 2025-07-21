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
  group?: string; // 新增组字段
}

export interface PluginItem {
  name: string;
  description?: string;
  // loadType: 'load' | 'light' | 'snippet' | 'wait' | 'wait lucid';
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
    wait?: number;
    lucid?: boolean;
    light_mode?: boolean;
    if?: string;
    has?: string;
    on?: string;
    bindmap?: string;
    mv?: string;
    bpick?: string;
    atpull?: string;
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