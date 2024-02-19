// index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageid: '',
    bg: '#fff',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    this.setData({ pageid: id });
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
  onTopicFetch(e) {
    const config = e.detail;
    this.setData({
      bg: config.bg,
    });
    wx.setNavigationBarColor({
      frontColor: config.color || '#000000',
      backgroundColor: config.bg || '#ffffff',
    });
    wx.setNavigationBarTitle({ title: config.title });
  },
});
