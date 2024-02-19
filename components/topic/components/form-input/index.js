// index.js
import { getWxPhoneNumber } from '../../../../api/index';
const topicBehaviour = require('../../behaviors/index');
Component({
  behaviors: [topicBehaviour],
  /**
   * 组件的初始数据
   */
  data: {
    autoSize: { maxHeight: 100, minHeight: 40 },
    formValue: '',
    // qnImg: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async onGetPhone(e) {
      console.warn('onGetPhone', e.detail);
      const { errMsg } = e.detail;
      if (errMsg !== 'getPhoneNumber:ok') {
        wx.showToast({
          title: errMsg,
          icon: 'none',
          mask: true,
        });
      } else {
        const { code, iv, encryptedData } = e.detail;
        const res = await getWxPhoneNumber({
          code,
        });
        this.setData({
          errMsg: '',
          formValue: res.phone,
        });
      }
    },
  },
});
