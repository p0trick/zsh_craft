import React, { useState, useMemo } from 'react';
import { Card, Collapse, Button, Input, Space, Popconfirm, Form, Modal, message, Tag, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, DragOutlined } from '@ant-design/icons';
import { useConfig } from '../context/ConfigContext';
import { EnvVarItem } from '../utils/configSchema';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Panel } = Collapse;

// 可拖拽的环境变量项组件
const SortableEnvVarItem: React.FC<{
  item: EnvVarItem;
  onEdit: (item: EnvVarItem) => void;
  onDelete: (key: string) => void;
  isPluginGroup: boolean;
  groupName: string;
}> = ({ item, onEdit, onDelete, isPluginGroup, groupName }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
    >
      <div className="flex items-center flex-1">
        <div 
          {...attributes}
          {...listeners}
          className="mr-3 cursor-move text-gray-400 hover:text-gray-600"
        >
          <DragOutlined />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{item.key}</div>
          <div className="text-sm text-gray-600">{item.value}</div>
          {isPluginGroup && (
            <div className="text-xs text-blue-600 mt-1">
              <AppstoreOutlined className="mr-1" />
              插件环境变量
            </div>
          )}
        </div>
      </div>
      <Space>
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(item)}
          size="small"
        >
          编辑
        </Button>
        <Popconfirm 
          title="确定删除这个环境变量？" 
          onConfirm={() => onDelete(item.key)}
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
    </div>
  );
};

const EnvVar: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<EnvVarItem | null>(null);

  const [showGrouped, setShowGrouped] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 将环境变量按组分组，没有组的归为"默认组"
  const groupedEnvVars = useMemo(() => {
    const groups: { [key: string]: EnvVarItem[] } = {};
    config.envVars.forEach(item => {
      const group = item.group || '默认组';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
    });
    
    return groups;
  }, [config.envVars]);

  // 检查是否为插件组
  const isPluginGroup = (groupName: string) => {
    return config.plugins.some(plugin => plugin.name === groupName);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: EnvVarItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      key: item.key,
      value: item.value,
      group: item.group || ''
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    const newEnvVars = config.envVars.filter(item => item.key !== key);
    updateConfig({ envVars: newEnvVars });
    message.success('删除成功');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newItem: EnvVarItem = {
        key: values.key,
        value: values.value,
        group: values.group || undefined
      };

      let newEnvVars: EnvVarItem[];
      if (editingItem) {
        // 编辑模式
        newEnvVars = config.envVars.map(item => 
          item.key === editingItem.key ? newItem : item
        );
      } else {
        // 新增模式
        newEnvVars = [...config.envVars, newItem];
      }

      updateConfig({ envVars: newEnvVars });
      setIsModalVisible(false);
      message.success(editingItem ? '更新成功' : '添加成功');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = config.envVars.findIndex(item => item.key === active.id);
      const newIndex = config.envVars.findIndex(item => item.key === over?.id);

      const newEnvVars = arrayMove(config.envVars, oldIndex, newIndex);
      updateConfig({ envVars: newEnvVars });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card 
        title="环境变量" 
        bordered={false}
        extra={
          <Space>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">分组显示:</span>
              <Switch 
                checked={showGrouped} 
                onChange={setShowGrouped}
                size="small"
              />
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              新增环境变量
            </Button>
          </Space>
        }
      >
        {showGrouped ? (
          // 分组显示模式
          <Collapse defaultActiveKey={[]} ghost>
            {Object.entries(groupedEnvVars).map(([groupName, items]) => (
              <Panel 
                header={
                  <div className="flex items-center gap-2">
                    {isPluginGroup(groupName) && (
                      <Tag color="blue" icon={<AppstoreOutlined />}>
                        插件
                      </Tag>
                    )}
                    <span className="font-medium">
                      {groupName} ({items.length})
                    </span>
                  </div>
                } 
                key={groupName}
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items.map(item => item.key)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {items.map(item => (
                        <SortableEnvVarItem
                          key={item.key}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isPluginGroup={isPluginGroup(groupName)}
                          groupName={groupName}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </Panel>
            ))}
          </Collapse>
        ) : (
          // 不分组显示模式 - 支持拖拽排序
          <div>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                💡 不分组模式：可以拖拽环境变量进行排序，生成时会按照此顺序输出
              </div>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={config.envVars.map(item => item.key)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {config.envVars.map(item => (
                    <SortableEnvVarItem
                      key={item.key}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isPluginGroup={isPluginGroup(item.group || '')}
                      groupName={item.group || '默认组'}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </Card>

      {/* 新增/编辑环境变量弹窗 */}
      <Modal
        title={editingItem ? '编辑环境变量' : '新增环境变量'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="变量名"
            name="key"
            rules={[{ required: true, message: '请输入变量名' }]}
          >
            <Input placeholder="例如: EDITOR" />
          </Form.Item>
          
          <Form.Item
            label="变量值"
            name="value"
            rules={[{ required: true, message: '请输入变量值' }]}
          >
            <Input placeholder="例如: nvim" />
          </Form.Item>
          
          <Form.Item
            label="分组"
            name="group"
            extra="可选，留空将归入默认组。如果输入插件名称，将自动关联到该插件"
          >
            <Input placeholder="例如: 编辑器配置 或 插件名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnvVar; 