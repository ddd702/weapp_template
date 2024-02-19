// index.js
const topicBehaviour = require('../../behaviors/index');
Component({
  behaviors: [topicBehaviour],
  /**
   * 组件的初始数据
   */
  data: {
    qnImg: '',
    loaded: false,
    height: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoaded(e) {
      const { height, width } = e.detail;
      const { screenWidth } = getApp().globalData;
      this.setData({
        loaded: true,
        height: height * (screenWidth / width),
      });
    },
  },
});
