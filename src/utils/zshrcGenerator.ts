import type { ZshConfig, AliasItem, PathVarItem, EnvVarItem, PluginItem, ZshOptionItem } from '../utils/configSchema';

function generatePluginBlocks(plugins: PluginItem[]): string[] {
  // 按加载方式和等待时间分组插件
  const groups: { [key: string]: PluginItem[] } = {};
  
  plugins.forEach(plugin => {
    let groupKey: string = plugin.loadType;
    if (plugin.loadType === 'wait' || plugin.loadType === 'wait lucid') {
      const waitTime = plugin.waitTime || '0';
      groupKey = `${plugin.loadType}:${waitTime}`;
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(plugin);
  });

  const blocks: string[] = [];
  
  Object.entries(groups).forEach(([groupKey, groupPlugins]) => {
    if (groupKey.startsWith('wait') || groupKey.startsWith('wait lucid')) {
      // 对于wait和wait lucid，使用for语法
      const [loadType, waitTime] = groupKey.split(':');
      
      // 检查是否有复杂配置的插件
      const complexPlugins = groupPlugins.filter(p => p.ice && Object.keys(p.ice).length > 0);
      const simplePlugins = groupPlugins.filter(p => !p.ice || Object.keys(p.ice).length === 0);
      
      // 处理简单插件，使用for语法
      if (simplePlugins.length > 0) {
        const pluginNames = simplePlugins.map(p => p.name).join(' \\\n\t');
        let zinitCommand;
        if (loadType === 'wait') {
          zinitCommand = `zinit wait"${waitTime}" for \\\n\t${pluginNames}`;
        } else {
          zinitCommand = `zinit wait"${waitTime}" lucid for \\\n\t${pluginNames}`;
        }
        blocks.push(zinitCommand);
      }
      
      // 处理复杂插件，也使用for语法，但需要先设置ice
      if (complexPlugins.length > 0) {
        complexPlugins.forEach(plugin => {
          const iceModifiers = buildIceModifiers(plugin);
          const conditions = buildConditions(plugin);
          const allModifiers = [...iceModifiers, ...conditions];
          const iceLine = allModifiers.length > 0 ? `zinit ice ${allModifiers.join(' ')}\n` : '';
          
          let zinitCommand;
          if (loadType === 'wait') {
            zinitCommand = `zinit wait"${waitTime}" for ${plugin.name}`;
          } else {
            zinitCommand = `zinit wait"${waitTime}" lucid for ${plugin.name}`;
          }
          
          blocks.push(`${iceLine}${zinitCommand}${plugin.description ? `  # ${plugin.description}` : ''}`);
        });
      }
    } else {
      // 对于其他加载方式，单独处理每个插件
      groupPlugins.forEach(plugin => {
        const iceModifiers = buildIceModifiers(plugin);
        const conditions = buildConditions(plugin);
        const allModifiers = [...iceModifiers, ...conditions];
        const iceLine = allModifiers.length > 0 ? `zinit ice ${allModifiers.join(' ')}\n` : '';
        const zinitCommand = `zinit ${plugin.loadType} ${plugin.name}`;
        
        blocks.push(`${iceLine}${zinitCommand}${plugin.description ? `  # ${plugin.description}` : ''}`);
      });
    }
  });
  
  return blocks;
}

function buildIceModifiers(plugin: PluginItem): string[] {
  const modifiers = [];
  if (plugin.ice) {
    if (plugin.ice.from) modifiers.push(`from"${plugin.ice.from}"`);
    if (plugin.ice.as) modifiers.push(`as"${plugin.ice.as}"`);
    if (plugin.ice.pick) modifiers.push(`pick"${plugin.ice.pick}"`);
    if (plugin.ice.atinit) modifiers.push(`atinit"${plugin.ice.atinit}"`);
    if (plugin.ice.atload) modifiers.push(`atload"${plugin.ice.atload}"`);
    if (plugin.ice.atclone) modifiers.push(`atclone"${plugin.ice.atclone}"`);
    if (plugin.ice.depth) modifiers.push(`depth${plugin.ice.depth}`);
    if (plugin.ice.blockf) modifiers.push('blockf');
    if (plugin.ice.compile) modifiers.push('compile');
    if (plugin.ice.bindmap) modifiers.push(`bindmap"${plugin.ice.bindmap}"`);
    if (plugin.ice.mv) modifiers.push(`mv"${plugin.ice.mv}"`);
    if (plugin.ice.bpick) modifiers.push(`bpick"${plugin.ice.bpick}"`);
  }
  return modifiers;
}

function buildConditions(plugin: PluginItem): string[] {
  const conditions = [];
  if (plugin.conditions) {
    if (plugin.conditions.wait) conditions.push(`wait"${plugin.conditions.wait}"`);
    if (plugin.conditions.lucid) conditions.push('lucid');
    if (plugin.conditions.if) conditions.push(`if"${plugin.conditions.if}"`);
    if (plugin.conditions.has) conditions.push(`has"${plugin.conditions.has}"`);
    if (plugin.conditions.on) conditions.push(`on"${plugin.conditions.on}"`);
  }
  return conditions;
}

export function generateZshrc(config: ZshConfig): string {
  // 1. zinit初始化
  const zinitInitBlock = `#!/bin/zsh\n\nif [[ -f "${config.zinitInit.brewPath}" ]] then\n  # If you're using macOS, you'll want this enabled\n  eval \"$(/${config.zinitInit.brewPath} shellenv)\"\nfi\n\nZINIT_HOME=\"${config.zinitInit.zinitHome}\"\n[ ! -d $ZINIT_HOME ] && mkdir -p \"$(dirname $ZINIT_HOME)\"\n[ ! -d $ZINIT_HOME/.git ] && git clone https://github.com/zdharma-continuum/zinit.git \"$ZINIT_HOME\"\nsource \"$ZINIT_HOME/zinit.zsh\"\n\nautoload -Uz _zinit\n(( \${+_comps} )) && _comps[zinit]=_zinit\n\nzinit ice from"gh-r" as"command" atload'eval "$(starship init zsh)"'
zinit load starship/starship\n### End of Zinit's installer chunk\n`;

  // 2. alias
  const aliasBlock = [
    '#####################',
    '# ALIASES           #',
    '#####################',
    ...config.aliases.map((a: AliasItem) => `alias ${a.name}="${a.alias}"${a.description ? `  # ${a.description}` : ''}`),
    '',
  ].join('\n');

  // 3. 路径变量
  const pathBlock = [
    '#####################',
    '# PATH VARIABLES    #',
    '#####################',
    ...config.pathVars.map((p: PathVarItem) => `export PATH="$PATH:${p.path}"  # ${p.name}`),
    '',
  ].join('\n');

  // 4. 环境变量
  const envBlock = [
    '#####################',
    '# ENV VARIABLES     #',
    '#####################',
    ...config.envVars.map((e: EnvVarItem) => `export ${e.key}="${e.value}"`),
    '',
  ].join('\n');

  // 5. zsh选项
  const zshOptBlock = [
    '#####################',
    '# ZSH OPTIONS       #',
    '#####################',
    ...config.zshOptions.map((o: ZshOptionItem) => `${o.option}${o.description ? `  # ${o.description}` : ''}`),
    '',
  ].join('\n');

  // 6. 插件配置
  const pluginBlock = [
    '#####################',
    '# PLUGINS           #',
    '#####################',
    ...generatePluginBlocks(config.plugins),
    '',
  ].join('\n');

  // 7. 初始化脚本
  const initScriptBlock = [
    '#####################',
    '# INIT SCRIPT       #',
    '#####################',
    config.initScript || '',
    '',
  ].join('\n');

  // 拼接所有部分
  return [
    zinitInitBlock,
    aliasBlock,
    pathBlock,
    envBlock,
    zshOptBlock,
    pluginBlock,
    initScriptBlock,
  ].join('\n');
} 