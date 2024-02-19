import { observable, action } from 'mobx-miniprogram';
import { ALIAS_TOKEN } from '../constants/index';
export const store = observable({
  userinfo: {},
  showAuthLogin: false,
  // action
  get hasLogin() {
    return this.userinfo && !!this.userinfo.token;
  },
  updateUIAuthLogin: action(function (payload) {
    console.log('updateUIAuthLogin', payload);
    this.showAuthLogin = payload;
  }),
  updateUserinfo: action(function (payload) {
    if (payload && payload.token) {
      wx.setStorageSync(ALIAS_TOKEN, payload.token);
      this.showAuthLogin = false;
      getApp().Bus.emit('onAfterUserLogin');
    } else {
      wx.setStorageSync(ALIAS_TOKEN, '');
    }
    this.userinfo = payload;
  }),
});
