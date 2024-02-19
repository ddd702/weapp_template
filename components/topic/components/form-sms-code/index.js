// index.js
import { validator, sleep } from '../../../../utils/util';

const topicBehaviour = require('../../behaviors/index');
const computedBehavior = require('miniprogram-computed').behavior;
Component({
  behaviors: [topicBehaviour, computedBehavior],
  properties: {
    phoneData: {
      type: Object,
      value: { phone: '' },
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    formValue: '',
    // timer: null,
    needTime: 0,
  },
  computed: {
    canSend(data) {
      return data.needTime <= 0;
    },
    sendText(data) {
      return `${data.needTime}s后再试`;
    },
  },
  timer: null,
  /**
   * 组件的方法列表
   */
  methods: {
    async onSubmit() {
      const { phoneId, duration } = this.data.content;
      if (!this.data.canSend) {
        return false;
      }
      this.triggerEvent('getPhoneData', phoneId);
      await sleep(0.3); //等待父组件更新，所以加一个延时
      const { phone } = this.data.phoneData;
      if (!validator.checkPhone(phone)) {
        return wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
        });
      }
      this.setData({
        needTime: duration || 60,
      });
      clearInterval(this.timer);
      wx.showToast({
        title: '发送成功',
      });
      this.timer = setInterval(() => {
        this.setData(
          {
            needTime: this.data.needTime - 1,
          },
          () => {
            if (this.data.needTime <= 0) {
              clearInterval(this.timer);
            }
          },
        );
      }, 1000);
    },
  },
  lifetimes: {
    attached() {
      clearInterval(this.timer);
    },
    detached() {
      clearInterval(this.timer);
    },
  },
});
