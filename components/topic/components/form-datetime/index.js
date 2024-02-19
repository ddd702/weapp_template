// index.js
import dayjs from 'dayjs';
const topicBehaviour = require('../../behaviors/index');
const computedBehavior = require('miniprogram-computed').behavior;
Component({
  behaviors: [topicBehaviour, computedBehavior],
  /**
   * 组件的初始数据
   */
  data: {
    pickerVisible: false,
    selected: '',
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      }
      return val;
    },
    // qnImg: '',
  },
  computed: {
    minDate(data) {
      return new Date(data.content.minDate).getTime();
    },
    maxDate(data) {
      return new Date(data.content.maxDate).getTime();
    },
    formValue(data) {
      let formatStr = 'YYYY/MM/DD';
      const { content } = data;
      if (content.type == 'datetime') {
        formatStr = 'YYYY/MM/DD HH:mm';
      } else if (content.type == 'time') {
        return data.selected;
        // formatStr = 'HH:mm:ss'
      } else if (content.type == 'year-month') {
        formatStr = 'YYYY/MM';
      }
      return data.selected ? dayjs(data.selected).format(formatStr) : '';
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onConfirm(e) {
      console.warn('YYYY/MM', e);
      this.setData({
        selected: e.detail,
        pickerVisible: false,
      });
    },
    openPicker() {
      this.setData({
        pickerVisible: true,
      });
    },
    onClose() {
      this.setData({
        pickerVisible: false,
      });
    },
  },
});
