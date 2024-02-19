// index.js
import { store } from '../../store/index';
import { getVipAcg } from '../../api/index';
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

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
  // 处理事件，diy
  async onClick(e) {
    const { dataset } = e.currentTarget;
    console.warn('获取点击目标附带的data', dataset);
    switch (dataset.index) {
      case '1':
        store.updateUIAuthLogin(true);
        break;
      case '2':
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(dataset.url)}`,
        });
        break;
      case '3':
        getApp().Bus.emit('setRedDot', {
          index: 2,
          show: true,
        });
        break;
      case '4':
        getApp().Bus.emit('setRedDot', {
          index: 2,
          show: false,
        });
        break;
      case '5':
        getApp().Bus.emit('setBadge', {
          index: 1,
          badge: '99+',
        });
        break;
      case '6':
        getApp().Bus.emit('setBadge', {
          index: 1,
          badge: '',
        });
        break;
      case '7':
        try {
          await getVipAcg();
          wx.showToast({
            title: 'getVipAcg ok',
          });
        } catch (error) {
          console.log(error);
        }
        break;
      case '8':
        wx.navigateTo({
          url: dataset.url,
        });
        break;
    }
  },
});
