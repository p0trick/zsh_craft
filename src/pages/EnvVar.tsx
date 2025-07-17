import React from 'react';
import { Card, Divider } from 'antd';
import { useConfig } from '../context/ConfigContext';
import PathVarTable from '../components/PathVarTable';
import EnvVarTable from '../components/EnvVarTable';

const EnvVar: React.FC = () => {
  const { config, updateConfig } = useConfig();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title="路径变量 (PATH)" bordered={false} className="mb-6">
        <PathVarTable
          value={config.pathVars}
          onChange={(list) => updateConfig({ pathVars: list })}
        />
      </Card>
      <Divider />
      <Card title="普通环境变量" bordered={false}>
        <EnvVarTable
          value={config.envVars}
          onChange={(list) => updateConfig({ envVars: list })}
        />
      </Card>
    </div>
  );
};

export default EnvVar; 