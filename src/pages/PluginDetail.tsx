import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Switch, Space, Divider, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import type { PluginItem } from '../utils/configSchema';

const { TextArea } = Input;
const { Option } = Select;

const PluginDetail: React.FC = () => {
  const navigate = useNavigate();
  const { pluginIndex } = useParams<{ pluginIndex: string }>();
  const { config, updateConfig } = useConfig();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEdit = pluginIndex !== 'new';
  const currentPlugin = isEdit ? config.plugins[parseInt(pluginIndex!)] : undefined;

  useEffect(() => {
    if (currentPlugin) {
      form.setFieldsValue({
        name: currentPlugin.name,
        description: currentPlugin.description,
        // loadType: currentPlugin.loadType || 'load',
        // waitTime: currentPlugin.waitTime,
        ...currentPlugin.ice,
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
          wait: values.wait,
          // waitTime: values.waitTime,
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

            {/* <Form.Item
              label="加载方式"
              name="loadType"
              rules={[{ required: true, message: '请选择加载方式' }]}
            >
              <Select>
                <Option value="load">load - 完整加载</Option>
                <Option value="light">light - 轻量加载</Option>
                <Option value="snippet">snippet - 代码片段</Option>
                <Option value="wait">wait - 延迟加载</Option>
                <Option value="wait lucid">wait lucid - 静默延迟加载</Option>
              </Select>
            </Form.Item> */}

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.loadType !== currentValues.loadType}
            >
              {({ getFieldValue }) => {
                const loadType = getFieldValue('loadType');
                const showWaitTime = loadType === 'wait' || loadType === 'wait lucid';
                
                return showWaitTime ? (
                  <Form.Item
                    label="等待时间"
                    name="waitTime"
                    rules={[{ required: true, message: '请输入等待时间' }]}
                    extra="输入数字表示秒数，例如: 1 表示1秒后加载"
                  >
                    <Input placeholder="例如: 1" />
                  </Form.Item>
                ) : null;
              }}
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
              <Form.Item label="等待 (wait)" name="wait" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="静默模式 (lucid)" name="lucid" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="浅色模式 (light-mode)" name="lightMode" valuePropName="checked">
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
        </Form>
      </Card>
    </div>
  );
};

export default PluginDetail; 