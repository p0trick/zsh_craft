import React from 'react';
import { Card } from 'antd';
import { useConfig } from '../context/ConfigContext';
import ZshOptionTable from '../components/ZshOptionTable';

const ZshOption: React.FC = () => {
  const { config, updateConfig } = useConfig();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title="zsh 选项配置" bordered={false}>
        <ZshOptionTable
          value={config.zshOptions}
          onChange={(list) => updateConfig({ zshOptions: list })}
        />
      </Card>
    </div>
  );
};

export default ZshOption; 