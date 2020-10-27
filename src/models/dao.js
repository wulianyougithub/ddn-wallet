import {
  getIssuerByAddress,
  // getAobList,
  getDaos,
  getMyOrgs,
  createOrUpdateOrg,
  putDaoExchange,
  getConfirmExchange,
  putContra,
} from '@/services/api';

const initialState = {
  issuer: {},
  dao: {
    list: [],
    count: 0,
  },
  myOrgs: {
    list: [],
    count: 0,
  },
  myConfirmList: {
    list: [],
    count: 0,
  },
  transactions: [],
};

export default {
  namespace: 'dao',

  state: { ...initialState },

  effects: {
    *fetchIssuer({ payload }, { call, put }) {
      const response = yield call(getIssuerByAddress, payload);

      yield put({
        type: 'saveIssuer',
        payload: response,
      });

      return response.result;
    },
    *getMyOrg({ payload }, { call, put }) {
      const response = yield call(getMyOrgs, payload);
      yield put({
        type: 'saveMyOrgs',
        payload: response.result,
      });
    },
    *getDaoList({ payload }, { call, put }) {
      const response = yield call(getDaos, payload.address);

      if (response.success) {
        yield put({
          type: 'saveDaoList',
          payload: response.result,
        });
      }
    },
    *putExchange({ payload, callback }, { call }) {
      const response = yield call(putDaoExchange, payload);
      callback(response);
      // console.log('getAobTransfers payload', payload);

      // yield put({
      //   type: 'saveAoBTransfers',
      //   payload: response,
      // });
    },
    *getNeedConfirmExchange({ payload }, { call, put }) {
      const response = yield call(getConfirmExchange, payload);

      if (response.success) {
        yield put({
          type: 'saveMyConfirmList',
          payload: response.result,
        });
      }
    },
    *putOrg({ payload, callback }, { call }) {
      const res = yield call(createOrUpdateOrg, payload);
      callback(res);
    },
    *putContributions({ payload, callback }, { call }) {
      const res = yield call(putContra, payload);
      callback(res);
    },
  },

  reducers: {
    saveIssuer(state, { payload }) {
      return {
        ...state,
        issuer: payload.result || {},
      };
    },
    saveMyOrgs(state, { payload }) {
      // console.log('saveAssetsByIssuer payload', payload);

      return {
        ...state,
        myOrgs: {
          list: payload.rows,
          count: payload.total,
        },
      };
    },
    saveAoBTransfers(state, { payload }) {
      return {
        ...state,
        transactions: payload.result.rows,
      };
    },
    saveDaoList(state, { payload }) {
      // console.log('payload', payload);

      return {
        ...state,
        dao: {
          list: payload.rows,
          count: payload.total,
        },
      };
    },
    saveMyConfirmList(state, { payload }) {
      // console.log('payload', payload);

      return {
        ...state,
        myConfirmList: {
          list: payload.rows,
          count: payload.total,
        },
      };
    },
    reset() {
      return initialState;
    },
  },
};
