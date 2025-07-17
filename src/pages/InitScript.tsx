import React from 'react';
import { Card } from 'antd';
import { useConfig } from '../context/ConfigContext';
import InitScriptEditor from '../components/InitScriptEditor';

const InitScript: React.FC = () => {
  const { config, updateConfig } = useConfig();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title="初始化脚本" bordered={false}>
        <InitScriptEditor
          value={config.initScript}
          onChange={val => updateConfig({ initScript: val })}
        />
      </Card>
    </div>
  );
};

export default InitScript; 