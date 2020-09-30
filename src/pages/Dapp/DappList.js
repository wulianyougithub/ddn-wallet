import React, { PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Avatar, Badge, Rate, Row, Col, Card } from 'antd';

@connect(({ dapp, user, loading }) => ({
  dapps: dapp.dapps,
  catagories: dapp.catagories,
  currentAccount: user.currentAccount,
  loading: loading.models.dapp,
}))
class DappList extends PureComponent {
  componentDidMount() {
    this.getCatagries();
    this.getDapps();
  }

  getCatagries = () => {
    const { dispatch, currentAccount } = this.props;
    dispatch({
      type: 'dapp/fetchCatagories',
    });
  };

  getDapps = () => {
    const { dispatch, currentAccount } = this.props;
    dispatch({
      type: 'dapp/fetchDapps',
      payload: { address: currentAccount.address },
    });
  };

  getCatagryName = type => {
    const { catagories } = this.props;
    let keys = Object.keys(catagories);
    let cName = '';
    keys.forEach(key => {
      if (catagories[key] === Number(type)) {
        cName = key;
      }
    });
    return cName;
  };

  lokkDetail = item => {
    const { match } = this.props;
    console.log('detail', item);
    router.push(`/dapp/dapp-detail?dappid=${item.transaction_id}`);
  };
  render() {
    const { dapps, catagories, loading } = this.props;
    console.log('Dapp', dapps, 'catagories', catagories, 'loading', loading);

    return (
      <div>
        <h1>Dapp</h1>
        <Row gutter={24}>
          {dapps.list &&
            dapps.list.length > 0 &&
            dapps.list.map(item => {
              console.log('item', item);
              return (
                <Col span={6} style={{ margin: '10px 0' }}>
                  <Card bordered={false}>
                    <div
                      style={{
                        minHeight: '120px',
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <Avatar
                          size={48}
                          src={`${item.icon ? item.icon : item.name.slice(0, 1)}`}
                        />
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: '24px' }}>
                        <div>{item.name}</div>
                        <div>
                          <Rate
                            allowHalf
                            disabled
                            defaultValue={2.5}
                            style={{ fontSize: '10px' }}
                          />
                          （234）
                        </div>
                        <div>{this.getCatagryName(item.category)}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ textAlign: 'center' }}>
                        <Badge color="green" text="已安装" />
                      </div>
                      <div style={{ padding: '10px 20px' }}>
                        <Button
                          block
                          type="primary"
                          shape="round"
                          onClick={() => this.lokkDetail(item)}
                        >
                          打 开
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </div>
    );
  }
}

export default DappList;