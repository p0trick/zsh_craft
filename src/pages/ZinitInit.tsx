import React from 'react';
import { Form, Input, Card } from 'antd';
import { useConfig } from '../context/ConfigContext';

const ZinitInit: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const zinitInit = config.zinitInit;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card title="zinit 初始化配置" bordered={false}>
        <Form
          layout="vertical"
          initialValues={zinitInit}
          onValuesChange={(_, values) => updateConfig({ zinitInit: values })}
        >
          <Form.Item label="brew路径 (可选)" name="brewPath">
            <Input placeholder="/opt/homebrew/bin/brew" allowClear />
          </Form.Item>
          <Form.Item label="zinitHome路径" name="zinitHome">
            <Input placeholder="${XDG_DATA_HOME:-${HOME}/.local/share}/zinit/zinit.git" allowClear />
          </Form.Item>
        </Form>
        <div className="mt-6">
          <div className="font-semibold mb-2">zinit初始化脚本片段：</div>
          <pre className="bg-gray-100 rounded p-3 text-xs overflow-x-auto">
{`if [[ -f "${zinitInit.brewPath}" ]] then
  eval "$(${zinitInit.brewPath} shellenv)"
fi

ZINIT_HOME="${zinitInit.zinitHome}"
[ ! -d $ZINIT_HOME ] && mkdir -p "$(dirname $ZINIT_HOME)"
[ ! -d $ZINIT_HOME/.git ] && git clone https://github.com/zdharma-continuum/zinit.git "$ZINIT_HOME"
source "$ZINIT_HOME/zinit.zsh"

autoload -Uz _zinit
(( \${+_comps} )) && _comps[zinit]=_zinit
 
zinit ice from"gh-r" as"command" atload'eval "$(starship init zsh)"'
zinit load starship/starship
 `}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default ZinitInit; 