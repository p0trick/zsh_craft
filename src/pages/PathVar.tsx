import React from 'react';
import { Card } from 'antd';
import { useConfig } from '../context/ConfigContext';
import PathVarTable from '../components/PathVarTable';

const PathVar: React.FC = () => {
  const { config, updateConfig } = useConfig();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title="路径变量 (PATH)" bordered={false}>
        <PathVarTable
          value={config.pathVars}
          onChange={(list) => updateConfig({ pathVars: list })}
        />
      </Card>
    </div>
  );
};

export default PathVar; 