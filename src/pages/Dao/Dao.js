import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Icon, Table, Modal, message } from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getKeyStore } from '@/utils/authority';
import RegisteredOrg from './components/RegisteredOrg';
import Contribution from './components/Contribution';
// import RegisteredAssetDealerForm from './components/RegisteredAssetDealerForm';
import ChangeOrg from './components/ChangeOrg';
// import TransferAssets from './components/TransferAssets';
// import AOBTransaction from './components/AOBTransaction';
const { confirm } = Modal;
class Dao extends PureComponent {
  constructor(props) {
    super(props);
    this.keyStore = getKeyStore();
    this.columns = [
      {
        title: formatMessage({ id: 'app.dao.dao-name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-tags' }),
        dataIndex: 'tags',
        key: 'tags',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-url' }),
        dataIndex: 'url',
        key: 'url',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-address' }),
        dataIndex: 'address',
        key: 'address',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-state' }),
        dataIndex: 'state',
        key: 'state',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.asset.operation' }),
        key: 'action',
        width: '30%',
        render: record => (
          <div>
            <ChangeOrg asset={record} />
          </div>
        ),
      },
    ];
    this.allColums = [
      {
        title: formatMessage({ id: 'app.dao.dao-name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-tags' }),
        dataIndex: 'tags',
        key: 'tags',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-url' }),
        dataIndex: 'url',
        key: 'url',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-address' }),
        dataIndex: 'address',
        key: 'address',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-state' }),
        dataIndex: 'state',
        key: 'state',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.asset.operation' }),
        key: 'action',
        width: '30%',
        render: record => (
          <div>
            <Contribution asset={record} />
          </div>
        ),
      },
    ];
    this.confirmColums = [
      {
        title: '组织号id',
        dataIndex: 'org_id',
        key: 'org_id',
        width: '20%',
      },
      {
        title: '发送者地址',
        dataIndex: 'sender_address',
        key: 'sender_address',
        width: '10%',
      },
      {
        title: '接收者地址',
        dataIndex: 'received_address',
        key: 'received_address',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-state' }),
        dataIndex: 'state',
        key: 'state',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.asset.operation' }),
        key: 'action',
        width: '30%',
        render: record => (
          <div>
            {record.state === 0 ? (
              <Button
                type="primary"
                onClick={() => {
                  this.showConfirm(record);
                }}
              >
                {formatMessage({ id: 'app.dao.dao-buy' })}
              </Button>
            ) : (
              <Button type="primary" danger disabled>
                {formatMessage({ id: 'app.dao.dao-buyed' })}
              </Button>
            )}
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // console.log('this.keyStore', this.keyStore);

    const params = {
      address: this.keyStore.address,
    };
    dispatch({
      type: 'dao/getDaoList',
      payload: params,
    });
    dispatch({
      type: 'dao/getNeedConfirmExchange',
      payload: params,
    });
    dispatch({
      type: 'dao/getMyOrg',
      payload: { address: this.keyStore.address },
    }).then(() => {
      // if (issuer) {
      //   dispatch({
      //     type: 'assets/fetchMyAssets',
      //     payload: issuer.name,
      //   });
      // }
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
      exchange_trs_id: item.exchange_trs_id,
      secret: phaseKey,
    };
    dispatch({
      type: 'dao/putExchange',
      payload: exchange,
      callback: response => {
        // console.log('response', response);
        if (response.success) {
          message.success('成功');
        } else {
          message.error('失败');
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
    const { dao, myOrgs, loading, myConfirmList } = this.props;
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
        <Card
          bordered={false}
          title={formatMessage({ id: 'app.dao.list' })}
          extra={<RegisteredOrg />}
        >
          <Table
            loading={loading}
            rowKey={record => record.transaction_id}
            dataSource={dao.list}
            columns={this.allColums}
            pagination={dao.count < 10 && false}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>
                {formatMessage({ id: 'app.dao.dao-trsId' })}: {record.transaction_id}
              </p>
            )}
          />
        </Card>
        <Card
          bordered={false}
          style={{ marginTop: 30 }}
          title={formatMessage({ id: 'app.dao.dao-my-org' })}
        >
          <Table
            loading={loading}
            rowKey={record => record.transaction_id}
            dataSource={myOrgs.list}
            columns={this.columns}
            pagination={myOrgs.count < 10 && false}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>
                {formatMessage({ id: 'app.dao.dao-trsId' })}: {record.transaction_id}
              </p>
            )}
          />
        </Card>
        <Card
          bordered={false}
          style={{ marginTop: 30 }}
          title={formatMessage({ id: 'app.dao.dao-whit-buy' })}
        >
          <Table
            loading={loading}
            rowKey={record => record.transaction_id}
            dataSource={myConfirmList.list}
            columns={this.confirmColums}
            pagination={myConfirmList.count < 10 && false}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>
                {formatMessage({ id: 'app.dao.dao-trsId' })}: {record.transaction_id}
              </p>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ dao, loading }) => ({
  issuer: dao.issuer,
  myOrgs: dao.myOrgs,
  dao: dao.dao,
  myConfirmList: dao.myConfirmList,
  loading: loading.effects['dao/getAobList'],
}))(Dao);
