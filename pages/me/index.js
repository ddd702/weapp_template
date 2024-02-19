// index.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../store/index';
import Session from '../../base/session';
Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ['showAuthLogin', 'hasLogin', 'userinfo'],
    actions: ['updateUIAuthLogin'],
  },
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().getTabBarData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onLoginOut() {
    Session.logout();
  },
  openFeedback() {
    const { brand, model, version, SDKVersion, system } = wx.getSystemInfoSync();
    wx.openEmbeddedMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        // 把1368数字换成你的产品ID，否则会跳到别的产品
        id: '636298',
        // 自定义参数，具体参考文档
        customData: {
          clientVersion: version,
          os: system,
          clientInfo: JSON.stringify({ brand, model, version, SDKVersion, system }),
        },
      },
    });
  },
  onClickAvatar() {
    // if (this.data.userinfo.status < 2) {
    //   this.onLoginTWO();
    // }
  },
  onLoginTWO() {
    store.updateUIAuthLogin(true);
  },
});
