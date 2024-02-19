// index.js
import { getQnImg } from '../../../../utils/util';
const topicBehaviour = require('../../behaviors/index');
Component({
  behaviors: [topicBehaviour],
  observers: {
    content: function (val) {
      if (!val.rects) {
        return;
      }
      val.rects.map(item => {
        (item.backgroundImage = item.bg ? `url(${getQnImg(item.bg, ['thumbnail/500x'])})` : 'none'),
          (item.width = (item.w / item.elW) * 100 + '%');
        item.height = (item.h / item.elH) * 100 + '%';
        item.left = (item.x / item.elW) * 100 + '%';
        item.top = (item.y / item.elH) * 100 + '%';
      });
      this.setData({
        rects: val.rects,
      });
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    rects: [],
  },
  /**
   * 组件的方法列表
   */
  methods: {},
  attached() {
    console.log('rects add', this.data);
  },
});
