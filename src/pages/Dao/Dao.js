import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Icon, Table, Modal, message, Tabs, Divider } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getKeyStore } from '@/utils/authority';
import RegisteredOrg from './components/RegisteredOrg';
import Contribution from './components/Contribution';
// import RegisteredAssetDealerForm from './components/RegisteredAssetDealerForm';
import ChangeOrg from './components/ChangeOrg';
// import TransferAssets from './components/TransferAssets';
// import AOBTransaction from './components/AOBTransaction';
const { confirm } = Modal;
const { TabPane } = Tabs;
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
          <div style={{ display: 'flex' }}>
            <Contribution asset={record} />
            <Divider type="vertical" />
            <Button
              onClick={() => {
                router.push({ pathname: '/dao/detail', query: record });
              }}
            >
              详情
            </Button>
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
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        width: '10%',
        render: item => item / (1 * 100000000),
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
                {!(this.keyStore.address === record.received_address && record.state === 1)
                  ? formatMessage({ id: 'app.dao.dao-buyed' })
                  : '已出售'}
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
      exchangeTrsId: item.transaction_id,
      secret: phaseKey,
    };
    dispatch({
      type: 'dao/putExchange',
      payload: exchange,
      callback: response => {
        // console.log('response', response);
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
    const { dao, myOrgs, loading, myConfirmList } = this.props;
    const pageTitle = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <Icon type="home" />
          <span style={{ marginLeft: '20px' }}>{formatMessage({ id: 'app.dao.dao' })}</span>
        </div>
      </div>
    );
    // const tabList = [
    //   {
    //     key: 'delegate-list',
    //     tab: '组织号列表',
    //   },
    //   {
    //     key: 'votelist',
    //     tab: '我的组织号',
    //   },
    //   {
    //     key: 'forging',
    //     tab: '交易记录',
    //   },
    // ];
    return (
      <PageHeaderWrapper title={pageTitle}>
        <Tabs tabBarStyle={{ backgroundColor: 'white' }} defaultActiveKey="1">
          <TabPane tab={formatMessage({ id: 'app.dao.list' })} key="1">
            <Card
              bordered={false}
              // title={formatMessage({ id: 'app.dao.list' })}
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
          </TabPane>
          <TabPane tab={formatMessage({ id: 'app.dao.dao-my-org' })} key="2">
            <Card
              bordered={false}
              style={{ marginTop: 30 }}
              // title={formatMessage({ id: 'app.dao.dao-my-org' })}
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
          </TabPane>
          <TabPane tab={formatMessage({ id: 'app.dao.dao-whit-buy' })} key="3">
            <Card
              bordered={false}
              style={{ marginTop: 30 }}
              // title={formatMessage({ id: 'app.dao.dao-whit-buy' })}
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
          </TabPane>
        </Tabs>
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
