// index.js
const topicBehaviour = require('../../behaviors/index');
Component({
  behaviors: [topicBehaviour],
  /**
   * 组件的初始数据
   */
  data: {
    visible: true, //vant的notice-bar在hide之后又show的时候会停止字符滚动，那就用visible控制他重新初始化
  },
  /**
   * 组件的方法列表
   */
  methods: {},
  pageLifetimes: {
    show() {
      this.setData({ visible: true });
    },
    hide() {
      this.setData({ visible: false });
    },
  },
});
