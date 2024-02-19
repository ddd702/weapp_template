// 授权：负责与用户交互，获取与更新信息，以及权限的控制处理等
import { store } from '../store/index';

class Auth {
  static step = {
    // 阶段一：只有登录态，没有用户信息，没有手机号
    ONE: 1,

    // 阶段二：有用户信息，没有手机号
    TWO: 2,

    // 阶段三：有用户信息，有手机号
    THREE: 3,
  };

  /**
   *
   * 注意: must.then不能确保后面的流程, 而是只能确保显示了相关的UI
   * 而授权相关的UI需要一些请求等耗时操作, 要确保后续操作能够执行, 必须要使用Wx.notificationCenter
   *
   * @param {Number} step 步骤
   * @returns Promise
   */

  static must(step) {
    const { status: currentStep = Auth.step.ONE } = store.userinfo;
    console.log('currentStep ', currentStep);

    if (currentStep < step) {
      if (currentStep === Auth.step.ONE) {
        store.updateUIAuthUserinfo(true);
      }
      if (currentStep === Auth.step.TWO) {
        store.updateUIAuthPhone(true);
      }

      return Promise.reject();
    }

    return Promise.resolve();
  }

  static update() {
    return new Promise((resolve, reject) => {
      request({
        url: '/xct/customerUser/getUserInfo',
        option: { tokenEnable: true, selfControl: true, isClient: true },
      })
        .then(res => {
          store.updateUserinfo(res.data);
          resolve();
        })
        .catch(reject);
    });
  }
}

export const AuthTwoSuccess = 'authTwoSuccess';
export const AuthTwoFail = 'authTwoSuccess';
export const AuthThreeSuccess = 'authTwoSuccess';
export const AuthThreeFail = 'authTwoSuccess';

export default Auth;
