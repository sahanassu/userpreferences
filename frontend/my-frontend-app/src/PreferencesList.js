import React from 'react';
import { List, Typography, Row, Col } from 'antd';

const PreferencesList = ({ preferences }) => {
  return (
    <List
      dataSource={preferences}
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
  );
};

export default PreferencesList;
  