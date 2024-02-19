// index.js
const loadingmoreBehavior = require('../../behaviors/pagination');
import { getVipAcg } from '../../api/index';
const PAGE_SIZE = 10; //每页多少记录
let Loading = false; //是否正在请求，貌似wxml不会怎么用到，就不放在data了
class Context {
  //data的一些初始化
  constructor(list = [], page = 0, total = 0, isInit = false) {
    //page=0代表第一页
    this.list = list;
    this.loadAll = false;
    this.page = page;
    this.total = total;
    this.isInit = isInit;
  }
}

Page({
  behaviors: [loadingmoreBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    ...new Context(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    getApp().Bus.on('onAfterUserLogin', this, this.init);
    this.init();
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
  onUnload: function () {
    getApp().Bus.off('onAfterUserLogin', this);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.triggerReachBottom(); //必须要定义有fetchList函数（返回promise的函数），data要有loadAll
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  init() {
    this.setData(new Context(), () => this.fetchList());
  },
  fetchList() {
    return new Promise(async (resolve, reject) => {
      let { page, list, total, loadAll } = this.data;
      if (loadAll || Loading) {
        return reject();
      }
      const isInit = true;
      Loading = true;
      const res = await getVipAcg({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      })
        .catch(() => {
          reject();
        })
        .finally(() => {
          Loading = false;
        });
      console.warn('fetchList res', res);
      if (!res) {
        return reject();
      }
      loadAll = res.list.length < PAGE_SIZE;
      if (res.list.length === 0) {
        this.setData({
          isInit,
          loadAll,
        });
        return resolve(res);
      }
      list = list.concat(res.list);
      total = res.total;
      page++;
      this.setData({
        loadAll,
        isInit,
        page,
        total,
        list,
      });
      resolve(res);
    });
  },
});
