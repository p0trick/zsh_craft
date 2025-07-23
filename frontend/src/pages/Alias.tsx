import React from 'react';
import { Card } from 'antd';
import { useConfig } from '../context/ConfigContext';
import AliasTable from '../components/AliasTable';

const Alias: React.FC = () => {
  const { config, updateConfig } = useConfig();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card title="Alias 配置" bordered={false}>
        <AliasTable
          value={config.aliases}
          onChange={(list) => updateConfig({ aliases: list })}
        />
      </Card>
    </div>
  );
};

export default Alias; 