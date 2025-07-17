import React from 'react';
import { Input } from 'antd';

interface InitScriptEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const InitScriptEditor: React.FC<InitScriptEditorProps> = ({ value, onChange }) => {
  return (
    <Input.TextArea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={12}
      placeholder="请输入自定义zsh脚本片段，将追加到zshrc末尾..."
      className="font-mono text-xs"
      allowClear
      autoSize={{ minRows: 8, maxRows: 20 }}
    />
  );
};

export default InitScriptEditor; 