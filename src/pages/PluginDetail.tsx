import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Input, Button, Select, Switch, Space, Divider, message, Modal, Table, Popconfirm } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import type { PluginItem, EnvVarItem } from '../utils/configSchema';

const { TextArea } = Input;
const { Option } = Select;

const PluginDetail: React.FC = () => {
  const navigate = useNavigate();
  const { pluginIndex } = useParams<{ pluginIndex: string }>();
  const { config, updateConfig } = useConfig();
  const [form] = Form.useForm();
  const [envForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEnvModalVisible, setIsEnvModalVisible] = useState(false);
  const [editingEnvItem, setEditingEnvItem] = useState<EnvVarItem | null>(null);

  const isEdit = pluginIndex !== 'new';
  const currentPlugin = isEdit ? config.plugins[parseInt(pluginIndex!)] : undefined;

  // 获取当前插件的环境变量
  const pluginEnvVars = useMemo(() => {
    if (!currentPlugin?.name) return [];
    return config.envVars.filter(item => item.group === currentPlugin.name);
  }, [config.envVars, currentPlugin?.name]);

  useEffect(() => {
    if (currentPlugin) {
      let waitTime = 0;
      let wait = false;
      if (currentPlugin?.ice?.wait !== undefined){
        wait = true
        if (currentPlugin?.ice?.wait !== 0){
          waitTime = currentPlugin?.ice?.wait
        }
      }
      form.setFieldsValue({
        name: currentPlugin.name,
        description: currentPlugin.description,
        // loadType: currentPlugin.loadType || 'load',
        // waitTime: currentPlugin.waitTime,
        ...currentPlugin.ice,
        wait,
        waitTime
      });
    } else {
      form.setFieldsValue({
        // loadType: 'load',
        blockf: false,
        compile: false,
        wait: false,
        lucid: false,
        lightMode: false,
      });
    }
  }, [currentPlugin, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log("values", values.light_mode)
      let wait = values.wait ? values.waitTime ? values.waitTime : 0 : undefined;
      const plugin: PluginItem = {
        name: values.name,
        description: values.description,
        // loadType: values.loadType,
        // waitTime: (values.loadType === 'wait' || values.loadType === 'wait lucid') ? values.waitTime : undefined,
        ice: {
          from: values.from,
          as: values.as,
          pick: values.pick,
          atinit: values.atinit,
          atload: values.atload,
          atclone: values.atclone,
          depth: values.depth,
          blockf: values.blockf,
          compile: values.compile,
          wait: wait,
          lucid: values.lucid,
          light_mode: values.light_mode,
          if: values.if,
          has: values.has,
          on: values.on,
          bindmap: values.bindmap,
          mv: values.mv,
          bpick: values.bpick,
        },
      };

      const newPlugins = [...config.plugins];
      if (isEdit) {
        newPlugins[parseInt(pluginIndex!)] = plugin;
      } else {
        newPlugins.push(plugin);
      }

      updateConfig({ plugins: newPlugins });
      message.success(isEdit ? '插件更新成功' : '插件添加成功');
      navigate('/plugin');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/plugin');
  };

  // 环境变量相关函数
  const handleAddEnvVar = () => {
    if (!currentPlugin?.name) {
      message.warning('请先保存插件基本信息');
      return;
    }
    setEditingEnvItem(null);
    envForm.resetFields();
    setIsEnvModalVisible(true);
  };

  const handleEditEnvVar = (item: EnvVarItem) => {
    setEditingEnvItem(item);
    envForm.setFieldsValue({
      key: item.key,
      value: item.value
    });
    setIsEnvModalVisible(true);
  };

  const handleDeleteEnvVar = (key: string) => {
    const newEnvVars = config.envVars.filter(item => item.key !== key);
    updateConfig({ envVars: newEnvVars });
    message.success('删除成功');
  };

  const handleSaveEnvVar = async () => {
    try {
      const values = await envForm.validateFields();
      const newItem: EnvVarItem = {
        key: values.key,
        value: values.value,
        group: currentPlugin?.name
      };

      let newEnvVars: EnvVarItem[];
      if (editingEnvItem) {
        // 编辑模式
        newEnvVars = config.envVars.map(item => 
          item.key === editingEnvItem.key ? newItem : item
        );
      } else {
        // 新增模式
        newEnvVars = [...config.envVars, newItem];
      }

      updateConfig({ envVars: newEnvVars });
      setIsEnvModalVisible(false);
      message.success(editingEnvItem ? '更新成功' : '添加成功');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleCancelEnvVar = () => {
    setIsEnvModalVisible(false);
    setEditingEnvItem(null);
    envForm.resetFields();
  };

  // 环境变量表格列定义
  const envColumns = [
    {
      title: '变量名',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '变量值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnvVarItem) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditEnvVar(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm 
            title="确定删除这个环境变量？" 
            onConfirm={() => handleDeleteEnvVar(record.key)}
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              danger
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card 
        title={
          <div className="flex items-center gap-2">
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={handleBack}
              className="p-0 h-auto"
            />
            <span>{isEdit ? '编辑插件' : '新增插件'}</span>
          </div>
        }
        bordered={false}
        extra={
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={loading}
          >
            保存
          </Button>
        }
      >
        <Form form={form} layout="vertical" className="max-w-2xl">
          {/* 基本信息 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">基本信息</h3>
            <Form.Item
              label="插件名称"
              name="name"
              rules={[{ required: true, message: '请输入插件名称' }]}
            >
              <Input placeholder="例如: zsh-users/zsh-autosuggestions" />
            </Form.Item>
            
            <Form.Item label="插件说明" name="description">
              <Input placeholder="插件的功能描述" />
            </Form.Item>
          </div>

          <Divider />

          {/* Ice 修饰符 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Ice 修饰符</h3>
            
            <Form.Item label="来源 (from)" name="from">
              <Select placeholder="选择来源" allowClear>
                <Option value="gh-r">gh-r - GitHub Release</Option>
                <Option value="gh">gh - GitHub</Option>
                <Option value="git">git - Git仓库</Option>
              </Select>
            </Form.Item>

            <Form.Item label="加载类型 (as)" name="as">
              <Select placeholder="选择加载类型" allowClear>
                <Option value="command">command - 作为命令</Option>
                <Option value="program">program - 作为程序</Option>
                <Option value="completion">completion - 作为补全</Option>
              </Select>
            </Form.Item>

            <Form.Item label="选择文件 (pick)" name="pick">
              <Input placeholder="例如: bin/fzf" />
            </Form.Item>

            <Form.Item label="初始化前执行 (atinit)" name="atinit">
              <TextArea 
                rows={3} 
                placeholder="在插件初始化前执行的命令"
              />
            </Form.Item>

            <Form.Item label="加载后执行 (atload)" name="atload">
              <TextArea 
                rows={3} 
                placeholder="在插件加载后执行的命令"
              />
            </Form.Item>

            <Form.Item label="克隆后执行 (atclone)" name="atclone">
              <TextArea 
                rows={3} 
                placeholder="在插件克隆后执行的命令"
              />
            </Form.Item>

            <Form.Item label="克隆深度 (depth)" name="depth">
              <Input type="number" placeholder="Git克隆深度" />
            </Form.Item>

            <Form.Item label="按键映射 (bindmap)" name="bindmap">
              <Input placeholder="例如: ^R -> ^H" />
            </Form.Item>

            <Form.Item label="移动文件 (mv)" name="mv">
              <Input placeholder="例如: yarn* -> yarn" />
            </Form.Item>

            <Form.Item label="选择二进制 (bpick)" name="bpick">
              <Input placeholder="例如: *.tar.gz" />
            </Form.Item>

            <Space size="large">
              <Form.Item label="阻止补全 (blockf)" name="blockf" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="编译脚本 (compile)" name="compile" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="延时加载(wait)" name="wait" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="静默模式 (lucid)" name="lucid" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="轻量模式 (light-mode)" name="light_mode" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Space>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.wait !== currentValues.wait}
            >
              {({ getFieldValue }) => {
                const waitEnabled = getFieldValue('wait');
                
                return waitEnabled ? (
                  <Form.Item
                    label="等待时间 (wait)"
                    name="waitTime"
                    extra="输入数字表示秒数，例如: 1 表示1秒后加载（可选）"
                  >
                    <Input placeholder="例如: 1" />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>

            <Divider />

            {/* 加载条件 */}
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-3">加载条件</h4>
              
              <Form.Item label="条件判断 (if)" name="if">
                <TextArea 
                  rows={3} 
                  placeholder="例如: [[ -n $commands[fzf] ]]"
                />
              </Form.Item>

              <Form.Item label="命令检查 (has)" name="has">
                <Input placeholder="例如: docker" />
              </Form.Item>

              <Form.Item label="触发条件 (on)" name="on">
                <Input placeholder="例如: root" />
              </Form.Item>
            </div>
          </div>

          <Divider />

          {/* 环境变量设置 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">环境变量设置</h3>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddEnvVar}
                disabled={!currentPlugin?.name}
              >
                添加环境变量
              </Button>
            </div>
            
            {currentPlugin?.name ? (
              <div>
                <p className="text-gray-600 mb-3">
                  当前插件: <span className="font-medium">{currentPlugin.name}</span>
                  {pluginEnvVars.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      (共 {pluginEnvVars.length} 个环境变量)
                    </span>
                  )}
                </p>
                
                {pluginEnvVars.length > 0 ? (
                  <Table
                    columns={envColumns}
                    dataSource={pluginEnvVars}
                    rowKey="key"
                    pagination={false}
                    size="small"
                    className="bg-gray-50 rounded-lg"
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    暂无环境变量，点击上方按钮添加
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                请先保存插件基本信息，然后才能添加环境变量
              </div>
            )}
          </div>
        </Form>
      </Card>

      {/* 环境变量编辑弹窗 */}
      <Modal
        title={editingEnvItem ? '编辑环境变量' : '添加环境变量'}
        open={isEnvModalVisible}
        onOk={handleSaveEnvVar}
        onCancel={handleCancelEnvVar}
        okText="保存"
        cancelText="取消"
      >
        <Form form={envForm} layout="vertical">
          <Form.Item
            label="变量名"
            name="key"
            rules={[{ required: true, message: '请输入变量名' }]}
          >
            <Input placeholder="例如: FZF_DEFAULT_OPTS" />
          </Form.Item>
          
          <Form.Item
            label="变量值"
            name="value"
            rules={[{ required: true, message: '请输入变量值' }]}
          >
            <Input placeholder="例如: --height 40%" />
          </Form.Item>
          
          <div className="text-sm text-gray-500">
            此环境变量将自动归属于插件: <span className="font-medium">{currentPlugin?.name}</span>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PluginDetail; 