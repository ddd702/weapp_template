// index.js
const topicBehaviour = require('../../behaviors/index');
Component({
  behaviors: [topicBehaviour],
  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    height: 150,
    current: 0,
  },
  observers: {
    content: function (val) {
      let { height, content } = this.data;
      let { screenWidth } = getApp().globalData;
      if (content.lrPad) {
        screenWidth = screenWidth - content.lrPad;
      }
      val.list.map((item, index) => {
        //拿最高的那个作为swiper的高
        const shouldHeight = (screenWidth / item.width) * item.height;
        height = index === 0 ? shouldHeight : shouldHeight < height ? height : shouldHeight;
      });
      this.setData({
        list: val.list,
        height,
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      this.setData({ current: e.detail.current });
    },
  },
});
