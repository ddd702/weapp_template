// index.js

const topicBehaviour = require('../../behaviors/index');

Component({
  behaviors: [topicBehaviour],
  /**
   * 组件的方法列表
   */
  methods: {
    viewPhoto(e) {
      const { item, index } = e.currentTarget.dataset;
      wx.previewImage({
        current: item,
        urls: this.data.content.photos,
      });
    },
  },
});
