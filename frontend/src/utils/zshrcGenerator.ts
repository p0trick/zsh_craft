import type { ZshConfig, AliasItem, PathVarItem, EnvVarItem, PluginItem, ZshOptionItem } from './configSchema';

function generatePluginBlocks(plugins: PluginItem[]): string[] {
  const blocks: string[] = [];
  
  plugins.forEach((plugin) => {
    // if (groupKey.startsWith('wait') || groupKey.startsWith('wait lucid')) {
      // 对于wait和wait lucid，使用for语法
      // const [loadType, waitTime] = groupKey.split(':');
      
      // 检查是否有复杂配置的插件
      // const complexPlugins = groupPlugins.filter(p => p.ice && Object.keys(p.ice).length > 0);
      // const simplePlugins = groupPlugins.filter(p => !p.ice || Object.keys(p.ice).length === 0);
      
      // 处理简单插件，使用for语法
    //   if (simplePlugins.length > 0) {
    //     const pluginNames = simplePlugins.map(p => p.name).join(' \\\n\t');
    //     let zinitCommand = `zinit "${waitTime}" for \\\n\t${pluginNames}`;
    //     if (loadType === 'wait') {
    //       zinitCommand = `zinit wait"${waitTime}" for \\\n\t${pluginNames}`;
    //     } else {
    //       zinitCommand = `zinit wait"${waitTime}" lucid for \\\n\t${pluginNames}`;
    //     }
    //     blocks.push(zinitCommand);
    //   }
      
    //   // 处理复杂插件，也使用for语法，但需要先设置ice
    //   if (complexPlugins.length > 0) {
    //     complexPlugins.forEach(plugin => {
    //       const iceModifiers = buildIceModifiers(plugin);
    //       const iceLine = iceModifiers.length > 0 ? `zinit ice ${iceModifiers.join(' ')}\n` : '';
          
    //       let zinitCommand;
    //       if (loadType === 'wait') {
    //         zinitCommand = `zinit wait"${waitTime}" for ${plugin.name}`;
    //       } else {
    //         zinitCommand = `zinit wait"${waitTime}" lucid for ${plugin.name}`;
    //       }
          
    //       blocks.push(`${iceLine}${zinitCommand}${plugin.description ? `  # ${plugin.description}` : ''}`);
    //     });
    //   }
    // } else {
      // 对于其他加载方式，单独处理每个插件
      // groupPlugins.forEach(plugin => {
        const iceModifiers = buildIceModifiers(plugin);
        // const iceLine = iceModifiers.length > 0 ? `zinit  ${iceModifiers.join(' ')}\n` : '';
        const ice = iceModifiers.length > 0 ? `${iceModifiers.join(' ')} ` : '';
        const zinitCommand = `zinit ${ice}for ${plugin.name}`;
        
        blocks.push(`${zinitCommand}${plugin.description ? `  # ${plugin.description}` : ''}`);
      // });
    // }
  });
  
  return blocks;
}

// 辅助函数：转义单引号，将字符串包装在单引号中
function escapeSingleQuotes(value: string): string {
  // 将单引号替换为 '\'' (结束当前单引号，插入转义的单引号，开始新的单引号)
  const escaped = value.replace(/'/g, "'\\''");
  return `'${escaped}'`;
}

function buildIceModifiers(plugin: PluginItem): string[] {
  const modifiers = [];
  if (plugin.ice) {
    if (plugin.ice.from) modifiers.push(`from${escapeSingleQuotes(plugin.ice.from)}`);
    if (plugin.ice.as) modifiers.push(`as${escapeSingleQuotes(plugin.ice.as)}`);
    if (plugin.ice.pick) modifiers.push(`pick${escapeSingleQuotes(plugin.ice.pick)}`);
    if (plugin.ice.atinit) modifiers.push(`atinit${escapeSingleQuotes(plugin.ice.atinit)}`);
    if (plugin.ice.atload) modifiers.push(`atload${escapeSingleQuotes(plugin.ice.atload)}`);
    if (plugin.ice.atclone) modifiers.push(`atclone${escapeSingleQuotes(plugin.ice.atclone)}`);
    if (plugin.ice.depth) modifiers.push(`depth${plugin.ice.depth}`);
    if (plugin.ice.blockf) modifiers.push('blockf');
    if (plugin.ice.compile) modifiers.push('compile');
    if (plugin.ice.wait !== undefined) {
      if (plugin.ice.wait === 0) {
        modifiers.push('wait');
      } else {
        modifiers.push(`wait${escapeSingleQuotes(plugin.ice.wait.toString())}`);
      }
    }
    if (plugin.ice.lucid) modifiers.push('lucid');
    if (plugin.ice.light_mode) modifiers.push('light-mode');
    if (plugin.ice.if) modifiers.push(`if${escapeSingleQuotes(plugin.ice.if)}`);
    if (plugin.ice.has) modifiers.push(`has${escapeSingleQuotes(plugin.ice.has)}`);
    if (plugin.ice.on) modifiers.push(`on${escapeSingleQuotes(plugin.ice.on)}`);
    if (plugin.ice.bindmap) modifiers.push(`bindmap${escapeSingleQuotes(plugin.ice.bindmap)}`);
    if (plugin.ice.mv) modifiers.push(`mv${escapeSingleQuotes(plugin.ice.mv)}`);
    if (plugin.ice.bpick) modifiers.push(`bpick${escapeSingleQuotes(plugin.ice.bpick)}`);
    if (plugin.ice.atpull) modifiers.push(`atpull${escapeSingleQuotes(plugin.ice.atpull)}`);
  }
  return modifiers;
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
    envBlock,
    pathBlock,
    aliasBlock,
    zshOptBlock,
    pluginBlock,
    initScriptBlock,
  ].join('\n');
} 