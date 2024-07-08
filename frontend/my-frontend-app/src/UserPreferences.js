import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, Space, message, Table, List, Typography, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserPreferences = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [keyValues, setKeyValues] = useState([{ key: '', value: '', keyError: '', valueError: '' }]);
  const [isEditing, setIsEditing] = useState(false);
  const [deletedKeys, setDeletedKeys] = useState([]);
  const userId = '667a6424b2de1ef3a5653b0f';

  useEffect(() => {
    fetchUserPreferences();
  }, [userId]);

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/userPrefs/get/${userId}`);
      setUserPreferences(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showDrawer = (edit = false) => {
    if (edit && userPreferences) {
      setKeyValues(userPreferences.preferences.keyValues.map(kv => ({ key: kv.key, value: kv.value, keyError: '', valueError: '' })));
      setIsEditing(true);
    } else {
      setKeyValues([{ key: '', value: '', keyError: '', valueError: '' }]);
      setIsEditing(false);
    }
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setKeyValues([{ key: '', value: '', keyError: '', valueError: '' }]);
    setDeletedKeys([]);
  };

  const handleAddKeyValue = () => {
    setKeyValues([...keyValues, { key: '', value: '', keyError: '', valueError: '' }]);
  };

  const handleChangeKeyValue = (index, field, value) => {
    const updatedKeyValues = [...keyValues];
    updatedKeyValues[index][field] = value;
    if (field === 'key') {
      updatedKeyValues[index].keyError = '';
    } else if (field === 'value') {
      updatedKeyValues[index].valueError = '';
    }
    setKeyValues(updatedKeyValues);
  };

  const handleDeleteKeyValue = (index) => {
    const updatedKeyValues = [...keyValues];
    const deletedKey = updatedKeyValues[index].key;
    setDeletedKeys([...deletedKeys, deletedKey]);
    updatedKeyValues.splice(index, 1);
    setKeyValues(updatedKeyValues);
  };

  const validateKeyValues = () => {
    const keySet = new Set();
    const updatedKeyValues = [...keyValues];
    let valid = true;

    for (let i = 0; i < updatedKeyValues.length; i++) {
      const { key, value } = updatedKeyValues[i];
      if (!key) {
        updatedKeyValues[i].keyError = 'Key is required';
        valid = false;
      } else if (keySet.has(key)) {
        updatedKeyValues[i].keyError = 'Duplicate key found';
        valid = false;
      } else {
        keySet.add(key);
        updatedKeyValues[i].keyError = '';
      }

      if (!value) {
        updatedKeyValues[i].valueError = 'Value is required';
        valid = false;
      } else {
        updatedKeyValues[i].valueError = '';
      }
    }

    setKeyValues(updatedKeyValues);
    return valid;
  };

  const handleSavePreferences = async () => {
    if (!validateKeyValues()) return;

    try {
      await axios.post(`http://localhost:3000/userPrefs/add/${userId}/preferences`, { keyValues });
      message.success('Preferences saved successfully!');
      fetchUserPreferences(); // Fetch updated data after saving
      closeDrawer(); // Close the drawer after saving
    } catch (error) {
      console.error('Error saving preferences:', error);
      message.error('Failed to save preferences.');
    }
  };

  const handleUpdatePreferences = async () => {
    if (!validateKeyValues()) return;

    const updates = keyValues.map(({ key, value }) => ({ key, value }));

    // Delete preferences marked for deletion
    for (let key of deletedKeys) {
      try {
        await axios.delete(`http://localhost:3000/userPrefs/delete/${userId}/preferences/${key}`);
      } catch (error) {
        console.error('Error deleting preference:', error);
        message.error('Failed to delete preference.');
        return;
      }
    }

    try {
      await axios.patch(`http://localhost:3000/userPrefs/update/${userId}`, { preferences: { keyValues: updates } });
      message.success('Preferences updated successfully!');
      fetchUserPreferences();
      closeDrawer();
    } catch (error) {
      console.error('Error updating preferences:', error);
      message.error('Failed to update preferences.');
    }
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (
        <>
          <Input
            style={{ paddingLeft: 10 }}
            placeholder="Key"
            value={record.key}
            onChange={(e) => handleChangeKeyValue(index, 'key', e.target.value)}
          />
          {record.keyError && <Typography.Text type="danger">{record.keyError}</Typography.Text>}
        </>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text, record, index) => (
        <>
          <Input
            style={{ paddingLeft: 10 }}
            placeholder="Value"
            value={record.value}
            onChange={(e) => handleChangeKeyValue(index, 'value', e.target.value)}
          />
          {record.valueError && <Typography.Text type="danger">{record.valueError}</Typography.Text>}
        </>
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
    <div>
      {userPreferences && (
        <div style={{ marginLeft: 16, marginTop: 19 }}>
          <h2>User's Preferences</h2>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" onClick={() => showDrawer(false)}>
                Add Preferences
              </Button>
              <Button type="primary" onClick={() => showDrawer(true)} disabled={!userPreferences}>
                Edit Preferences
              </Button>
            </Space>
          </div>
          <List
            dataSource={userPreferences.preferences.keyValues}
            renderItem={(item) => (
              <List.Item>
                <Row style={{ width: '100%' }}>
                  <Col span={2}>
                    <Typography.Text>{item.key}</Typography.Text>
                  </Col>
                  <Col span={1}>
                    <Typography.Text>:</Typography.Text>
                  </Col>
                  <Col span={15}>
                    <Typography.Text>{item.value}</Typography.Text>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </div>
      )}

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
    </div>
  );
};

export default UserPreferences;
