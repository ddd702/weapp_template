// 登录：负责与服务端创建起一个会话，这个会话实现静默登录以及相关的容错处理等
import request, { _request } from '../utils/request';
import { getCode } from '../utils/helper';
import { store } from '../store/index';
import { ALIAS_TOKEN } from '../constants/index';

const loginQueue = [];
let isLoginning = false; // 登陆锁

class Session {
  /**
   *
   * @param {Boolean} force 强制登陆
   * @returns
   */
  static login(force = false) {
    return new Promise((resolve, reject) => {
      // 未登陆, 则将请求入队, 登陆之后再依次把请求出队, 重放请求
      if (force || !store.hasLogin) {
        loginQueue.push({ resolve, reject });

        if (!isLoginning) {
          isLoginning = true;
          getCode()
            .then(code => {
              _request({
                url: '/front/wxlogin',
                data: { code },
                option: { selfControl: true },
              })
                .then(res => {
                  store.updateUserinfo({ ...res.data.userinfo, token: res.data.token });
                  isLoginning = false;
                  while (loginQueue.length) {
                    loginQueue.shift().resolve();
                  }
                })
                .catch(err => {
                  //store.updateUIAuthLogin(true);
                  isLoginning = false;
                  while (loginQueue.length) {
                    loginQueue.shift().reject(err);
                  }
                });
            })
            .catch(reject);
        }
      } else {
        resolve();
      }
    });
  }
  static logout() {
    store.updateUserinfo({});
    wx.removeStorageSync(ALIAS_TOKEN);
  }
  // 因为login可以确保调用接口之前登陆
  // 因此只需要在App.onLaunch的时候请求任意接口即可完成静默登陆功能
  static silenceLogin() {
    request({
      url: '/xct/customerUser/getUserInfo',
      option: { tokenEnable: true, selfControl: true, isClient: true },
    });
  }
}

export default Session;
