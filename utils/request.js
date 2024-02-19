import dayjs from 'dayjs';
import Config from '../config';
import {
  ALIAS_TOKEN,
  REQ_CODE,
  REQ_MSG,
  CODE_NOLOGIN,
  CODE_SUCCESS2,
  CODE_SUCCESS,
  CODE_LOGINTWO,
} from '../constants/index';
import Session from '../base/session';
import { store } from '../store/index';
let setUrl = function (url) {
  //补全url
  if (/^(http)/.test(url)) {
    return url;
  }
  return Config.baseUrl + url;
};
// 主要处理多个接口并发, 需要确保先登陆的问题
/**
 *
 * @param  {Object} args 请求参数
 * @returns
 */
console.warn('ALIAS_TOKEN', ALIAS_TOKEN);

export default function request(args = {}) {
  const { option = {} } = args;
  const { keepLogin = true } = option;
  if (keepLogin) {
    return new Promise((resolve, reject) => {
      // 第一次逻辑判断有没有登陆, 假如session有效, 则直接调用接口
      Session.login()
        .then(() => {
          _request(args)
            .then(resolve)
            .catch(err => {
              if (err[REQ_CODE] === CODE_NOLOGIN) {
                Session.login(true).then(() => {
                  _request(args).then(resolve).catch(reject);
                });
              } else {
                reject(err);
              }
            });
        })
        .catch(reject);
    });
  } else {
    return _request(args);
  }
}

// 主要处理除了登陆以外的请求相关的逻辑
export function _request(args = {}) {
  let { url, data, method, option = {} } = args;
  const { tokenEnable } = option;
  return new Promise((resolve, reject) => {
    let params = { version: Config.apiVersion, ...data };

    if (tokenEnable) {
      params.token = wx.getStorageSync(ALIAS_TOKEN);
    }

    wx.showNavigationBarLoading();

    const requestTime = dayjs();
    wx.request({
      url: setUrl(url),
      // 全部接口默认使用POST请求
      method: method || 'post',
      data: params,
      timeout: 10000,
      success: res => {
        const responseTime = dayjs();
        new HttpLogger({
          start: requestTime,
          end: responseTime,
          url,
          params,
          res,
          baseUrl: Config.baseUrl,
        }).print();

        // 网络层异常
        if (res.statusCode !== 200) {
          wx.showToast({ title: `网络异常:${res.statusCode}`, icon: 'none' });
          console.error('[Debug]', `网络异常:${res.statusCode}`);
          return reject();
        }

        const response = { ...res.data, raw: res };
        if (res.data[REQ_CODE] === CODE_NOLOGIN) {
          wx.showToast({ title: '登录状态失效, 请重新登录', icon: 'none', mask: true });

          Session.logout();
          return setTimeout(() => {
            return wx.reLaunch({ url: '/pages/index/index' });
          }, 500);
        }
        if (res.data[REQ_CODE] === CODE_LOGINTWO) {
          store.updateUIAuthLogin(true);
          return reject(response);
        }
        // 业务层异常
        if (res.data[REQ_CODE] !== CODE_SUCCESS && res.data[REQ_CODE] !== CODE_SUCCESS2 && !option.noToast) {
          wx.showToast({ title: res.data[REQ_MSG], icon: 'none' });
          console.error('[Debug]', res.data[REQ_MSG]);
          return reject(response);
        }

        // 假如不需要通用业务层的通用处理方法, 可以直接设置selfControl来跳过
        // if (!selfControl) {
        //   // 通用业务层, 特定事件拦截
        //   // 5001 token无效

        // }

        if (res.data[REQ_CODE] === CODE_SUCCESS2 || res.data[REQ_CODE] === CODE_SUCCESS) {
          return resolve(response);
        }
        console.error(`[Debug] 非[${CODE_SUCCESS}]状态, `, res.data);
        reject(response);
      },
      fail: res => {
        if (res.errMsg.includes('request:fail')) {
          wx.showToast({ title: '网络异常', icon: 'none' });
        }

        reject();
      },
      complete: wx.hideNavigationBarLoading,
    });
  });
}

class HttpLogger {
  constructor({ start, end, url, params, res, baseUrl }) {
    this.start = start;
    this.end = end;
    this.url = url;
    this.params = params;
    this.res = res;
    this.baseUrl = baseUrl;
  }

  print() {
    // 因为app的onLaunch hook里包含http请求, 这时app尚未初始化完成, 导致request里调用app的全局状态出问题
    // FIXME: 考虑将debug参数放到配置文件
    // if (app.globalData.debug) {
    console.log('>============================================<');
    console.log(`Daddy is POST ${this.url}`);
    console.log(`Daddy's body: `, this.params);
    console.log(`Daddy receive ${this.res.data[REQ_CODE]}, and response: `);
    if (this.res.data[REQ_CODE] === CODE_SUCCESS) {
      console.log('[Success]data: ', this.res.data.data);
      console.log('[Success]message: ', this.res.data[REQ_MSG]);
    } else {
      console.log('[Fail]message: ', this.res.data[REQ_MSG]);
    }
    console.log('----------------------------------------------');
    console.log(`[Environment] baseUrl: ${this.baseUrl}`);
    console.log(
      `[Performance] Request at ${this.start.format('HH:mm:ss')}, response at ${this.end.format(
        'HH:mm:ss',
      )}, latency: ${this.end - this.start}ms.`,
    );
    console.log('>============================================<');
    // }
    // if (app.globalData.debug) {
    //   console.log('>-----------------------------------------------------<');
    //   console.log(`[info] 爸爸正在 POST ${params.url}`);
    //   console.log(`[info] 爸爸的请求体是: `, data);
    //   console.log(
    //     `[info] 儿子给我返回了 ${res.data.respCode}, 儿子的响应体是: `,
    //     res.data.data
    //   );
    //   console.log('>-----------------------------------------------------<');
    // }
  }
}
