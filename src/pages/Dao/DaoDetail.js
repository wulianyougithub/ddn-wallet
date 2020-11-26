import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Icon, Modal, message, Descriptions } from 'antd';
import { formatMessage } from 'umi/locale';
// import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getKeyStore } from '@/utils/authority';

const { confirm } = Modal;
class DaoDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.keyStore = getKeyStore();
  }

  componentDidMount() {
    const {
      dispatch,
      history: { location },
    } = this.props;

    dispatch({
      type: 'dao/getDaoDetail',
      payload: { org_id: location.query.org_id },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/reset',
    });
  }

  buy = item => {
    const { dispatch } = this.props;
    const keystore = getKeyStore();
    const { phaseKey } = keystore;
    const exchange = {
      org_id: item.org_id,
      price: item.price,
      state: 1,
      amount: item.amount,
      senderAddress: item.received_address,
      receivedAddress: item.sender_address,
      recipientId: item.sender_address,
      exchangeTrsId: item.transaction_id,
      secret: phaseKey,
    };
    dispatch({
      type: 'dao/putExchange',
      payload: exchange,
      callback: response => {
        if (response.success) {
          message.success('交易成功');
        } else {
          message.error(response.error);
        }
      },
    });
  };

  showConfirm = item => {
    const that = this;
    confirm({
      title: '您想买它吗?',
      onOk() {
        that.buy(item);
      },
      onCancel() {},
    });
  };

  render() {
    const { detail } = this.props;
    const pageTitle = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <Icon type="home" />
          <span style={{ marginLeft: '20px' }}>{formatMessage({ id: 'app.dao.dao' })}</span>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper title={pageTitle}>
        <Card bordered={false}>
          <Descriptions
            style={{
              marginBottom: 32,
              fontSize: 16,
            }}
            layout="vertical"
          >
            <Descriptions.Item span={3} label="组织号id:">
              {detail.org_id}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="组织号名称:">
              {detail.name}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="所有者:">
              {detail.address}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="链接:">
              {detail.url}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="标签:">
              {detail.tags}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="交易id:">
              {detail.transaction_id}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ dao, loading }) => ({
  detail: dao.detail,
  loading: loading.effects['dao/getAobList'],
}))(DaoDetail);
