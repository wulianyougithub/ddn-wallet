import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getKeyStore } from '@/utils/authority';
import { Button, Modal, Form, Input, message, Alert } from 'antd';
import { formatMessage } from 'umi/locale';
// import DdnJS from '@/utils/ddn-js';

const FormItem = Form.Item;

class IssueAssets extends PureComponent {
  state = {
    visible: false,
    errorMessage: '',
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      errorMessage: '',
    });
  };

  handleCreate = e => {
    e.preventDefault();
    const { asset, form, dispatch } = this.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      // console.log('Received values of form: ', values);
      // 获取到表单中的数据，并转化格式，发送请求
      const keystore = getKeyStore();
      const { phaseKey } = keystore;
      const amount = parseInt(values.price * 100000000, 10).toString();
      const exchange = {
        org_id: asset.org_id,
        price: amount,
        state: 0,
        receivedAddress: values.received_address,
        secret: phaseKey,
      };
      // console.log('transaction', transaction);
      dispatch({
        type: 'dao/putExchange',
        payload: exchange,
        callback: response => {
          // console.log('response', response);
          if (response.success) {
            this.setState({ visible: false });
            message.success('发行成功');
          } else {
            this.setState({ errorMessage: response.error });
          }
        },
      });
    });
  };

  render() {
    const { asset, form } = this.props;
    const { getFieldDecorator } = form;
    const { visible, errorMessage } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {formatMessage({ id: 'app.dao.dao-change' })}
        </Button>
        <Modal
          title={formatMessage({ id: 'app.dao.dao-change' })}
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
          destroyOnClose
        >
          <Form layout="vertical">
            <FormItem label={formatMessage({ id: 'app.dao.dao-title' })}>
              <div>{asset.currency || asset.name}</div>
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.dao.dao-price' })}>
              {getFieldDecorator('price', {
                rules: [{ required: true, message: 'Please input the dao amount price!' }],
              })(<Input type="number" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.dao.dao-reciveAddress' })}>
              {getFieldDecorator('received_address', {
                rules: [{ required: true, message: 'Please input the dao received address!' }],
              })(<Input />)}
            </FormItem>

            {errorMessage && <Alert type="error" message={errorMessage} />}
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedLssuanceAssets = Form.create()(IssueAssets);

export default connect(({ assets, loading }) => ({
  submitting: loading.effects['assets/postTrans'],
  assets,
}))(WrappedLssuanceAssets);
