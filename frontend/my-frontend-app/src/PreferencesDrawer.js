import React from 'react';
import { Button, Drawer, Input, Space, Table, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const PreferencesDrawer = ({
  drawerVisible,
  closeDrawer,
  keyValues,
  setKeyValues,
  handleAddKeyValue,
  handleChangeKeyValue,
  handleDeleteKeyValue,
  isEditing,
  handleSavePreferences,
  handleUpdatePreferences
}) => {
  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (
        <Input
          style={{ minWidth: 150 }}
          placeholder="Key"
          value={record.key}
          onChange={(e) => handleChangeKeyValue(index, 'key', e.target.value)}
        />
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text, record, index) => (
        <Input
          style={{ minWidth: 150 }}
          placeholder="Value"
          value={record.value}
          onChange={(e) => handleChangeKeyValue(index, 'value', e.target.value)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Button type="link" danger icon={<CloseOutlined />} onClick={() => handleDeleteKeyValue(index)} />
      ),
    },
  ];

  return (
    <Drawer
      title={isEditing ? 'Edit Preferences' : 'Add New Preferences'}
      placement="right"
      closable={false}
      onClose={closeDrawer}
      visible={drawerVisible}
      width={600}
    >
      <Button onClick={handleAddKeyValue} style={{ marginBottom: 16 }}>
        Add Key-Value
      </Button>

      <Table
        columns={columns}
        dataSource={keyValues}
        pagination={false}
        rowKey={(record, index) => index}
      />

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" onClick={isEditing ? handleUpdatePreferences : handleSavePreferences}>
          {isEditing ? 'Update' : 'Save'}
        </Button>
        <Button onClick={closeDrawer}>
          Cancel
        </Button>
      </Space>
    </Drawer>
  );
};

export default PreferencesDrawer;
